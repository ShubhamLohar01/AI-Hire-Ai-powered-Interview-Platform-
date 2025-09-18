'use client'

import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './components/AppSidebar'
import WelcomeUser from './components/WelcomeUser'

const DashboardProvider = ({children}) => {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <div className="flex-1 ml-64">
        <WelcomeUser/>
        <main className="p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

export default DashboardProvider
