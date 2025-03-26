'use client'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import { cn, distanceToNow } from '@/lib/utils'
import { Notification } from '@/types/notification'

interface NotificationItemProps {
  noti: Notification
  onMarkAsRead: (id: string) => void
}

export const NotificationItem = ({
  noti,
  onMarkAsRead,
}: NotificationItemProps) => {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-lg p-2.5 transition-colors',
        noti.read_at
          ? 'bg-gray-50 hover:bg-gray-100'
          : 'border-l-2 border-primary bg-orange-50 hover:bg-orange-100'
      )}
      onClick={() => {
        if (!noti.read_at) {
          onMarkAsRead(noti.id)
        }
      }}
    >
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-200">
        {noti?.data.course_thumbnail ? (
          <Image
            src={
              noti?.data.course_thumbnail ||
              'https://res.cloudinary.com/dvrexlsgx/image/upload/v1742943708/Gemini_Generated_Image_w68g6w68g6w68g6w_fcudfq.jpg'
            }
            alt="thumbnail"
            className="size-full object-cover"
            width={40}
            height={40}
          />
        ) : (
          <Image
            src={
              'https://res.cloudinary.com/dvrexlsgx/image/upload/v1742943708/Gemini_Generated_Image_w68g6w68g6w68g6w_fcudfq.jpg'
            }
            alt="thumbnail"
            className="size-full object-cover"
            width={40}
            height={40}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <p className="text-sm leading-tight text-gray-800">
          {noti?.data.message}
        </p>
        <span className="mt-1 text-xs text-gray-500">
          {distanceToNow(noti.created_at)}
        </span>
      </div>

      {!noti.read_at && (
        <CheckCircle className="mt-0.5 size-5 shrink-0 text-primary" />
      )}
    </div>
  )
}

export default NotificationItem
