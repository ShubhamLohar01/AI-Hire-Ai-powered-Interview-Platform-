"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
  } from "@/components/ui/sidebar"
import { SidebarOptions } from "@/services/Constants"
  
export const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleCreateInterview = () => {
    router.push('/dashboard/create-interview');
  };

  const handleNavigation = (path) => {
    router.push(path);
  };
  
  return (
    <Sidebar className="w-64 bg-white border-r">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.jpg" 
            alt="logo" 
            width={32} 
            height={32}
            className="rounded-lg"
          />
          <span className="font-bold text-xl">AiHire</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-6" 
            onClick={handleCreateInterview}
          > 
            <Plus className="w-4 h-4 mr-2" /> 
            Create New Interview
          </Button>
          
          <SidebarMenu>
            {SidebarOptions.map((option, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton 
                  isActive={pathname === option.path}
                  onClick={() => handleNavigation(option.path)}
                  className={pathname === option.path ? 'bg-blue-50 text-blue-700' : ''}
                >
                  <option.icon className="w-5 h-5" />
                  <span>{option.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-gray-500 text-center">
          © 2024 AiHire
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
