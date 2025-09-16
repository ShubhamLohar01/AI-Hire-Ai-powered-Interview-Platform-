import React from 'react'
import { Check, Copy, Clock, List, Calendar, ArrowLeft, Plus, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const InterviewLink = ({interviewId, formData, clearInterviewData}) => {
  const router = useRouter()
  
  // Generate interview link
  const getInterviewUrl=()=>{
    const interviewLink = process.env.NEXT_PUBLIC_HOST_URL + '/Interview/'+interviewId
    return interviewLink
  }
  
  
  // Calculate expiry date (30 days from now)
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30)
  const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })

  // Copies the interviewLink to clipboard and shows a toast
  const copyToClipboard = async () => {
    try {
      const interviewLink = getInterviewUrl();
      await navigator.clipboard.writeText(interviewLink)
      toast.success('Link copied to clipboard!')
    } catch (err) {
      console.error('Copy error:', err);
      toast.error('Failed to copy link')
    }
  }

  // Opens the default email client using the mailto: URL with a prefilled subject and body
  const shareViaEmail = () => {
    const interviewLink = getInterviewUrl();
    const subject = encodeURIComponent(`Interview Invitation - ${formData?.jobPosition}`)
    const body = encodeURIComponent(`Hi,\n\nYou have been invited to participate in an interview for the ${formData?.jobPosition}\n        position.\n\nPlease click the following link to start your interview:\n${interviewLink}\n\nGood luck!\n\nBest regards,\n${formData?.userEmail || 'Interview Team'}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  // Slack quick-share is intentionally commented out. Slack does not support message prefill via URL.
  // For real posting, use an Incoming Webhook via a server route.
//   const shareViaSlack = () => {
//     const message = encodeURIComponent(`Interview invitation for ${formData?.jobPosition} position: ${interviewLink}`)
//     window.open(`https://slack.com/intl/en-in/help/articles/206870397-Share-links-in-Slack`)
//   }

  // Opens WhatsApp (web/app) using wa.me with a prefilled message containing the interview link
  const shareViaWhatsApp = () => {
    const interviewLink = getInterviewUrl();
    const message = encodeURIComponent(`Interview invitation for ${formData?.jobPosition} position: ${interviewLink}`)
    window.open(`https://wa.me/?text=${message}`)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8'>
      {/* Top Confirmation Section */}
      <div className='text-center mb-8'>
        <div className='w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
          <Check className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Your AI Interview is Ready!
        </h1>
        <p className='text-gray-600 text-lg'>
          Share this link with your candidates to start the interview process
        </p>
      </div>

      {/* Interview Link Card */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-2xl mb-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>Interview Link</h2>
        
        {/* Link Display and Copy Button */}
        <div className='flex items-center gap-3 mb-4'>
          <Input 
            defaultValue={getInterviewUrl()}
            readOnly
            className='flex-1 bg-gray-50 border-gray-200 text-gray-700'
          />
          <div className='flex flex-col items-end'>
            <Button 
              onClick={copyToClipboard}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2'
            >
              <Copy className='w-4 h-4' />
              Copy Link
            </Button>
            <span className='text-xs text-blue-500 mt-1'>Valid for 30 days</span>
          </div>
        </div>

        {/* Interview Parameters */}
        <div className='flex items-center gap-6 text-sm text-gray-600'>
          <div className='flex items-center gap-2'>
            <Clock className='w-4 h-4' />
            <span>{formData?.duration || 30} Minutes</span>
          </div>
          <div className='flex items-center gap-2'>
            <List className='w-4 h-4' />
            <span>{formData?.questionList?.length || 10} Questions</span>
          </div>
          <div className='flex items-center gap-2'>
            <Calendar className='w-4 h-4' />
            <span>Expires: {formattedExpiryDate}</span>
          </div>
        </div>
      </div>

      {/* Share Options Card */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-2xl mb-8'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>Share via</h2>
        
        <div className='grid grid-cols-3 gap-4'>
          <Button 
            onClick={shareViaEmail}
            variant='outline' 
            className='flex flex-col items-center gap-2 p-4 h-auto border-gray-200 hover:bg-gray-50'
          >
            <Mail className='w-6 h-6 text-gray-600' />
            <span className='text-gray-700 font-medium'>Email</span>
          </Button>
{/*           
          <Button 
            onClick={shareViaSlack}
            variant='outline' 
            className='flex flex-col items-center gap-2 p-4 h-auto border-gray-200 hover:bg-gray-50'
          >
            <div className='w-6 h-6 flex items-center justify-center text-gray-600 font-bold'>#</div>
            <span className='text-gray-700 font-medium'>Slack</span>
          </Button> */}
          
          <Button 
            onClick={shareViaWhatsApp}
            variant='outline' 
            className='flex flex-col items-center gap-2 p-4 h-auto border-gray-200 hover:bg-gray-50'
          >
            <MessageSquare className='w-6 h-6 text-gray-600' />
            <span className='text-gray-700 font-medium'>WhatsApp</span>
          </Button>
            </div>
         </div>

      {/* Bottom Navigation Buttons */}
      <div className='flex gap-4 w-full max-w-2xl'>
        <Button 
          onClick={() => {
            clearInterviewData && clearInterviewData()
            router.push('/dashboard')
          }}
          variant='outline' 
          className='flex-1 flex items-center justify-center gap-2 py-3 border-gray-200 hover:bg-gray-50'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Dashboard
        </Button>
        
        <Button 
          onClick={() => {
            clearInterviewData && clearInterviewData()
            router.push('/dashboard/create-interview')
          }}
          className='flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white'
        >
          <Plus className='w-4 h-4' />
          Create New Interview
        </Button>
         </div>
    </div>
  )
}

export default InterviewLink