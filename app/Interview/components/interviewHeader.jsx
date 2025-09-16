import React from 'react'
import Image from 'next/image'
// import { usePathname } from 'next/navigation'

const InterviewHeader = () => {
  return (
    <div className=' shadow-lg'>
        
        <Image src={'/logo.jpg'} alt="logo" width={200} height={100}
        className='w-[100px] '
        />
    </div>
  )
}

export default InterviewHeader;