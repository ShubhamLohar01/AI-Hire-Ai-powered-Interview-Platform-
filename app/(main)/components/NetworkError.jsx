"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

const NetworkError = ({ 
  title = "Connection Failed", 
  message = "Unable to connect to the server. Please check your internet connection and try again.",
  onRetry = null,
  showRefresh = true 
}) => {
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
    toast.info('Retrying connection...');
  };

  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-red-600" />
        </div>
        
        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>
        
        {/* Error Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        {/* Error Details */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h4 className="text-sm font-semibold text-red-800 mb-1">Common Causes:</h4>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Internet connection issues</li>
                <li>• Server maintenance</li>
                <li>• Firewall or VPN blocking</li>
                <li>• Browser cache problems</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          {showRefresh && (
            <Button 
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
         
          
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full text-gray-600 hover:bg-gray-100"
          >
            Go to Dashboard
          </Button>
        </div>
        
        {/* Help Text */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If the problem persists, please contact support or try again later.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NetworkError
