import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QUESTIONS_PROMPT } from "@/services/Constants";

// Retry mechanism with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRetryableError = error.message?.includes('503') || 
                              error.message?.includes('overloaded') ||
                              error.message?.includes('Service Unavailable') ||
                              error.message?.includes('timeout');
      
      if (attempt === maxRetries || !isRetryableError) {
        console.log(`❌ All ${maxRetries} attempts failed for Gemini API`);
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`🔄 Gemini API attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Fallback to OpenRouter API
async function generateWithOpenRouter(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000",
      "X-Title": "AI Interview Question Generator"
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// Static question templates as ultimate fallback
function getStaticQuestions(jobPosition, interviewTypes) {
  const baseQuestions = [
    {
      question: `Can you tell me about your experience with ${jobPosition}?`,
      type: "Experience"
    },
    {
      question: "How do you approach problem-solving when faced with a challenging technical issue?",
      type: "Problem Solving"
    },
    {
      question: "Describe a project where you had to work with a team to achieve a common goal.",
      type: "Behavioral"
    },
    {
      question: "What interests you most about this role and our company?",
      type: "Motivation"
    },
    {
      question: "Can you walk me through your technical background and relevant skills?",
      type: "Technical"
    }
  ];

  // Add type-specific questions
  if (interviewTypes.includes('Technical')) {
    baseQuestions.push({
      question: "Explain a complex technical concept to someone without a technical background.",
      type: "Technical"
    });
  }
  
  if (interviewTypes.includes('Behavioral')) {
    baseQuestions.push({
      question: "Tell me about a time when you had to learn something new quickly.",
      type: "Behavioral"
    });
  }

  return baseQuestions.slice(0, 5); // Return 5 questions max
}

export async function POST(req){
  try {
    const {jobDescription, jobPosition, duration, interviewTypes} = await req.json();

    // Validate required fields
    if (!jobDescription || !jobPosition || !duration || !interviewTypes?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace('{{jobTitle}}', jobPosition)
      .replace('{{jobDescription}}', jobDescription)
      .replace('{{duration}}', duration)
      .replace('{{type}}', interviewTypes.join(', '));

    let text = "";
    let usedFallback = false;

    // Try Gemini API with retry mechanism
    try {
      if (process.env.GEMINI_API_KEY) {
        console.log("🤖 Attempting to generate questions with Google Gemini API...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          }
        });

        const result = await retryWithBackoff(async () => {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 30000)
          );
          
          return await Promise.race([
            model.generateContent(FINAL_PROMPT),
            timeoutPromise
          ]);
        });

        text = result?.response?.text?.() || "";
        console.log("✅ Successfully generated questions with Google Gemini API");
      } else {
        console.log("⚠️ GEMINI_API_KEY not found, skipping Gemini API");
        throw new Error("Gemini API key not configured");
      }
    } catch (geminiError) {
      console.log("❌ Gemini API failed:", geminiError.message);
      console.log("🔄 Attempting fallback to OpenRouter API...");
      
      // Fallback to OpenRouter
      try {
        if (process.env.OPENROUTER_API_KEY) {
          text = await generateWithOpenRouter(FINAL_PROMPT);
          usedFallback = true;
          console.log("✅ Successfully generated questions with OpenRouter API (fallback)");
        } else {
          console.log("⚠️ OPENROUTER_API_KEY not found, skipping OpenRouter API");
          throw new Error("OpenRouter API key not configured");
        }
      } catch (openRouterError) {
        console.log("❌ OpenRouter API also failed:", openRouterError.message);
        console.log("🆘 Using static questions as ultimate fallback...");
        // Ultimate fallback: static questions
        const staticQuestions = getStaticQuestions(jobPosition, interviewTypes);
        console.log("📋 Generated", staticQuestions.length, "static questions for", jobPosition);
        return NextResponse.json({
          success: true,
          data: {
            interviewQuestions: staticQuestions,
            totalQuestions: staticQuestions.length,
            estimatedDuration: duration + " minutes",
          },
          metadata: {
            jobPosition,
            duration,
            interviewTypes,
            generatedAt: new Date().toISOString(),
            fallbackUsed: "static",
            note: "AI services temporarily unavailable, using curated questions"
          },
        });
      }
    }

    if (!text) {
      throw new Error("No response from any AI model");
    }

    // Try to parse the JSON response
    let questionsData;
    try {
      // Look for the interviewQuestions array in the response
      const jsonMatch = text.match(/interviewQuestions\s*=\s*(\[[\s\S]*?\])/);
      if (jsonMatch) {
        questionsData = JSON.parse(jsonMatch[1]);
      } else {
        // Fallback: try to find any JSON array
        const fallbackMatch = text.match(/\[[\s\S]*\]/);
        if (fallbackMatch) {
          questionsData = JSON.parse(fallbackMatch[0]);
        } else {
          throw new Error("No valid JSON array found in response");
        }
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      // Fallback: minimal structured sample to keep UI working
      questionsData = [
        {
          question: "Can you tell me about your experience with the technologies mentioned in the job description?",
          type: "Experience",
        },
        {
          question: "How do you approach problem-solving when faced with a challenging technical issue?",
          type: "Problem Solving",
        },
        {
          question: "Describe a project where you had to work with a team to achieve a common goal.",
          type: "Behavioral",
        },
      ];
    }

    const serviceUsed = usedFallback ? "OpenRouter API (fallback)" : "Google Gemini API";
    console.log(`🎯 Final result: Generated ${questionsData.length} questions using ${serviceUsed}`);
    
    return NextResponse.json({
      success: true,
      data: {
        interviewQuestions: questionsData,
        totalQuestions: questionsData.length,
        estimatedDuration: duration + " minutes",
      },
      metadata: {
        jobPosition,
        duration,
        interviewTypes,
        generatedAt: new Date().toISOString(),
        fallbackUsed: usedFallback ? "openrouter" : "gemini",
        serviceUsed: serviceUsed,
        note: usedFallback ? "Gemini API temporarily unavailable, used OpenRouter" : undefined
      },
    });
  } catch (error) {
    console.error("Error generating interview questions (Gemini):", error);
    return NextResponse.json(
      {
        error: "Failed to generate interview questions",
        details: error.message,
      },
      { status: 500 }
    );
  }
}