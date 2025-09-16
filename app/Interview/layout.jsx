'use client'
import React, { useState } from 'react'
import InterviewHeader from './components/interviewHeader'
import { IntDataContext } from '@/context/IntDataContext'


const InterviewLayout = ({children}) => {
  const [interviewInfo, setInterviewInfo] = useState();
  return (
    <IntDataContext.Provider value={{interviewInfo, setInterviewInfo}}>
    <div>
        <InterviewHeader />
        
        {children}
    </div>
    </IntDataContext.Provider>)
}
//any component can access the interviewInfo and setInterviewInfo
//like const {interviewInfo, setInterviewInfo} = useContext(IntDataContext)
export default InterviewLayout