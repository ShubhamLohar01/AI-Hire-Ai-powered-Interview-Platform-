'use client'

import { UserDetailContext } from '@/context/UserDetailContext';
import { supabase } from '@/lib/supabase';
import { initializeUserCredits, resetUserCredits, shouldResetCredits } from '@/lib/creditManager';
import React, { useEffect, useState, useContext } from 'react'
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';

function Provider({children}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 🔒 Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if we have a valid session in localStorage (24-hour session)
      const sessionData = localStorage.getItem('user_session');
      
      if (sessionData) {
        const session = JSON.parse(sessionData);
        
        // Check if session is still valid (24 hours)
        if (session.expiresAt > Date.now()) {
          console.log('✅ Valid session found, user logged in');
          setUser(session.user);
          setIsLoading(false);
          return;
        } else {
          console.log('⏰ Session expired, clearing...');
          localStorage.removeItem('user_session');
        }
      }

      // No valid session, check Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error getting session:', error);
        handleNoAuth();
        return;
      }
      
      if (session?.user) {
        console.log('✅ Supabase session found, setting up user...');
        await setupUser(session.user);
      } else {
        console.log('❌ No session found');
        handleNoAuth();
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      handleNoAuth();
    }
  };

  const setupUser = async (userData) => {
    try {
      // Check if user exists in database
      const { data: existingUser, error: fetchError } = await supabase
        .from('Users')
        .select('*')
        .eq('email', userData.email)
        .single();

      let userToSet;
      
      if (existingUser) {
        // Check if credits need monthly reset
        if (shouldResetCredits(existingUser)) {
          await resetUserCredits(existingUser);
          userToSet = { ...existingUser, credits: 4 };
        } else {
          userToSet = existingUser;
        }
      } else {
        // Create new user
        userToSet = await createNewUser(userData);
      }

      if (userToSet) {
        // Save 24-hour session
        const sessionData = {
          user: userToSet,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        localStorage.setItem('user_session', JSON.stringify(sessionData));
        
        setUser(userToSet);
        setIsLoading(false);
        console.log('✅ User session established for 24 hours');
      }
    } catch (error) {
      console.error('❌ Setup user error:', error);
      handleNoAuth();
    }
  };

  const createNewUser = async (userData) => {
    try {
      const newUser = {
        email: userData.email,
        name: userData.user_metadata?.full_name || userData.email.split('@')[0],
        picture: userData.user_metadata?.avatar_url || null,
        credits: 4,
        lastCreditReset: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('Users')
        .insert([newUser])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating user:', error);
        return null;
      }

      await initializeUserCredits(data);
      return data;
    } catch (error) {
      console.error('❌ Create user error:', error);
      return null;
    }
  };

  const handleNoAuth = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    setIsLoading(false);
    
    if (!isPublicRoute) {
      router.push('/auth/login');
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage session
      localStorage.removeItem('user_session');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear user state
      setUser(null);
      
      // Redirect to login
      router.push('/auth/login');
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user and not on public route
  if (!user && !isPublicRoute) {
    router.push('/auth/login');
    return null;
  }

  return (
    <UserDetailContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error('useUser must be used within a UserDetailContext.Provider');
  }
  return context;
};

export default Provider;