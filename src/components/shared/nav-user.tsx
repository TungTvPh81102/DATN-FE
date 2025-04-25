'use client'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Radio,
} from 'lucide-react'
import Link from 'next/link'
import Swal from 'sweetalert2'

import { useLogOut } from '@/hooks/auth/useLogOut'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { IUser } from '@/types'

export function NavUser({ user }: { user: IUser | null }) {
  const { isMobile } = useSidebar()
  const { isPending, mutate } = useLogOut()

  const handleLogout = () => {
    if (isPending) return

    Swal.fire({
      title: 'Bạn có chắc muốn đăng xuất?',
      text: 'Bạn sẽ cần đăng nhập lại để tiếp tục!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E27447',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
    }).then((result: any) => {
      if (result.isConfirmed) {
        mutate()
      }
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user?.avatar || ''} alt={user?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user?.avatar || ''} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="*:cursor-pointer">
              <DropdownMenuItem asChild>
                <Link href={'/instructor/settings'}>
                  <BadgeCheck />
                  Thông tin tài khoản
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={'/instructor/wallet'} className="cursor-pointer">
                  <CreditCard />
                  Ví của bạn
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#" className="cursor-pointer">
                  <Radio />
                  Phát trực tiếp
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Thông báo
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
