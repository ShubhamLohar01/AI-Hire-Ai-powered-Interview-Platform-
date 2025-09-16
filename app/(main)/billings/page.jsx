"use client"

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/app/provider'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'sonner'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
  stripeAccount: undefined,
});

const BillingPage = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState({})

  // Handle payment success/cancel
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
      toast.success('Payment successful! Credits added to your account.');
      updateUserCredits();
    }
    if (urlParams.get('canceled')) {
      toast.error('Payment canceled.');
    }
  }, []);

  const updateUserCredits = async () => {
    const sessionId = localStorage.getItem('stripe_session_id');
    if (sessionId) {
      try {
        console.log('🔄 Updating credits for session:', sessionId);
        const response = await fetch('/api/update_credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        
        if (response.ok) {
          console.log('✅ Credits updated successfully');
          localStorage.removeItem('stripe_session_id'); // Clean up
          window.location.reload();
        } else {
          console.error('❌ Failed to update credits:', response.status);
          toast.error('Failed to update credits. Please refresh the page.');
        }
      } catch (error) {
        console.error('❌ Error updating credits:', error);
        toast.error('Error updating credits. Please contact support.');
      }
    }
  };

  const handlePayment = async (plan) => {
    setLoading(prev => ({ ...prev, [plan]: true }));
    
    try {
      const response = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      
      const { sessionId } = await response.json();
      
      // Store session ID for later use
      localStorage.setItem('stripe_session_id', sessionId);
      
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [plan]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Credits Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Credits</h2>
            <p className="text-gray-600 mb-6">Current usage and remaining credits</p>
            
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-lg font-bold text-blue-600">
                    {user?.credits || 4} interviews left
                  </span>
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl">
              Add More Credits
            </Button>
          </div>

          {/* Purchase Credits Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Credits</h2>
            <p className="text-gray-600 mb-8">Add more interview credits to your account</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Basic</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">₹60</div>
                <div className="text-sm text-gray-600 mb-4">4 interviews</div>
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    Basic interview templates
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    Email support
                  </li>
                </ul>
                <Button 
                  onClick={() => handlePayment('basic')}
                  disabled={loading.basic}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg"
                >
                  {loading.basic ? 'Processing...' : 'Purchase Credits'}
                </Button>
              </div>

              {/* Standard Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Standard</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">₹120</div>
                <div className="text-sm text-gray-600 mb-4">10 interviews</div>
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    All interview templates
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    Basic analytics
                  </li>
                </ul>
                <Button 
                  onClick={() => handlePayment('standard')}
                  disabled={loading.standard}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg"
                >
                  {loading.standard ? 'Processing...' : 'Purchase Credits'}
                </Button>
              </div>

              {/* Pro Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">₹200</div>
                <div className="text-sm text-gray-600 mb-4">20 interviews</div>
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    All interview templates
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    24/7 support
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    Advanced analytics
                  </li>
                </ul>
                <Button 
                  onClick={() => handlePayment('pro')}
                  disabled={loading.pro}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg"
                >
                  {loading.pro ? 'Processing...' : 'Purchase Credits'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingPage