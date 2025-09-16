import React, { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"//this is from shadcn
import { Button } from "@/components/ui/button"
import { Code, User, Briefcase, Star, Users } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const FormContainer = ({onHandleInput  ,Gotonext}) => {
    const [interviewType, setInterviewType] = useState(['technical'])
  const [selectedInterviewType, setSelectedInterviewType] = useState('technical')
  const hasInitialized = useRef(false)

  const interviewTypes = [
    {
      id: 'technical',
      name: 'Technical',
      icon: Code,
      description: 'Technical skills assessment'
    },
    {
      id: 'behavioral',
      name: 'Behavioral',
      icon: User,
      description: 'Behavioral and soft skills'
    },
    {
      id: 'experience',
      name: 'Experience',
      icon: Briefcase,
      description: 'Past experience evaluation'
    },
    {
      id: 'problem-solving',
      name: 'Problem Solving',
      icon: Star,
      description: 'Problem-solving abilities'
    },
    {
      id: 'leadership',
      name: 'Leadership',
      icon: Users,
      description: 'Leadership and management'
    }
  ]

  // Set initial interview type when component mounts
  useEffect(() => {
    if (!hasInitialized.current) {
      onHandleInput('interviewTypes', ['technical'])
      hasInitialized.current = true
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleInterviewTypeClick = (typeId) => {
    setInterviewType(prev => {
      const newTypes = prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)  // Remove if already selected
        : [...prev, typeId]  // Add if not selected
      
      // Pass the updated interview types to parent
      onHandleInput('interviewTypes', newTypes)
      return newTypes
    })
  }

  return (
    <div className= "p-5 bg-white">
      <div>
        <h2 className='text-sm font-medium text-gray-700 mb-2'>Job Position</h2>
        <Input placeholder='e.g. Senior Frontend Developer' className='mt-2'
        onChange={(event) =>onHandleInput('jobPosition' , event.target.value) } />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm font-medium text-gray-700 mb-2'>Job Description</h2>
        <Textarea placeholder='Enter detailed job description...'
         className='mt-2 h-[200px]'
         onChange={(event) =>onHandleInput('jobDescription' , event.target.value) } />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm font-medium text-gray-700 mb-2'>Interview Duration</h2>
        <Select  onValueChange={(value)=>onHandleInput('duration' , value)}  defaultValue="">
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 min</SelectItem>
            <SelectItem value="15">15 min</SelectItem>
            <SelectItem value="30">30 min</SelectItem>
            <SelectItem value="45">45 min</SelectItem>
            <SelectItem value="60">60 min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='mt-5'>
        <h2 className='text-sm font-medium text-gray-700 mb-3'>Interview Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {interviewTypes.map((type) => {
            const IconComponent = type.icon
            const isSelected = interviewType.includes(type.id)
            
            return (
              <button
                key={type.id}
                onClick={() => handleInterviewTypeClick(type.id)}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <IconComponent className={`w-6 h-6 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                  {type.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className='mt-8 flex justify-end gap-3'>
        <Button variant="outline" className="px-6">
          Cancel
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600 px-6" 
        onClick={()=>Gotonext()}>
          Generate Questions
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

export default FormContainer
