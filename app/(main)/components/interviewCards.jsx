"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  FileText, 
  ExternalLink, 
  Copy, 
  MoreVertical,
  Briefcase,
  Timer,
  Share2,
  Calendar,
  ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import moment from 'moment'

const InterviewCards = ({interview,viewDetail=false}) => {
  const router = useRouter()

  // Format the created date using moment.js
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM DD, YYYY')
  }

  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString) => {
    return moment(dateString).fromNow()
  }

  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/Interview/${interview.interview_id}`


  // Copy interview link to clipboard
  const copyInterviewLink = async (e) => {
    e.stopPropagation() // Prevent card click
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Interview link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  // Navigate to interview details or analytics
  const handleCardClick = () => {
    // Only navigate if not in viewDetail mode
    if (!viewDetail) {
      router.push(`/Interview/${interview.interview_id}`)
    }
  }

  // Get question count
  const getQuestionCount = () => {
    return interview.questionList?.length || 5
  }
  //send to email
  const onSend = () =>{
    window.location.href= "mailto:shubhameng31@gmail.com?subject=Ai interview link and body=Interview link:"+url
  }

  // Get interview type badge color
  const getTypeColor = (type) => {
    const colors = {
      'technical': 'bg-blue-100 text-blue-800',
      'behavioral': 'bg-green-100 text-green-800',
      'experience': 'bg-purple-100 text-purple-800',
      'problem-solving': 'bg-orange-100 text-orange-800',
      'leadership': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    
    const typeKey = type?.toLowerCase().replace(/[^a-z]/g, '') || 'default'
    return colors[typeKey] || colors.default
  }

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group mb-3"
      onClick={handleCardClick}
    >
      <div className="p-4">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                {interview.jobPosition || 'Interview Position'}
              </h3>
            </div>
            
            {/* Interview Types */}
            <div className="flex flex-wrap gap-1 mb-2">             
                 {interview.type?.split(',').map((type, index) => (
                <span 
                  key={index}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type.trim())}`}
                >
                  {type.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Interview Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Timer className="w-3.5 h-3.5 text-green-600" />
            <span>{interview.duration || '30'} min</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>{getQuestionCount()} questions</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            <span>{formatDate(interview.created_at)}</span>
          </div>
          
         
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end pt-3 border-t border-gray-100">
          {!viewDetail ?
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyInterviewLink}
              className="text-xs h-7 px-2"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            
            <Button
              size="sm"
              onClick={onSend}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs h-7 px-2"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
                Send
              </Button>
            </div>
          :
          <Link href={`/schedule-interview/${interview.interview_id}/details`}>
          <Button className="w-full mt-5 " variant="outline">View Details<ArrowRight/> </Button>
          </Link>
         }
        </div>
      </div>
    </div>
  )
}

export default InterviewCards