'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart2,
  Clock,
  GraduationCap,
  Home,
  Menu,
  Radio,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/useAuthStore'
import { NotificationPopover } from '@/components/notification/notification-popover'
import Link from 'next/link'

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  isCollapsed: boolean
}

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
}

interface LayoutProps {
  children?: React.ReactNode
}

const menuItems: MenuItem[] = [
  {
    icon: <Home className="size-5" />,
    label: 'Trang chủ',
    href: '/live-streaming',
  },
  {
    icon: <Clock className="size-5" />,
    label: 'Sự kiện',
    href: '/live-streaming/manage-schedule',
  },
  {
    icon: <BarChart2 className="size-5" />,
    label: 'Thống kê',
    href: '/stats',
  },
  {
    icon: <GraduationCap className="size-5" />,
    label: 'Giảng dạy',
    href: '/instructor',
  },
]

const LiveStreamingLayout = ({ children }: LayoutProps) => {
  const { user } = useAuthStore()

  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowWidth(window.innerWidth)

      if (window.innerWidth < 768) {
        setIsLeftSidebarCollapsed(true)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 768

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() =>
              isMobile
                ? toggleMobileMenu()
                : setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)
            }
            className="mr-2 rounded-full p-1 hover:bg-slate-100 md:mr-4"
            aria-label="Toggle menu"
          >
            <Menu className="size-5 text-slate-600" />
          </button>
          <div className="flex items-center">
            <Radio className="mr-2 size-5 text-red-500" />
            <Link
              href="/live-streaming"
              className="text-lg font-bold text-slate-800 md:text-xl"
            >
              CourseMeLy Studio
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <NotificationPopover />
          <Avatar className="size-8 cursor-pointer md:size-10">
            <AvatarImage src={user?.avatar ?? ''} alt={user?.name ?? ''} />
            <AvatarFallback>GV</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-slate-900/50"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      <div className="mt-16 flex h-[calc(100vh-4rem)] overflow-hidden">
        <div
          className={`${
            isMobile
              ? `fixed z-10 h-full transition-transform duration-300 ease-in-out${
                  isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : 'relative shrink-0 transition-all duration-300'
          } border-r border-slate-200 bg-white ${
            isLeftSidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {isMobile && isMobileMenuOpen && (
            <button
              onClick={toggleMobileMenu}
              className="absolute right-2 top-2 rounded-full p-1 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="size-5 text-slate-600" />
            </button>
          )}

          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-1 px-2">
                <div className="space-y-1 px-2">
                  {menuItems.map((item, index) => (
                    <SidebarItem
                      key={index}
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      isCollapsed={isLeftSidebarCollapsed}
                    />
                  ))}
                </div>
              </div>

              {!isLeftSidebarCollapsed && (
                <>
                  <Separator className="my-4" />

                  <div className="px-3">
                    <h3 className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Khóa học gần đây
                    </h3>

                    {[
                      'React Nâng Cao',
                      'JavaScript Cơ Bản',
                      'Node.js Master',
                    ].map((course, i) => (
                      <div
                        key={i}
                        className="mb-2 cursor-pointer rounded-md p-2 hover:bg-slate-50"
                      >
                        <p className="text-sm font-medium text-slate-700">
                          {course}
                        </p>
                        <p className="text-xs text-slate-500">
                          Lượt xem: {Math.floor((i + 1) * 329)}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-slate-200 p-3">
              <div className="flex items-center">
                <Avatar className="size-8">
                  <AvatarImage
                    src={user?.avatar ?? ''}
                    alt={user?.name ?? ''}
                  />
                  <AvatarFallback>GV</AvatarFallback>
                </Avatar>

                {!isLeftSidebarCollapsed && (
                  <div className="ml-2">
                    <p className="text-sm font-medium">{user?.name ?? ''}</p>
                    <p className="text-xs text-slate-500">
                      {user?.email ?? ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full overflow-auto">{children}</div>
      </div>
    </div>
  )
}

export default LiveStreamingLayout

function SidebarItem({ icon, label, href, isCollapsed }: SidebarItemProps) {
  return (
    <a
      href={href}
      className="flex w-full items-center rounded-md p-2 text-left text-slate-600 hover:bg-slate-100"
    >
      {icon}
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </a>
  )
}
