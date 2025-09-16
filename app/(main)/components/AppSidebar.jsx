"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { memo, useCallback } from "react"
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
  
  export const AppSidebar = memo(function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleCreateInterview = useCallback(() => {
      router.push('/dashboard/create-interview');
    }, [router]);

    const handleNavigation = useCallback((path) => {
      if (pathname !== path) {
        router.push(path);
      }
    }, [router, pathname]);
    
    return (
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.jpg" 
              alt="logo" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
            <span className="font-bold text-lg">AiHire</span>
          </div>
          <Button 
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors" 
            onClick={handleCreateInterview}
          > 
            <Plus className="w-4 h-4 mr-1" /> Create New Interview
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarContent>
              <SidebarMenu>
                {SidebarOptions.map((option, index) => (
                  <SidebarMenuItem key={option.path || index}>
                    <SidebarMenuButton 
                      isActive={pathname === option.path}
                      onClick={() => handleNavigation(option.path)}
                    >
                      <option.icon className="w-5 h-5" />
                      <span className={`text-[16px] ${pathname === option.path ? 'text-blue-500 font-medium' : ''}`}>
                        {option.name}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  })
