'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, Search } from 'lucide-react'
import { LivestreamSidebar } from '@/app/room-live-stream/_components/livestream-sidebar'
import { useAuthStore } from '@/stores/useAuthStore'
import { NotificationPopover } from '@/components/notification/notification-popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function LivestreamLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuthStore()

  return (
    <div className="flex min-h-screen bg-background">
      <LivestreamSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex w-full flex-col bg-[#f2f4f7] md:ml-72">
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="size-5" />
        </Button>

        <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
          <div className="hidden md:block">
            Xin chào,{' '}
            <span className="text-orange-500">{user?.name ?? ''}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Tìm kiếm khóa học, bài viết..."
                className="w-64 rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <NotificationPopover />
            <Avatar className="size-6 cursor-pointer md:size-8">
              <AvatarImage src={user?.avatar ?? ''} alt={user?.name ?? ''} />
              <AvatarFallback>GV</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}
