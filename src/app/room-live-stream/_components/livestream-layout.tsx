'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { LivestreamSidebar } from '@/app/room-live-stream/_components/livestream-sidebar'

export function LivestreamLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="size-5" />
      </Button>

      {/* Sidebar */}
      <LivestreamSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="w-full bg-[#f2f4f7]">{children}</div>
    </div>
  )
}
