"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { useUser } from './provider';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // User is authenticated, redirect to dashboard
      router.replace('/dashboard');
    } else {
      // User is not authenticated, redirect to login
      router.replace('/auth/login');
    }
  }, [user, router]);

  // Show loading while checking authentication and redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2Icon className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">
          {user ? 'Redirecting to Dashboard...' : 'Redirecting to Login...'}
        </p>
      </div>
    </div>
  );
}
