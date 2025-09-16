"use client"

import React, { useState, useEffect } from 'react'
import { Video, Phone, RefreshCw } from 'lucide-react'
// import WelcomeUser from '../components/WelcomeUser'
import LatestInterview from '../components/LatestInterview'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUser } from '@/app/provider'

const Dashboard = () => {
  const [hasIncompleteInterview, setHasIncompleteInterview] = useState(false)
  const { user } = useUser()

  // Helper functions for user-specific localStorage
  const getUserSpecificKey = (key) => {
    return user?.email ? `${key}-${user.email}` : key;
  };

  // Check for incomplete interview creation when user is available
  useEffect(() => {
    if (user?.email) {
      const savedStep = localStorage.getItem(getUserSpecificKey('interview-creation-step'))
      const savedData = localStorage.getItem(getUserSpecificKey('interview-creation-data'))
      
      // If there's a saved step and it's not completed (step 3), show resume option
      if (savedStep && parseInt(savedStep) < 3 && savedData) {
        setHasIncompleteInterview(true)
      } else {
        setHasIncompleteInterview(false)
      }
    }
  }, [user?.email])

  const clearIncompleteInterview = () => {
    if (user?.email) {
      localStorage.removeItem(getUserSpecificKey('interview-creation-step'))
      localStorage.removeItem(getUserSpecificKey('interview-creation-data'))
      localStorage.removeItem(getUserSpecificKey('interview-creation-id'))
      setHasIncompleteInterview(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
    

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Dashboard Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

        {/* Resume Interview Creation Banner */}
        {hasIncompleteInterview && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-blue-600" />
    <div>
                  <h3 className="text-sm font-medium text-blue-900">Incomplete Interview Creation</h3>
                  <p className="text-xs text-blue-700">You have an unfinished interview creation process. Would you like to continue?</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/dashboard/create-interview">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Resume
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearIncompleteInterview}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  Discard
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Create New Interview Card */}
      <Link href={'/dashboard/create-interview'} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Interview</h3>
                <p className="text-gray-600 text-sm">Create AI interviews and schedule them with candidates</p>
              </div>
            </div>
          </Link>

          {/* Create Phone Screening Call Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Phone Screening Call</h3>
                <p className="text-gray-600 text-sm">Schedule phone screening calls with potential candidates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Interview Component */}
        <LatestInterview />
      </div>
    </div>
  )
}

export default Dashboard
