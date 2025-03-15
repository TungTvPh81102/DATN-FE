import React from 'react'

import TopBar from '@/components/layouts/TopBar'
import { AppSidebar } from '@/components/shared/app-sidebar'
import ProgressBar from '@/components/shared/ProgressBar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'

interface LayoutProps {
  children?: React.ReactNode
}

const DashboardLayout = async ({ children }: LayoutProps) => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden">
        <TopBar />
        <ProgressBar />
        <div className="h-[calc(100%-4rem)] overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
