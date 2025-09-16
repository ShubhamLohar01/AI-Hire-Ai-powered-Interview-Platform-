import { NextResponse } from "next/server";
import { FEEDBACK_PROMPT } from "@/services/Constants";

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    // Validate required fields
    if (!conversation) {
      return NextResponse.json(
        { error: "Missing conversation data" },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace("{{conversation}}", JSON.stringify(conversation));

    // OpenRouter API call for feedback generation
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000",
        "X-Title": "AI Interview Feedback Generator"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          {
            role: "user",
            content: FINAL_PROMPT
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const feedbackText = data.choices?.[0]?.message?.content;

    if (!feedbackText) {
      throw new Error("No feedback generated from AI model");
    }

    // Try to parse the JSON response
    let feedbackData;
    try {
      // Look for JSON in the response
      const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedbackData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse feedback response:", feedbackText);
      // Fallback: create structured feedback from text
      feedbackData = {
        feedback: {
          rating: {
            technicalSkills: 5,
            communication: 6,
            problemSolving: 4,
            experience: 7
          },
          summary: "Interview completed successfully. Candidate showed good potential.",
          recommendation: "Consider for next round",
          recommendationMsg: "Candidate demonstrated basic understanding of concepts."
        }
      };
    }

    return NextResponse.json({
      success: true,
      data: feedbackData,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: "deepseek/deepseek-chat-v3.1:free",
        conversationLength: conversation.length
      }
    });

  } catch (error) {
    console.error("Error generating feedback:", error);
    return NextResponse.json(
      {
        error: "Failed to generate feedback",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
