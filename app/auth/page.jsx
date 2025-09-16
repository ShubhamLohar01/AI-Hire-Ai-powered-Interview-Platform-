"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const Login = () => {

const signUpwithGoogle = async()=>{
  const { error } = await supabase.auth.signInWithOAuth({
    provider:'google',
    options:{
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  })
  if(error){
    console.log("error" , error.message)
  }
}

  return (
    <div className="flex flex-col items-center justify-center h-screen">
       <div className='flex flex-col items-center border rounded-2xl p-8'>
       <span className='flex items-center '>
         <Image src={'/logo.jpg'} alt="logo" className='w-[80px] '
          width={80} height={80} priority />
       <h3 className='text-2xl font-bold'>AiHire</h3>
        </span> 
         <div className='flex flex-col items-center'>
          <Image src={'/login.jpg'}  alt='login'
            className='w-[470px] h-[280px] rounded-2xl object-cover' width={470} height={280} priority />
          <h2 className='text-2xl font-bold text-center mt-4 mb-2'>Welcome to AiHire</h2>
          <p className='text-center text-gray-500 mb-2'>Sing-in With Google</p>

          <Button onClick={signUpwithGoogle}>Login with Google</Button>
         </div>
      </div>

    </div>
  )
}

export default Login
