'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Trophy, Sparkles, ArrowLeft, Calendar, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const InterviewCompleted = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Celebration Header */}
        <div className="text-center mb-12">
          <div className="relative mb-8">
            {/* Success Animation */}
            <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-20 h-20 text-white" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
            <div className="absolute top-8 right-1/4">
              <Trophy className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
            <div className="absolute top-8 left-1/4">
              <Sparkles className="w-6 h-6 text-purple-400 animate-bounce delay-300" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 p-2">
            🎉 Congratulations! 🎉
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Interview Successfully Completed!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You've successfully completed your AI-powered interview! Your responses have been recorded and our AI has generated comprehensive feedback for the hiring team.
          </p>
        </div>

        {/* Success Illustration */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="w-80 h-80 bg-white rounded-3xl shadow-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-20 h-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Mission Accomplished!</h3>
                <p className="text-gray-600">Your interview journey is complete</p>
              </div>
            </div>
            
        
            <div className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              🚀 Great Job!
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Happens Next?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-gray-600 text-sm">Our AI is processing your responses and generating detailed feedback</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Report Generation</h4>
              <p className="text-gray-600 text-sm">A comprehensive report will be sent to the hiring team</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Follow Up</h4>
              <p className="text-gray-600 text-sm">You'll hear back from the team within 2-3 business days</p>
            </div>
          </div>
        </div>

        {/* Motivational Message
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl p-8 mb-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">You Did Amazing! 🌟</h3>
          <p className="text-lg mb-4 opacity-90">
            Taking this AI interview shows your commitment to innovation and growth. 
            Regardless of the outcome, you've gained valuable experience with cutting-edge interview technology.
          </p>
          <div className="flex justify-center items-center gap-4 text-sm opacity-80">
            <span>✨ Innovative</span>
            <span>•</span>
            <span>🚀 Forward-thinking</span>
            <span>•</span>
            <span>💪 Confident</span>
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            onClick={() => router.push('/dashboard')}
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-none border-2 hover:bg-gray-50"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={() => router.push('/dashboard/create-interview')}
            size="lg"
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Practice Another Interview
          </Button>
        </div>

        {/* Footer Message */}
        <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
          <p className="text-gray-700 font-medium mb-2">
            🎯 Keep practicing and improving your interview skills!
          </p>
          <p className="text-gray-600 text-sm">
            Thank you for using our AI-powered interview platform. Best of luck with your career journey!
          </p>
        </div>
      </div>
    </div>
  )
}

export default InterviewCompleted