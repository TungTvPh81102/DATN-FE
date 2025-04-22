'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { House, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NotificationPopover } from '@/components/notification/notification-popover'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

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
      <div className="container mx-auto flex h-full items-center justify-between px-4 md:px-6">
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

        <nav className="hidden md:block">
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

        <div className="flex items-center gap-2">
          <NotificationPopover />

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] p-0">
              <div className="flex h-full flex-col">
                <div className="border-b p-4">
                  <Link href="/instructor" className="flex items-center gap-2">
                    <Image
                      src="/images/Logo.png"
                      alt="CourseMeLy logo"
                      width={28}
                      height={28}
                      className="shrink-0 rounded-md"
                    />
                    <span className="truncate text-base font-bold">
                      CourseMeLy
                    </span>
                  </Link>
                </div>
                <nav className="flex-1 p-4">
                  <ul className="space-y-3">
                    {navItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 text-muted-foreground hover:text-foreground"
                        >
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
