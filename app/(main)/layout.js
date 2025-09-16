import React from 'react'
import DashboardProvider from './DashbProvider'


const DashboardLayout = ({children}) => {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  )
}

export default DashboardLayout
