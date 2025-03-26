'use client'

import { useAuthStore } from '@/stores/useAuthStore'

import InputSearch from '@/components/common/InputSearch'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { NotificationPopover } from '../notification/notification-popover'

const TopBar = () => {
  const { user } = useAuthStore()

  return (
    <header
      style={{ zIndex: 50 }}
      className="sticky top-0 flex h-16 shrink-0 items-center justify-between px-4 shadow"
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-gray-700 transition-colors hover:text-[#E27447]" />
        <Separator orientation="vertical" className="h-6" />
        <h3 className="font-medium text-gray-800">
          Xin chào,{' '}
          <span className="font-semibold text-[#E27447]">
            {user?.name || 'Người dùng'}
          </span>
        </h3>
      </div>
      <div className="flex items-center space-x-4">
        <InputSearch className="border-gray-200 bg-gray-50 transition-colors focus-within:border-[#E27447]" />

        <NotificationPopover />
      </div>
    </header>
  )
}

export default TopBar
