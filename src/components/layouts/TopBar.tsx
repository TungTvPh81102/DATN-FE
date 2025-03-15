'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuthStore } from '@/stores/useAuthStore'
import { Bell, CheckCircle, Loader2, Search } from 'lucide-react'
import { toast } from 'react-toastify'

import echo from '@/lib/echo'
import { cn } from '@/lib/utils'
import {
  useGetNotifications,
  useMarkAsRead,
} from '@/hooks/notification/useNotification'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import InputSearch from '@/components/common/InputSearch'
import { useQueryClient } from '@tanstack/react-query'
import QUERY_KEY from '@/constants/query-key'

const TopBar = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState('')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetNotifications()
  const { mutate: markAsRead } = useMarkAsRead()
  const notifications = data?.pages.flatMap((page) => page.notifications) || []

  // console.log('Active Channels:', echo.connector.channels)

  useEffect(() => {
    if (!user?.id) return

    const privateChannel = echo.private(`instructor.${user?.id}`)

    privateChannel.notification((notification: any) => {
      // console.log('🔔 Notification for Instructor:', notification)
      toast.info(notification.message)

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.USER_NOTIFICATION],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.INSTRUCTOR_COURSE],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.INSTRUCTOR_WITH_DRAW_REQUEST],
      })
    })

    return () => {
      // privateChannel.stopListening('.notification')
      echo.leave(`instructor.${user.id}`)
    }
  }, [queryClient, user?.id])

  const handleMarkAsRead = (id: string) => {
    markAsRead(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.USER_NOTIFICATION],
        })
      },
    })
  }

  const filteredNotifications = notifications
    .filter((noti: any) =>
      noti?.data?.message?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5)

  const hasUnread = notifications.some((n) => !n.read_at)
  const unreadCount = notifications.filter((n) => !n.read_at).length

  return (
    <header
      style={{ zIndex: 50 }}
      className="sticky top-0 flex h-16 shrink-0 items-center justify-between border-b bg-white px-4"
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
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full transition-colors hover:bg-orange-50 [&_svg]:size-5"
              >
                <Bell
                  className={cn(
                    'text-gray-700',
                    hasUnread && 'animate-bell text-[#E27447]'
                  )}
                />
              </Button>

              {hasUnread && (
                <div className="absolute -right-0.5 -top-0.5 flex items-center justify-center">
                  <span className="absolute size-4 animate-ping rounded-full bg-[#E27447]/60"></span>
                  <span className="relative flex size-4 items-center justify-center rounded-full bg-[#E27447] text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="bottom"
            className="mr-6 border border-gray-200 p-2 shadow-lg"
            style={{ zIndex: 100, width: '600px' }}
          >
            <div className="flex justify-between gap-2">
              <h4 className="flex items-center gap-1.5 text-base font-medium">
                <Bell className="size-4 text-[#E27447]" />
                Thông báo
              </h4>
              <div className="relative max-w-[240px] flex-1">
                <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thông báo..."
                  className="w-full rounded-full border border-gray-200 py-1.5 pl-8 pr-3 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#E27447]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Separator className="my-2" />

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-8 animate-spin text-[#E27447]" />
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="flex max-h-[400px] w-full flex-col gap-2 overflow-y-auto pr-1">
                {filteredNotifications.map((noti: any) => (
                  <div
                    key={noti.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg p-2.5 transition-colors',
                      noti.read_at
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'border-l-2 border-[#E27447] bg-orange-50 hover:bg-orange-100'
                    )}
                    onClick={() => handleMarkAsRead(noti.id)}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-200">
                      {noti?.data.course_thumbnail ? (
                        <Image
                          src={noti?.data.course_thumbnail}
                          alt="thumbnail"
                          className="size-full object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <span className="text-sm font-bold text-gray-600">
                          {noti?.data.sender?.charAt(0) ?? 'N'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <p className="text-sm leading-tight text-gray-800">
                        {noti?.data.message}
                      </p>
                      <span className="mt-1 text-xs text-gray-500">
                        {new Date(noti.created_at).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {!noti.read_at && (
                      <CheckCircle className="mt-0.5 size-5 shrink-0 text-[#E27447]" />
                    )}
                  </div>
                ))}

                {hasNextPage && (
                  <button
                    className="mt-2 w-full rounded-md py-2 text-center font-medium text-[#E27447] transition-colors hover:bg-orange-50"
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Đang tải...
                      </span>
                    ) : (
                      'Xem thêm'
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Bell className="mx-auto mb-2 size-10 text-gray-300" />
                <p className="text-gray-500">Không có thông báo nào</p>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}

export default TopBar
