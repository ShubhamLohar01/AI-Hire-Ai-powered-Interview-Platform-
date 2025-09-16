import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import QuesListContainer from './QuesListContainer';
import { useUser } from '@/app/provider';
import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const QuestionList = ({formData ,onCreateLink}) => {

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questionlist, setQuestionlist] = useState();
  const {user}=useUser()

  useEffect(()=>{
    if(formData){
      GenQuestionList()
    }

  },[formData]);
 
  const GenQuestionList=async()=>{
    setLoading(true);

    try{
    const  result = await fetch('/ai/ai-model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    
    const data = await result.json();
    console.log("📊 Question generation response:", data);
    
    if (data.success && data.data?.interviewQuestions) {
      setQuestionlist(data.data.interviewQuestions);
      
      // Log which service was used
      const serviceUsed = data.metadata?.serviceUsed || data.metadata?.fallbackUsed || 'Unknown';
      console.log(`🎯 Questions generated using: ${serviceUsed}`);
      
      // Show helpful message if fallback was used
      if (data.metadata?.fallbackUsed === 'openrouter') {
        toast.info('Gemini API temporarily unavailable, used alternative AI model');
      } else if (data.metadata?.fallbackUsed === 'static') {
        toast.info('AI services temporarily unavailable, using curated questions');
      } else {
        console.log("✅ Questions generated successfully with primary AI service");
      }
    } else {
      throw new Error(data.error || 'Failed to generate questions');
    }
    
    setLoading(false);
  }
  catch(e){
    console.error('Question generation error:', e);
    
    // Provide specific error messages based on error type
    if (e.message?.includes('503') || e.message?.includes('overloaded')) {
      toast.error('AI service is temporarily overloaded. Please try again in a few minutes.');
    } else if (e.message?.includes('timeout')) {
      toast.error('Request timed out. Please try again.');
    } else if (e.message?.includes('network') || e.message?.includes('fetch')) {
      toast.error('Network error. Please check your connection and try again.');
    } else {
      toast.error('Failed to generate questions. Please try again.');
    }
    
    setLoading(false);
  }
}

// Save to Supabase Interviews table
const onFinish= async()=>{
  if (saving) return;
  if (!questionlist?.length) {
    toast.error('Please generate questions first');
    return;
  }
  setSaving(true);
  try {
    const interview_id = uuidv4();

    // Map to your exact table column names (camelCase)
    const payload = {
      interview_id,                                    // varchar
      userEmail: user?.email ?? null,                  // varchar
      questionList: questionlist,                      // json
      jobPosition: formData?.jobPosition ?? null,      // varchar
      jobDescription: formData?.jobDescription ?? null, // varchar
      duration: formData?.duration ?? null,            // varchar
      type: formData?.interviewTypes?.join(', ') ?? null, // varchar (join array to string)
    };

    const { data, error } = await supabase
      .from('Interviews') // exact table name as in Supabase
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('Insert error:', error);
      toast.error(error.message || 'Failed to save interview');
      setSaving(false);
      return;
    }
    
    // Deduct credit when interview is created
    const { error: creditError } = await supabase
      .from('Users')
      .update({ credits: Number(user?.credits) - 1 })
      .eq('email', user?.email);
      
    if (creditError) {
      console.error('Credit update error:', creditError);
      toast.error('Failed to deduct credit. Please try again.');
      setSaving(false);
      return;
    } else {
      console.log(`✅ Credit deducted. User now has ${Number(user?.credits) - 1} credits remaining`);
    }

    // Removed toast message - user will see the interview link page
    onCreateLink(interview_id);
  } catch (e) {
    console.error('Unexpected save error:', e);
    toast.error('Unexpected error while saving');
  } finally {
    setSaving(false);
  }
}

  return (
    <div>
      {loading &&
      <div className='p-5 bg-blue-50 rounded-xl border-primary flex gap-5 items-center'>
        <Loader2Icon className='animate-spin'/>
        <div>
          <h2 className='font-medium'>Generating Interview Questions</h2>
          <p className='text-primary'>Our AI is crafting personalized Questions based on your job position</p>
        </div>

      </div>
      }
      
      {questionlist && !loading && (
        <div className='mt-6'>
          <QuesListContainer questionlist={questionlist}/>
        </div>
      )}
      <div className='flex justify-end mt-8 mb-5'>  
        <Button onClick={onFinish} disabled={saving}>
          {saving ? 'Saving...' : 'Create InterviewLink and Finish'}
        </Button>
      </div>
    </div>
  );
}

export default QuestionList
