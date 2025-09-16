"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const LoadingContext = createContext()

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

export const LoadingProvider = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Start loading when route changes
    setIsNavigating(true)
    
    // End loading after a short delay to allow for smooth transition
    const timer = setTimeout(() => {
      setIsNavigating(false)
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname])

  const value = {
    isNavigating,
    setIsNavigating
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {/* Global loading indicator */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
        </div>
      )}
    </LoadingContext.Provider>
  )
}

