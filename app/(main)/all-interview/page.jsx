'use client'
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/app/provider'
import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import InterviewCards from '../components/interviewCards'
import { useRouter } from 'next/navigation'

const AllInterviews = () => {
    const [interviewsList, setInterviewsList] = useState([]);
    const {user} = useUser()
  
    useEffect(() => {
      user && getInterviewsList()
    }, [user])
  
  const getInterviewsList = async () => { 
    const { data: Interviews, error } = await supabase
    .from('Interviews')
    .select('*')
    .eq('userEmail', user?.email)
    .order('created_at', { ascending: false }) //for latest on top
    
  
    setInterviewsList(Interviews);
  }
  
    return (
      <div className='px-6 py-8'>
        <h3 className="text-xl font-bold text-gray-800 mb-6 ">All Interviews</h3>
        
        {interviewsList.length == 0 && 
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
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
  }
        {interviewsList && interviewsList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {interviewsList.map((interview, index) => (
              <InterviewCards key={interview.interview_id || index} interview={interview} />
            ))}
          </div>
        )}
      </div>
    )
  }
  

export default AllInterviews