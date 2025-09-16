'use client'
import { useUser } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { Calendar } from 'lucide-react'
import InterviewCards from '../components/interviewCards'
import { useState } from 'react'


const ScheduleInterview = () => {
    const {user} = useUser();
    const [interviewsList, setInterviewsList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
       if (user?.email) {
         GetInterviewlist();
       }
    }, [user?.email]);

    const GetInterviewlist = async () => {
       if (!user?.email || loading) return;
       
       setLoading(true);
       try {
         const { data, error } = await supabase.from('Interviews')
           .select('jobPosition,duration,interview_id,type,created_at, interview-feedback(userEmail)')
           .eq('userEmail', user.email)
           .order('created_at', { ascending: false });
         
         if (error) {
           console.error('Error fetching interviews:', error);
           return;
         }
         
         setInterviewsList(data || []);
       } catch (error) {
         console.error('Unexpected error:', error);
       } finally {
         setLoading(false);
       }
    }
  return (
    <div className=' px-6 py-8'>
        <h2 className='text-xl font-bold mb-3'>Interview List : </h2>
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && interviewsList.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center mt-5">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No interviews created yet</h4>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven&apos;t created any interviews yet. Create your first AI-powered interview or phone screening call.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Interview
              </Button>
            </div>
          </div>
        )}

        {!loading && interviewsList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {interviewsList.map((interview, index) => (
              <InterviewCards key={interview.interview_id || index} interview={interview} 
              viewDetail={true}
              />
            ))}
          </div>
        )}
    </div>
  )
}

export default ScheduleInterview