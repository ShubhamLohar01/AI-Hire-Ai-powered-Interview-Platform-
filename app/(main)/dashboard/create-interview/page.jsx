"use client"
import React from 'react'
import { Progress } from "@/components/ui/progress" //from shadcn
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FormContainer from './component/FormContainer'
import { useState, useCallback,useEffect } from 'react'
import QuestionList from './component/QuestionList'
import { toast } from 'sonner'
import InterviewLink from './component/InterviewLink'
import { useUser } from '@/app/provider'


const CreateInterview = () => {
    const router = useRouter()
    const [step, setStep] = useState(1); // Initialize to 1, will be updated in useEffect

    const [formData, setFormData] = useState(undefined); // Initialize to undefined, will be updated in useEffect
    
    const [interviewId, setInterviewId] = useState(undefined); // Initialize to undefined, will be updated in useEffect
    
    const {user}=useUser();
    
    // Helper functions for user-specific localStorage
    const getUserSpecificKey = (key) => {
      return user?.email ? `${key}-${user.email}` : key;
    };
    
    const getUserSpecificData = (key) => {
      if (typeof window === 'undefined' || !user?.email) return null;
      return localStorage.getItem(getUserSpecificKey(key));
    };
    
    const setUserSpecificData = (key, value) => {
      if (typeof window === 'undefined' || !user?.email) return;
      localStorage.setItem(getUserSpecificKey(key), value);
    };
    
    const clearUserSpecificData = (key) => {
      if (typeof window === 'undefined' || !user?.email) return;
      localStorage.removeItem(getUserSpecificKey(key));
    };
    
    // Load user-specific data when user is available
    useEffect(() => {
      if (user?.email) {
        // Load step
        const savedStep = getUserSpecificData('interview-creation-step');
        if (savedStep) {
          setStep(parseInt(savedStep));
        }
        
        // Load form data
        const savedFormData = getUserSpecificData('interview-creation-data');
        if (savedFormData) {
          try {
            setFormData(JSON.parse(savedFormData));
          } catch (e) {
            console.error('Error parsing saved form data:', e);
            clearUserSpecificData('interview-creation-data');
          }
        }
        
        // Load interview ID
        const savedInterviewId = getUserSpecificData('interview-creation-id');
        if (savedInterviewId) {
          setInterviewId(savedInterviewId);
        }
      }
    }, [user?.email]);
    
    // Save step to localStorage whenever it changes
    useEffect(() => {
      if (user?.email && step !== 1) { // Only save if user is logged in and step is not default
        setUserSpecificData('interview-creation-step', step.toString());
      }
    }, [step, user?.email])
    
    // Save form data to localStorage whenever it changes
    useEffect(() => {
      if (user?.email && formData) {
        setUserSpecificData('interview-creation-data', JSON.stringify(formData));
      }
    }, [formData, user?.email])
    
    // Save interview ID to localStorage whenever it changes
    useEffect(() => {
      if (user?.email && interviewId) {
        setUserSpecificData('interview-creation-id', interviewId);
      }
    }, [interviewId, user?.email])
    
    const onHandleInput = useCallback((field, value) => {
      setFormData(prev =>({
          ...prev,
          [field]: value
      }))
      console.log("FormData",formData);
    }, [])

  const onGoNext = useCallback(() => {
    console.log("Current formData:", formData); // Debug log
    if(user?.credits <= 0){
      toast.error('You have no interview credits left! Credits reset monthly.')
      router.push('/billings')
      return;
    }
    
    if(!formData?.jobPosition){
      toast.error('Please enter job position!')
      return;
    }
    if(!formData?.jobDescription){
      toast.error('Please enter job description!')
      return;
    }
    if(!formData?.duration){
      toast.error('Please select interview duration!')
      return;
    }
    if(!formData?.interviewTypes || formData?.interviewTypes.length === 0){
      toast.error('Please select at least one interview type!')
      return;
    }
    
    toast.success('Moving to next step!')
    setStep(step + 1);
  }, [formData, step])

  const onCreateLink=(interview_id)=>{
    setInterviewId(interview_id);
    setStep(step + 1);
    // setStep(3);
  }
  
  // Function to clear localStorage when interview is completed
  const clearInterviewData = () => {
    if (user?.email) {
      clearUserSpecificData('interview-creation-step');
      clearUserSpecificData('interview-creation-data');
      clearUserSpecificData('interview-creation-id');
      
      // Reset state
      setStep(1);
      setFormData(undefined);
      setInterviewId(undefined);
    }
  }

  return (
    <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-52'>
      <div className='flex items-center gap-2'>
        <ArrowLeft  onClick={()=>router.back()} className='cursor-pointer' />
      
        <h1 className='text-2xl font-bold'>Create Interview</h1>
      </div>
      <Progress value={step * 33.33} className='mt-8' />
      {step === 1 && <FormContainer onHandleInput={onHandleInput}
      Gotonext={onGoNext} />}
      {step === 2 && <QuestionList formData={formData} onCreateLink={(interview_id)=>onCreateLink(interview_id)}/>}
      {step === 3 && <InterviewLink interviewId={interviewId}
      formData={formData} clearInterviewData={clearInterviewData}/>}
    </div>
  )
}

export default CreateInterview
