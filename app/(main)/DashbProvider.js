'use client'

import React from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './components/AppSidebar'
import WelcomeUser from './components/WelcomeUser'

const DashboardProvider = ({children}) => {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <div className="flex-1">
      {/* <SidebarTrigger /> */}
      <WelcomeUser/>
        {children}
      </div>
    </SidebarProvider>
  )
}

export default DashboardProvider
