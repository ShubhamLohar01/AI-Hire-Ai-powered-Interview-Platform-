"use client"

import { useState, useEffect } from 'react'
import { Zap, Clock } from 'lucide-react'

export const PerformanceIndicator = ({ isFromCache, loadTime }) => {
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    if (isFromCache || loadTime) {
      setShowIndicator(true)
      const timer = setTimeout(() => setShowIndicator(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isFromCache, loadTime])

  if (!showIndicator) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in-0">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium shadow-lg border ${
        isFromCache 
          ? 'bg-green-50 border-green-200 text-green-700' 
          : 'bg-blue-50 border-blue-200 text-blue-700'
      }`}>
        {isFromCache ? (
          <>
            <Zap className="w-4 h-4" />
            <span>Loaded from cache</span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4" />
            <span>Loaded in {loadTime}ms</span>
          </>
        )}
      </div>
    </div>
  )
}

