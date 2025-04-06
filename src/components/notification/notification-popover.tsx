'use client'

import { Bell, Loader2, Search } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import QueryKey from '@/constants/query-key'
import {
  useGetNotifications,
  useMarkAsRead,
} from '@/hooks/notification/useNotification'
import echo from '@/lib/echo'
import { useAuthStore } from '@/stores/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import NotificationItem from './notification-item'
import NotificationSkeleton from './notification-skeleton'
import { useDebounce } from '@/hooks/debounce/useDebounce'
import QUERY_KEY from '@/constants/query-key'

interface Props {
  trigger?: React.ReactNode
}

export const NotificationPopover = ({ trigger }: Props) => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState('')
  const searchTermDebounce = useDebounce(searchTerm)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetNotifications()
  const { mutate: markAsRead } = useMarkAsRead()
  const notifications = data?.pages.flatMap((page) => page.notifications) || []

  useEffect(() => {
    if (!user?.id) return

    const privateChannel = echo.private(`notification.${user?.id}`)

    privateChannel.notification((notification: any) => {
      console.log('🔔 Notification for Instructor:', notification)
      toast.info(notification.message)

      queryClient.invalidateQueries({
        queryKey: [QueryKey.USER_NOTIFICATION],
      })

      queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_COURSE],
      })

      queryClient.invalidateQueries({
        queryKey: [QueryKey.INSTRUCTOR_WITH_DRAW_REQUEST],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.INSTRUCTOR_WALLET],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.MEMBERSHIPS],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GROUP_CHAT],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.POSTS],
      })
    })

    return () => {
      // privateChannel.stopListening('.notification')
      echo.leave(`notification.${user.id}`)
    }
  }, [queryClient, user?.id])
  const handleMarkAsRead = (id: string) => {
    markAsRead(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.USER_NOTIFICATION],
        })
      },
    })
  }

  const filteredNotifications = notifications.filter((noti: any) =>
    noti?.data?.message
      ?.toLowerCase()
      .includes(searchTermDebounce.toLowerCase())
  )

  const unreadCount = notifications.filter((n) => !n.read_at).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          {trigger ? (
            trigger
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-full"
            >
              <Bell
                className={cn(
                  '!size-5 text-gray-700',
                  !!unreadCount && 'animate-bell text-primary'
                )}
              />
            </Button>
          )}
          {!!unreadCount && (
            <div className="absolute -right-0.5 -top-0.5 flex items-center justify-center">
              <span className="absolute size-5 animate-ping rounded-full bg-primary/60"></span>
              <span className="relative flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
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
          <h4 className="font-medium">Thông báo</h4>
          <div className="relative max-w-[240px] flex-1">
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              className="w-full rounded-full border border-gray-200 py-1.5 pl-8 pr-3 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Separator className="my-2" />

        {isLoading ? (
          <NotificationSkeleton />
        ) : filteredNotifications.length > 0 ? (
          <div className="flex max-h-[400px] w-full flex-col gap-2 overflow-y-auto pr-1">
            {filteredNotifications.map((noti) => (
              <NotificationItem
                key={noti.id}
                noti={noti}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}

            {hasNextPage && (
              <button
                className="mt-2 w-full rounded-md py-2 text-center font-medium text-primary transition-colors hover:bg-orange-50"
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
  )
}
