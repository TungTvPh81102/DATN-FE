'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { LivestreamSidebar } from '@/app/live-test/_components/livestream-sidebar'
import { LivestreamPlayer } from '@/app/live-test/_components/livestream-player'
import { LivestreamInfo } from '@/app/live-test/_components/livestream-info'
import { LivestreamChat } from '@/app/live-test/_components/livestream-chat'

export function LivestreamLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
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

      {/* Main content */}
      <div className="flex w-full flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
            {/* Video player and info section */}
            <div className="space-y-4 lg:col-span-2">
              <LivestreamPlayer />
              <LivestreamInfo />
            </div>

            {/* Chat section */}
            <div className="lg:col-span-1">
              <LivestreamChat />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
