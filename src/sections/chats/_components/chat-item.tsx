import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, getAvatarText } from '@/lib/utils'
import { IChannel } from '@/types/Chat'
import { MouseEventHandler } from 'react'

export const ChatItem = ({
  channel,
  onClick,
  isSelected,
}: {
  channel: IChannel
  onClick?: MouseEventHandler<HTMLDivElement>
  isSelected?: boolean
}) => {
  return (
    <div
      className={cn(
        'flex h-[76px] cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-secondary',
        isSelected && 'bg-secondary'
      )}
      onClick={onClick}
    >
      <div className="relative">
        {channel?.users ? (
          <GroupChatAvatar users={channel.users} />
        ) : (
          <div className="flex size-[60px] items-center justify-center">
            <Avatar className="size-12">
              <AvatarImage
                src={channel.avatar}
                alt={channel.name}
                className="object-cover"
              />
              <AvatarFallback>{getAvatarText(channel.name)}</AvatarFallback>
            </Avatar>
          </div>
        )}
        {channel.is_online && (
          <span className="absolute bottom-1.5 right-2 size-2.5 rounded-full bg-green-500 ring-2 ring-white" />
        )}
      </div>
      <div className="flex-1">
        <h6 className="text-sm font-medium">{channel.name}</h6>
        {!!channel.online_users && (
          <p className="text-xs text-muted-foreground">
            {channel.online_users} online
          </p>
        )}
      </div>
    </div>
  )
}

const GroupChatAvatar = ({
  users,
}: {
  users: NonNullable<IChannel['users']>
}) => {
  const firstUser = users[0]

  let secondUser = null
  if (users.length > 1) {
    const otherUsers = users.filter((user) => user.id !== firstUser.id)
    const randomIndex = Math.floor(Math.random() * otherUsers.length)
    secondUser = otherUsers[randomIndex]
  }

  const additionalUsersCount = users.length > 2 ? users.length - 2 : 0

  return (
    <div className={cn('relative size-[60px]')}>
      {/* First user avatar */}
      <div className="absolute bottom-0 left-0 z-10">
        <Avatar className="size-10 ring-2 ring-white">
          <AvatarImage src={firstUser.avatar} alt={firstUser.name} />
          <AvatarFallback>{getAvatarText(firstUser.name)}</AvatarFallback>
        </Avatar>
      </div>

      {/* Second user avatar or additional count */}
      {secondUser && (
        <div className="absolute right-0 top-0">
          <Avatar className="size-10">
            <AvatarImage src={secondUser.avatar} alt={secondUser.name} />
            <AvatarFallback>{getAvatarText(secondUser.name)}</AvatarFallback>
          </Avatar>

          {/* Additional users count badge */}
          {additionalUsersCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs font-medium text-primary-foreground">
              +{additionalUsersCount}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const ChatSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex h-[76px] cursor-pointer items-center gap-3 rounded-lg p-2"
        >
          <div className="relative flex size-[60px] items-center justify-center">
            <Avatar className="size-12">
              <AvatarFallback>
                <Skeleton className="size-full rounded-full" />
              </AvatarFallback>
            </Avatar>
            {/* Online status indicator skeleton */}
            <Skeleton className="absolute bottom-1.5 right-2 size-2.5 rounded-full ring-2 ring-white" />
          </div>
          {/* Name skeleton */}
          <Skeleton className="h-4 w-24 flex-1" />
        </div>
      ))}
    </>
  )
}

export const GroupChatSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex h-[76px] cursor-pointer items-center gap-3 rounded-lg p-2"
        >
          <div className="relative flex size-[60px] items-center justify-center">
            <div className="absolute bottom-0 left-0 z-10 size-10 rounded-full bg-gray-100 ring-2 ring-white">
              <Skeleton className="size-full rounded-full" />
            </div>
            <div className="absolute right-0 top-0 size-10 rounded-full bg-gray-200">
              <Skeleton className="size-full rounded-full" />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </>
  )
}
