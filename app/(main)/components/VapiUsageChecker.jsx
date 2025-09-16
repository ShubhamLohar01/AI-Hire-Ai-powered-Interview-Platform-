"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

const VapiUsageChecker = () => {
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkUsage = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://api.vapi.ai/account', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VAPI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch usage: ${response.status}`)
      }

      const data = await response.json()
      setUsage(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border p-4 max-w-md">
      <h3 className="text-lg font-semibold mb-3">Vapi Usage</h3>
      
      <Button 
        onClick={checkUsage} 
        disabled={loading}
        className="w-full mb-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Checking...
          </>
        ) : (
          'Check Usage'
        )}
      </Button>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {usage && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Usage Retrieved</span>
          </div>
          
          <div className="bg-gray-50 rounded p-3 text-xs">
            <pre>{JSON.stringify(usage, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default VapiUsageChecker

