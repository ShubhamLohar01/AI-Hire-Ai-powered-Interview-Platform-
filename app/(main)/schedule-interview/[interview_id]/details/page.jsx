'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@/app/provider'
import { supabase } from '@/lib/supabase'
import { Filter, Download, Clock, Calendar, Tag, MapPin, BadgeQuestionMark, FileQuestionIcon, MessageCircleQuestion, User, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import moment from 'moment'
import CandidateFeedback from '../../../components/CandidateFeedback';

const InterviewDetails = () => {
    const {interview_id} = useParams();
    const {user} = useUser();
    const [interviewDetails, setInterviewDetails] = useState();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        user && GetInterviewDetails();
     }, [user]);
     
     const GetInterviewDetails = async () => {
        try {
            setLoading(true);
        const result = await supabase.from('Interviews')
            .select(`jobPosition,jobDescription, type, duration,interview_id,questionList,created_at,
            interview-feedback(userEmail ,username,feedback,created_at)`)
        .eq('userEmail', user?.email)
            .eq('interview_id', interview_id)
            
            if (result.data && result.data.length > 0) {
                setInterviewDetails(result.data[0]);
            }
        } catch (error) {
            console.error('Error fetching interview details:', error);
        } finally {
            setLoading(false);
        }
     }

     const formatDate = (dateString) => {
        return moment(dateString).format('MMM DD, YYYY')
     }

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

     if (loading) {
        return (
            <div className="px-6 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
                    <div className="bg-white rounded-lg border p-6">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className="h-16 bg-gray-200 rounded"></div>
                            <div className="h-16 bg-gray-200 rounded"></div>
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
     }

     if (!interviewDetails) {
        return (
            <div className="px-6 py-8">
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Interview Not Found</h2>
                    <p className="text-gray-600">The interview details could not be found.</p>
                </div>
            </div>
        );
     }

  return (  
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Interview Details</h1>
                <div className="h-1 w-24 bg-blue-500 mt-2"></div>
            </div>
            
            <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                </Button>
            </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Job Title and Status */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {interviewDetails.jobPosition || 'Interview Position'}
                        </h2>
                        <p className="text-gray-600">Company Name</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Interview Stats */}
            <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Duration */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">Duration</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                            {interviewDetails.duration || '30'} Minutes
                        </span>
                    </div>

                    {/* Created On */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">Created On</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                            {formatDate(interviewDetails.created_at)}
                        </span>
                    </div>

                    {/* Type */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Tag className="w-4 h-4" />
                            <span className="text-sm font-medium">Type</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {interviewDetails.type?.split(',').map((type, index) => (
                                <span 
                                    key={index}
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type.trim())}`}
                                >
                                    {type.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Description */}
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">
                    {interviewDetails.jobDescription || 'No job description available.'}
                </p>
            </div>

            {/* Interview Questions */}
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Questions</h3>
                <div className="grid grid-cols-2 gap-3">
                    {interviewDetails.questionList && interviewDetails.questionList.length > 0 ? (
                        interviewDetails.questionList.map((question, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                {/* <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                    {index + 1}
                                </div> */}
                                <div className="flex-1">
                                    <p className="text-gray-800 text-sm">
                                    <MessageCircleQuestion className="w-4 h-4 text-primary" /> {question.question || question}
                                    </p>
                                    {question.type && (
                                        <span className={`inline-block px-2 py-0.5 rounded-full  font-medium mt-1 text-sm ${getTypeColor(question.type)}`}>
                                            {question.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No questions available for this interview.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Candidates Section */}
            <div className="p-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Candidates ({interviewDetails['interview-feedback']?.length || 0})
                </h3>
                
                {interviewDetails['interview-feedback'] && interviewDetails['interview-feedback'].length > 0 ? (
                    <div className="space-y-4">
                        {interviewDetails['interview-feedback'].map((candidate, index) => {
                            // Calculate real score from Supabase feedback data
                            const getRealScore = (candidateData) => {
                                if (!candidateData?.feedback?.rating) return 'N/A';
                                
                                const ratings = candidateData.feedback.rating;
                                const average = (
                                    (ratings.technicalSkills || 0) + 
                                    (ratings.communication || 0) + 
                                    (ratings.problemSolving || 0) + 
                                    (ratings.experience || 0)
                                ) / 4;
                                
                                return average.toFixed(1);
                            };
                            
                            const score = getRealScore(candidate);
                            
                            // Get user avatar background color
                            const getAvatarColor = (name) => {
                                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500'];
                                const hash = name?.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0) || 0;
                                return colors[Math.abs(hash) % colors.length];
                            };

                            const getStatusInfo = () => {
                                if (candidate.feedback) {
                                    return {
                                        status: "Completed",
                                        statusColor: "text-green-600",
                                        bgColor: "bg-green-50 border-green-200",
                                        actionButton: (
                                            <CandidateFeedback candidate={candidate} buttonStyle="primary" />
                                        )
                                    };
                                } else {
                                    return {
                                        status: "Pending",
                                        statusColor: "text-orange-600",
                                        bgColor: "bg-orange-50 border-orange-200",
                                        actionButton: (
                                           <CandidateFeedback candidate={candidate} />
                                        )
                                    };
                                }
                            };

                            const statusInfo = getStatusInfo();

                            return (
                                <div key={index} className={`${statusInfo.bgColor} rounded-lg p-4 border transition-all hover:shadow-sm`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(candidate.username)} flex items-center justify-center text-white font-semibold text-sm`}>
                                                {candidate.username?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            
                                            {/* Candidate Info */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm">
                                                    {candidate.username || 'Unknown Candidate'}
                                                </h4>
                                                <p className="text-xs text-gray-600">
                                                    {statusInfo.status === "Completed" 
                                                    ? `Completed on ${formatDate(candidate.created_at)}`
                                                        : `Pending - Scheduled for ${formatDate(candidate.created_at)}`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            {/* Score (only for completed) */}
                                            {statusInfo.status === "Completed" && (
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-green-600">
                                                        {score}/10
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Status Badge */}
                                            {statusInfo.status === "Pending" && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.statusColor} bg-orange-100`}>
                                                    Pending
                                                </span>
                                            )}
                                            
                                            {/* Action Button */}
                                            {statusInfo.actionButton}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h4>
                        <p className="text-gray-600 text-sm">
                            Candidates who complete this interview will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default InterviewDetails