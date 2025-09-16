import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const CandidateFeedback = ({candidate}) => {
  const feedback = candidate?.feedback;
  
  // Calculate overall score
  const getOverallScore = () => {
    if (!feedback?.rating) return 'N/A';
    const ratings = feedback.rating;
    const total = (ratings.technicalSkills + ratings.communication + ratings.problemSolving + ratings.experience) / 4;
    return total.toFixed(1);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            size="sm"
            className="text-gray-600 text-xs px-3 py-1 h-7">
            View Report
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Interview Feedback Report</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Candidate Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {candidate?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{candidate?.username || 'Unknown Candidate'}</h3>
                  <p className="text-gray-600 text-sm">Full Stack Developer Position</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{getOverallScore()}</div>
                <div className="text-gray-500 text-sm">/10</div>
              </div>
            </div>

            {/* Skills Assessment */}
            {feedback?.rating && (
              <div>
                <h4 className="font-semibold text-lg mb-4">Skills Assessment</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Technical Skills</span>
                      <span className="text-sm text-blue-600 font-bold">{feedback.rating.technicalSkills}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${(feedback.rating.technicalSkills / 10) * 100}%`}}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-sm text-blue-600 font-bold">{feedback.rating.communication}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${(feedback.rating.communication / 10) * 100}%`}}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Problem Solving</span>
                      <span className="text-sm text-blue-600 font-bold">{feedback.rating.problemSolving}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${(feedback.rating.problemSolving / 10) * 100}%`}}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Experience</span>
                      <span className="text-sm text-blue-600 font-bold">{feedback.rating.experience}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${(feedback.rating.experience / 10) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Summary */}
            {feedback?.summary && (
              <div>
                <h4 className="font-semibold text-lg mb-3">Performance Summary</h4>
                <p className="text-gray-950 leading-relaxed text-[17px] bg-gray-50 p-4 rounded-lg">
                  {feedback.summary}
                </p>
              </div>
            )}

            {/* Recommendation */}
            {feedback?.recommendation && (
              <div>
                <div className={`p-4 rounded-lg ${
                  feedback.recommendation.toLowerCase().includes('recommended') && !feedback.recommendation.toLowerCase().includes('not recommended')
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold ${
                        feedback.recommendation.toLowerCase().includes('recommended') && !feedback.recommendation.toLowerCase().includes('not recommended')
                          ? 'text-green-800' 
                          : 'text-red-800'
                      }`}>
                        {feedback.recommendation}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        feedback.recommendation.toLowerCase().includes('recommended') && !feedback.recommendation.toLowerCase().includes('not recommended')
                          ? 'text-green-700' 
                          : 'text-red-700'
                      }`}>
                        {feedback.recommendationMsg}
                      </p>
                    </div>
                    <Button 
                      onClick={() => {
                        if (feedback.recommendation.toLowerCase().includes('recommended') && !feedback.recommendation.toLowerCase().includes('not recommended')) {
                          // Handle proceed to offer
                          console.log('Proceeding to offer for:', candidate?.username);
                        } else {
                          // Send email to rejected candidate
                          const subject = encodeURIComponent('Interview Update - Thank You for Your Time');
                          
                          window.open(`mailto:${candidate?.userEmail}?subject=${subject}`);
                        }
                      }}
                      className={`${
                        feedback.recommendation.toLowerCase().includes('recommended') && !feedback.recommendation.toLowerCase().includes('not recommended')
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white`}
                    >
                      {feedback.recommendation.toLowerCase().includes('recommended') && !feedback.recommendation.toLowerCase().includes('not recommended')
                      // Step 1: Check if it contains "recommended"
// Step 2: BUT make sure it doesn't contain "not recommended"  
                        ? 'Proceed to Offer' 
                        : 'Send Message'
                      }
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CandidateFeedback