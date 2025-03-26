'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { House } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NotificationPopover } from '@/components/notification/notification-popover'

export const ChatHeader = () => {
  const navItems = [
    {
      title: 'Trang chủ',
      icon: House,
      href: '/',
    },
  ]

  return (
    <header className="h-16 shadow">
      <div className="container mx-auto flex h-full items-center justify-between">
        <Link href="/instructor" className="flex items-center gap-2">
          <Image
            src="/images/Logo.png"
            alt="CourseMeLy logo"
            width={32}
            height={32}
            className="shrink-0 rounded-md"
          />
          <span className="truncate text-lg font-extrabold">CourseMeLy</span>
        </Link>

        <nav>
          <ul className="flex items-center gap-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="text-muted-foreground"
                        asChild
                      >
                        <Link href={item.href}>
                          <item.icon className="!size-6" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{item.title}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            ))}
          </ul>
        </nav>

        <NotificationPopover />
      </div>
    </header>
  )
}
