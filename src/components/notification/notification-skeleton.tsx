import { cn } from '@/lib/utils'

interface NotificationSkeletonProps {
  count?: number
  className?: string
}

export const NotificationSkeleton = ({
  count = 3,
  className,
}: NotificationSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'flex animate-pulse items-start gap-3 rounded-lg p-2.5',
            className
          )}
        >
          {/* Avatar/thumbnail skeleton */}
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200" />

          {/* Content skeleton */}
          <div className="flex flex-1 flex-col">
            {/* Message text skeleton */}
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="mt-1 h-4 w-3/4 rounded bg-gray-200" />

            {/* Timestamp skeleton */}
            <div className="mt-1 h-3 w-16 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </>
  )
}

export default NotificationSkeleton
