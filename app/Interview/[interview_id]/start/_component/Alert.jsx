import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
     AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

const Alert = ({children , stopInterview}) => {
  const handleStopInterview = () => {
    console.log('User confirmed to stop interview');
    stopInterview();
  };

  return (
    <div>
        <AlertDialog>
  <AlertDialogTrigger>{children}</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>End Interview?</AlertDialogTitle>
      <AlertDialogDescription>
        This will stop the interview immediately and cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction 
        onClick={handleStopInterview} 
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        End Interview
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}

export default Alert