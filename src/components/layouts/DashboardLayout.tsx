import { manropeFont } from '@/components/common/fonts'
import { ISidebarData, IUser, UserStatus } from '@/types'
import React from 'react'
import QueryProvider from './QueryProvider'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import InputSeach from '@/components/common/InputSeach'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import TopBar from '@/components/layouts/TopBar'

interface LayoutProps {
  children?: React.ReactNode
  leftSidebarData: ISidebarData[]
}

const DashboardLayout = ({ children }: LayoutProps) => {
  const user: IUser = {
    id: 1,
    code: 'USR001',
    name: 'John Doe',
    email: 'johndoe@example.com',
    emailVerifiedAt: new Date('2024-12-25T12:00:00Z'),
    password: 'securepassword123',
    avatar: 'https://example.com/avatar.jpg',
    verificationToken: 'abc123xyz',
    rememberToken: 'token56789',
    status: UserStatus.Active,
    deletedAt: null,
    createdAt: new Date('2024-01-01T09:00:00Z'),
    updatedAt: new Date('2024-12-27T15:30:00Z'),
  }

  const lastWordInitial =
    user?.name
      ?.trim()
      .split(' ')
      .slice(-1)
      .toString()
      .charAt(0)
      .toUpperCase() ?? 'A'

  return (
    <html lang="en">
      <body className={`${manropeFont.className} antialiased`}>
        <QueryProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <TopBar userData={user} />
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

export default DashboardLayout
