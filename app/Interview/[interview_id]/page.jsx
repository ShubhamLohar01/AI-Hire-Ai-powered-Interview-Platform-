'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building, Clock, Video, Settings, Info, Loader2Icon } from 'lucide-react'
import { useParams} from 'next/navigation'
import { useEffect, useState, useContext } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { IntDataContext } from '@/context/IntDataContext'
import { useRouter } from 'next/navigation'

const Interview = () => {
    const [interviewData, setInterviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const {interviewInfo, setInterviewInfo} = useContext(IntDataContext)
    const [userEmail, setUserEmail] = useState();
 
    const router = useRouter();
    const {interview_id} = useParams()
    console.log('Interview ID:', interview_id);


    useEffect(()=>{
        interview_id && GetInterviewDetails()
    },[interview_id])

    const GetInterviewDetails = async () => {
        try {
            setLoading(true);
            
            // Use .single() for better performance and cleaner code
            const { data: interview, error } = await supabase
                .from('Interviews')
                .select("jobPosition,jobDescription,type,duration,questionList")
                .eq('interview_id', interview_id)
                .single();
            
            if (error) {
                console.error('Supabase error:', error);
                if (error.code === 'PGRST116') {
                    toast.error('Interview not found. Please check the link.');
                } else {
                    toast.error('Failed to fetch interview. Please try again.');
                }
                return;
            }
            
            console.log('Interview data loaded:', interview);
            setInterviewData(interview);
            
        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    }
    const onJoinInterview = async () => {
      if (!username.trim()) {
        toast.error('Please enter your name');
        return;
      }
      
      setLoading(true);
      try {
        // Use existing interviewData instead of making another query
        if (interviewData) {
          setInterviewInfo({
            username: username.trim(),
            userEmail: userEmail?.trim() || '',
            interviewData: interviewData
          });
          router.push(`/Interview/${interview_id}/start`);
        } else {
          toast.error('Interview data not found. Please refresh the page.');
        }
      } catch (error) {
        console.error('Error joining interview:', error);
        toast.error('Failed to join interview. Please try again.');
      } finally {
        setLoading(false);
      }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className='px-6 md:px-16 lg:px-28 xl:px-64 py-8'>
        <div className='flex flex-col items-center justify-center'>
          
          {/* Header Section */}
          <div className='text-center mb-3'>
          
            {/* <div className='bg-white rounded-full p-4 shadow-md inline-block mb-4
            w-[140px]'>
              <Image 
                src="/logo.jpg" 
                alt="logo" 
                width={200} 
                height={100} 
                className='w-[140px]'
              />
            </div> */}
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>AI-Powered Interview Platform</h2>
          
            <p className='text-gray-600'>Join your interview with confidence</p>
          </div>

          {/* Main Interview Card */}
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-2xl transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
            
            {/* Interview Illustration */}
            <div className='flex justify-center mb-6'>
              <Image 
                src="/interview.jpg" 
                alt="Interview illustration" 
                width={500}
                height={500}
                className='w-[390px] rounded-lg'
              />
            </div>

            {/* Interview Details */}
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                {loading ? 'Loading...' : interviewData?.jobPosition || 'Interview'} Interview
              </h1>
              
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-600'>
                <div className='flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg'>
                  <Building className='w-5 h-5 text-blue-600' />
                  <span className='font-medium'>Company Name</span>
                </div>
                <div className='flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg'>
                  <Clock className='w-5 h-5 text-green-600' />
                  <span className='font-medium'>
                    {loading ? '...' : interviewData?.duration || '30'} Minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Enter your full name
              </label>
              <Input 
                type="text"
                placeholder="e.g., Shubham Lohar"
                onChange={(e)=>setUsername(e.target.value)}
                className='w-full'
              />
               <label className='block text-sm font-medium text-gray-700 mb-2'>
                Enter your Email
              </label>
              <Input 
                type="text"
                placeholder="e.g.,user12@gmail.com"
                onChange={(e)=>setUserEmail(e.target.value)}
                className='w-full'
              />
            </div>

            {/* Debug Info - Remove this later */}
            {interviewData && (
              <div className='bg-gray-50 rounded-lg p-4 mb-6'>
                <div className='flex items-start gap-3'>
                  <Info className='w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <h3 className='font-medium text-gray-900 mb-2'>Debug Info (Remove Later)</h3>
                    <div className='text-sm text-gray-700 space-y-1'>
                      <p><strong>Job Position:</strong> {interviewData.jobPosition}</p>
                      <p><strong>Duration:</strong> {interviewData.duration} minutes</p>
                      <p><strong>Type:</strong> {interviewData.type}</p>
                      <p><strong>Description:</strong> {interviewData.jobDescription?.substring(0, 100)}...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className='bg-blue-50 rounded-lg p-4 mb-6'>
              <div className='flex items-start gap-3'>
                <Info className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
                <div>
                  <h3 className='font-medium text-blue-900 mb-2'>Before you begin</h3>
                  <ul className='text-sm text-blue-800 space-y-1'>
                    <li>• Ensure you have a stable internet connection</li>
                    <li>• Test your camera and microphone</li>
                    <li>• Find a quiet place for the interview</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-3'>
              <Button 
              disabled={loading || !username}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium'
              onClick={()=>onJoinInterview()}>
                <Video className='w-5 h-5 mr-2' />
                {loading&&<Loader2Icon className='w-5 h-5 mr-2 animate-spin'/>}
                Join Interview
              </Button>
              
              <Button variant="outline" className='w-full border-gray-300 text-gray-700 hover:bg-gray-50'>
                <Settings className='w-5 h-5 mr-2' />
                Test Audio & Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Interview