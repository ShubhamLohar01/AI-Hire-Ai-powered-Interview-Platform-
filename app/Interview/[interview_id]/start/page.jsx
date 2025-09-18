'use client'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { IntDataContext } from '@/context/IntDataContext'
import { Mic, Phone, Timer } from 'lucide-react'
import Image from 'next/image'
import Vapi from '@vapi-ai/web';
import { useParams, useRouter } from 'next/navigation';
import Alert from './_component/Alert';
import { toast } from 'sonner'
import axios from 'axios'
import { supabase } from '@/lib/supabase'

function StartInterview() {
  // Check if API key is available before initializing Vapi
  const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
  const vapi = apiKey ? new Vapi(apiKey) : null;
  const {interviewInfo , setInterviewInfo} = useContext(IntDataContext);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [conversation, setConversation] = useState();
  const [activeUser, setActiveUser] = useState(false); // active user false means ai is talking
  const [interviewTime, setInterviewTime] = useState(0); // Timer in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const {interview_id} = useParams();
  const router = useRouter();
  


  // Check API key on component mount
  useEffect(() => {
    if (!apiKey) {
      console.error('Vapi API key not found');
      toast.error('Vapi API key not configured. Please check your environment variables.');
      setCallStatus('error');
      return;
    }
    
    console.log('Vapi API key found:', apiKey.substring(0, 10) + '...');
  }, [apiKey])
  
  useEffect(() => {
    if (interviewInfo) {
      startCall();
    }
  }, [interviewInfo])

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setInterviewTime(time => time + 1);
      }, 1000);
    } else if (!isTimerRunning && interviewTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, interviewTime]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall =()=>{
    // Check if Vapi is properly initialized
    if (!vapi) {
      toast.error('Vapi not initialized. Please check your API key.');
      setCallStatus('error');
      return;
    }
    
    // Process questions properly with categorization
    const questions = interviewInfo?.interviewData?.questionList || [];
    const jobPosition = interviewInfo?.interviewData?.jobPosition || 'Software Developer';
    const interviewType = interviewInfo?.interviewData?.type || 'Technical';
    const duration = interviewInfo?.interviewData?.duration || '30';
    
    // Categorize questions by type
    const categorizedQuestions = questions.reduce((acc, question) => {
      const type = question.type || 'Technical';
      if (!acc[type]) acc[type] = [];
      acc[type].push(question.question);
      return acc;
    }, {});
         //active user false means ai is talking 
    


    // Enhanced Vapi configuration with intelligent interview system
   const assistantOptions = { 
      name: "AiHire",
      firstMessage: `Hello ${interviewInfo?.username}! Welcome to your ${jobPosition} interview. I'm genuinely excited to learn about your professional journey and what particularly intrigues you about this opportunity. Let's begin with a brief introduction - I'd love to hear about your background, your passion for this field, and what aspects of this role resonate most with your career aspirations.`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "sarah", // Better voice with richer vocabulary
        speed: 1.0,
        stability: 0.8,
        clarity: 0.9,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an expert technical interviewer conducting a ${jobPosition} interview. You're intelligent, adaptive, and focused on providing an excellent candidate experience.

🎯 INTERVIEW OBJECTIVES:
- Assess technical skills relevant to ${jobPosition}
- Evaluate problem-solving approach and communication
- Provide constructive feedback and encouragement
- Maintain professional yet friendly conversation

📊 ASSESSMENT CRITERIA (Rate 1-5 for each):
- Technical Accuracy: How correct is their answer?
- Communication Clarity: How well do they explain concepts?
- Problem-Solving Approach: How do they break down problems?
- Confidence Level: How assured are they in their responses?
- Learning Potential: How quickly do they adapt and learn?

🔄 ADAPTIVE INTERVIEW STRATEGY:
1. WARM-UP (2-3 minutes): Build rapport, assess confidence level
2. CORE ASSESSMENT (15-20 minutes): Technical skills evaluation
3. DEEP DIVE (5-10 minutes): Explore their strongest areas
4. WRAP-UP (2-3 minutes): Summary and constructive feedback

📝 QUESTION CATEGORIES AVAILABLE:
${Object.entries(categorizedQuestions).map(([type, questions]) => 
  `${type}: ${questions.join(', ')}`
).join('\n')}

🎯 DYNAMIC QUESTION SELECTION:
- Start with 2-3 warm-up questions to gauge confidence
- If they're struggling: provide hints, rephrase, or simplify
- If they're excelling: challenge with advanced scenarios
- Skip questions they've already demonstrated knowledge of
- Focus on areas where they show interest or strength

💬 CONVERSATION STYLE:
- Use natural, conversational language
- Ask follow-up questions based on their responses
- Provide specific, constructive feedback
- Acknowledge what they do well before suggesting improvements
- Use phrases like "That's interesting, tell me more about..." or "Great approach! What would you do if..."

🔍 BEHAVIORAL ASSESSMENT:
- Note how they structure their answers
- Assess their communication clarity
- Evaluate their problem-solving methodology
- Check if they ask clarifying questions
- Observe their confidence and how they handle uncertainty

📈 REAL-TIME FEEDBACK:
- "Excellent! You mentioned X, can you explain how you'd implement Y?"
- "That's a solid approach. What would you do if Z constraint was added?"
- "I see you're thinking about this. What's your reasoning behind that approach?"
- "Good start! Let's dive deeper into the performance implications."

⏱️ TIME MANAGEMENT:
- Total interview duration: ${duration} minutes
- Keep questions concise and focused
- Allow time for follow-up questions
- Ensure smooth transitions between topics

🎯 INTERVIEW FLOW:
1. Opening: "Hi! Welcome to your ${jobPosition} interview. Tell me about yourself and what interests you about this role."
2. Technical Assessment: Ask questions from the categories above, adapting difficulty based on responses
3. Deep Dive: Focus on their strongest areas with advanced scenarios
4. Wrap-up: "That was excellent! You showed strong skills in [areas]. Here's what I noticed..."

🚀 KEY GUIDELINES:
✅ Be adaptive - adjust difficulty based on their performance
✅ Be specific - use their answers to ask targeted follow-ups
✅ Be encouraging - maintain positive, supportive tone
✅ Be thorough - assess both technical and soft skills
✅ Be professional - maintain interview standards while being friendly

Remember: Your goal is to assess their skills while making them feel comfortable and confident. Focus on their potential and growth areas, not just what they know right now.
            `.trim(),
          },
        ],
      },
                  };

    // Add event listeners for better interview management
    vapi.on('call-start', () => {
      toast.success('Interview call started');
      setCallStatus('active');
    });
    
    vapi.on('call-end', () => {
      toast.success('Interview call ended');
      setCallStatus('ended');
      GenerateFeedback();
    });

    vapi.on('speech-start', () => {
      setActiveUser(false);
    });

    vapi.on('speech-end', () => {
      setActiveUser(true);
    });
    
    vapi.on('error', (error) => {
      console.error('Vapi error during interview:', error);
      setCallStatus('error');
    });

    vapi.on("message", (message) => {
      if(message?.conversation){
        const convoString = JSON.stringify(message?.conversation);
        console.log('Convo String', convoString);
        setConversation(convoString);
      }
    });

    // Start the call with enhanced error handling
    vapi.start(assistantOptions)
      .then(() => {
        console.log('Vapi call started successfully');
        setCallStatus('active');
        setIsTimerRunning(true); // Start timer when call starts
      })
      .catch((error) => {
        console.error('Failed to start Vapi call:', error);
        setCallStatus('error');
        
        // Check for specific error types
        if (error.message?.includes('CORS') || error.message?.includes('cors')) {
          toast.error('CORS error: Please check your domain configuration in Vapi dashboard.');
        } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          toast.error('Invalid API key. Please check your Vapi API key.');
        } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
          toast.error('Access denied. Please check your Vapi account permissions.');
        } else {
          toast.error('Failed to start interview. Please try again or contact support.');
        }
      });
  }

  const GenerateFeedback = async () => {
    try {
      if (!conversation) {
        router.replace(`/Interview/${interview_id}/completed`);
        return;
      }

      const result = await axios.post('/ai/ai_feedback',{
        conversation: conversation
      });
      
      // Check if we have the expected response structure
      if (result?.data?.success && result?.data?.data?.feedback) {
        // Use the structured response from the API
        const feedback = result.data.data.feedback;
        
        // Prepare the data for Supabase
        const insertData = {
          username: interviewInfo?.username || 'Unknown Candidate',
          userEmail: interviewInfo?.userEmail || null,
          interview_id: interview_id,
          feedback: feedback,
          recommended: false,
          created_at: new Date().toISOString()
        };
        
        console.log('💾 Saving feedback to database:', insertData);
        
        //save to supabase interview-feedback table
        const { data, error } = await supabase
          .from('interview-feedback')
          .insert([insertData])
          .select()
          
        if (error) {
          console.error('❌ Supabase insert error:', error);
          toast.error('Failed to save feedback: ' + error.message);
        } else {
          console.log('✅ Supabase insert successful:', data);
          toast.success('Feedback saved successfully!');
        }
        
        router.replace(`/Interview/${interview_id}/completed`);
      } else {
        console.error('Unexpected API response structure:', result?.data);
        // Navigate anyway to avoid getting stuck
        router.replace(`/Interview/${interview_id}/completed`);
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast.error('Error generating feedback: ' + error.message);
      // Navigate anyway to avoid getting stuck
      router.replace(`/Interview/${interview_id}/completed`);
    }
  };

       const toggleMute = () => {
      if (isMuted) {
        vapi.setMuted(false);
        setIsMuted(false);
      } else {
        vapi.setMuted(true);
        setIsMuted(true);
      }
    };

    const stopInterview = () => {
      try {
        console.log('🛑 Stopping interview...');
        
        // Immediately set status to prevent further interactions
        setCallStatus('ended');
        setIsTimerRunning(false);
        
        // Force mute to stop any ongoing speech
        if (vapi) {
          vapi.setMuted(true);
          
          // Stop the call with enhanced error handling
          vapi.stop().then(() => {
            console.log('✅ Vapi call stopped successfully');
            toast.success('Interview ended successfully!');
            
            // Generate feedback and navigate to completed page
            GenerateFeedback();
          }).catch((stopError) => {
            console.error('❌ Error stopping Vapi call:', stopError);
            // Even if stop fails, proceed with feedback generation
            toast.success('Interview ended successfully!');
            GenerateFeedback();
          });
        } else {
          console.log('⚠️ Vapi not available, proceeding with feedback generation');
          toast.success('Interview ended successfully!');
          GenerateFeedback();
        }
        
      } catch (error) {
        console.error('❌ Error stopping interview:', error);
        setCallStatus('error');
        toast.error('Error stopping interview. Please try again.');
      }
    };



  return (
    <div className='p-20 lg:px-48 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'> AI Interview Session
        <span className='flex gap-2 items-center'>
            <Timer/>
            {formatTime(interviewTime)}
        </span>
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-3'>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 shadow-md items-center justify-center'>
          <div className='relative'>
            {!activeUser &&<span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping'/>}
          <Image src={'/ai.png'} alt='ai' width={100} height={100}
            className='w-[110px] h-[110px] rounded-full object-cover'/>
          </div>
             <h2 className='text-xl font-bold'>AiHire</h2>

        </div>
                 <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 shadow-md items-center justify-center'>
             {/* User Avatar with First Letter */}
             <div className='relative'>
             {activeUser &&<span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping'/>}
               <div className='w-[110px] h-[110px] rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold'>
               {interviewInfo?.username?.charAt(0)?.toUpperCase() || 'U'}
               </div>
             </div>
             
             <h2 className='text-xl font-bold text-gray-900'>{interviewInfo?.username || 'User'}</h2>
         </div>
      </div>
                 <div className='flex gap-4 justify-center mt-6'>
             <button 
               onClick={toggleMute}
               className={`h-12 w-12 rounded-full flex items-center justify-center text-white p-3 cursor-pointer transition-colors ${
                 isMuted ? 'bg-red-500' : 'bg-gray-500'
               }`}
               title={isMuted ? 'Unmute' : 'Mute'}
             >
               <Mic className='h-6 w-6' />
             </button>
             
                           <Alert stopInterview={stopInterview}>
                <Phone className='h-12 w-12 rounded-full bg-red-500 text-white p-3 cursor-pointer'/>
              </Alert>
          </div>
                                      <div className='text-center mt-4'>
            <h2 className='text-sm text-gray-400 mb-2'>
              {callStatus === 'idle' && 'Ready to start Enhanced AI Interview'}
              {callStatus === 'active' && 'Enhanced AI Interview in Progress'}
              {callStatus === 'ended' && 'Interview Completed'}
              {callStatus === 'error' && 'Interview Error - Please try again'}
            </h2>
            <div className='text-xs text-gray-500 space-y-1'>
              <p>🎯 Adaptive questioning based on your responses</p>
              <p>📊 Real-time skill assessment (1-5 scale)</p>
              <p>💬 Intelligent follow-up questions</p>
              <p>⏱️ Duration: {interviewInfo?.interviewData?.duration || '30'} minutes</p>
              <p>🎤 Microphone: {isMuted ? 'Muted' : 'Active'}</p>
            </div>
      </div>
    </div>
  )
}

export default StartInterview
