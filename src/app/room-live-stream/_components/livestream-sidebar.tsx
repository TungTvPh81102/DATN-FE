'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Compass, Heart, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/useAuthStore'
import { useState } from 'react'
import Image from 'next/image'

interface LivestreamSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function LivestreamSidebar({ open, setOpen }: LivestreamSidebarProps) {
  const { user } = useAuthStore()
  const [activePage, setActivePage] = useState('browse')
  const [onlineStatus, setOnlineStatus] = useState('Online')
  const statusOptions = ['Online', 'Idle', 'Do Not Disturb', 'Invisible']

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between border-b p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/Logo.png"
            alt="CourseMeLy logo"
            width={32}
            height={32}
            className="shrink-0 rounded-md"
          />
          <span className="bg-gradient-to-r from-orange-500 to-red-400 bg-clip-text text-lg font-bold text-transparent">
            CourseMeLy
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 pt-2">
        <div className="space-y-6">
          <div className="space-y-1 py-2">
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-orange-50 dark:hover:bg-orange-900/20 ${
                activePage === 'browse'
                  ? 'bg-orange-50 font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => setActivePage('browse')}
            >
              <Compass
                className={`size-5 ${activePage === 'browse' ? 'text-[#E27447]' : ''}`}
              />
              <span>Sự kiện</span>
              {activePage === 'browse' && (
                <Badge className="ml-auto bg-orange-100 text-[#E27447] hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300">
                  Sự kiện
                </Badge>
              )}
            </Link>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-orange-50 dark:hover:bg-orange-900/20 ${
                activePage === 'following'
                  ? 'bg-orange-50 font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => setActivePage('following')}
            >
              <Heart
                className={`size-5 ${activePage === 'following' ? 'text-[#E27447]' : ''}`}
              />
              <span>Theo dõi</span>
            </Link>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="size-10 border-2 border-white shadow-sm">
                <AvatarImage src={user?.avatar ?? ''} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 block size-3 rounded-full bg-green-500 ring-2 ring-white"></span>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="max-w-[120px] truncate font-medium">
                      {user?.name || 'User'}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{user?.name || 'User'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-green-500"></div>
                <select
                  className="m-0 cursor-pointer appearance-none border-none bg-transparent p-0 text-xs text-slate-500 outline-none"
                  value={onlineStatus}
                  onChange={(e) => setOnlineStatus(e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <User className="size-5 text-slate-600 dark:text-slate-300" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <Settings className="size-5 text-slate-600 dark:text-slate-300" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="flex w-72 flex-col p-0 sm:max-w-72"
        >
          {sidebarContent}
        </SheetContent>
      </Sheet>

      <div className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-r bg-background shadow-sm md:flex">
        {sidebarContent}
      </div>
    </>
  )
}
