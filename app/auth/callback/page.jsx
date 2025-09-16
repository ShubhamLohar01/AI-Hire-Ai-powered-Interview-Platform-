"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication failed')
          router.push('/auth/login')
          return
        }

        if (data.session && data.session.user) {
          // ✅ User is authenticated via Google OAuth
          console.log('Google OAuth successful, redirecting to dashboard...')
          
          // Just redirect - let the provider handle user creation and session
          router.push('/dashboard')
        } else {
          // No session, redirect back to login
          console.log('No session found in callback')
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error)
        toast.error('Authentication failed')
        router.push('/auth/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Completing sign-in...</h2>
        <p className="text-gray-500">Please wait while we set up your session.</p>
      </div>
    </div>
  )
} 