import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Bell, Loader2, Share2, UserCheck, UserPlus } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  useCheckInstructorFollow,
  useFollowInstructor,
} from '@/hooks/instructor/profile/useGetProfile'
import Link from 'next/link'

export function LivestreamInfo({ liveSession }: any) {
  const { user } = useAuthStore()

  const { data, isLoading: isChecking } = useCheckInstructorFollow(
    liveSession?.data?.instructor?.code,
    !!user
  )
  const { mutate, isPending } = useFollowInstructor()

  const isLoading = isChecking || isPending
  const isFollowed = !!data?.followed
  const isAuthor = user?.code === liveSession?.data?.instructor?.code

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="size-12 border-2 border-primary">
              <AvatarImage
                src={liveSession?.data.instructor?.avatar}
                alt={liveSession?.instructor?.name}
              />
              <AvatarFallback>{liveSession?.instructor?.name}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">
                {liveSession?.data?.title || ''}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1">
                <Link
                  href={
                    isAuthor
                      ? '/me'
                      : `/profile/${liveSession?.data?.instructor?.code}`
                  }
                  className="font-medium text-foreground"
                  target="_blank"
                >
                  {liveSession?.data?.instructor?.name || ''}
                </Link>
                <span className="text-muted-foreground">• 24.5K followers</span>
              </CardDescription>
            </div>
          </div>

          {!isAuthor && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() =>
                  mutate({ code: liveSession?.data?.instructor?.code })
                }
                disabled={isLoading}
              >
                {user ? (
                  isLoading ? (
                    <Loader2 className="inline-block size-6 w-full animate-spin" />
                  ) : isFollowed ? (
                    <UserCheck size={20} />
                  ) : (
                    <UserPlus size={20} />
                  )
                ) : (
                  <UserPlus size={20} />
                )}
                <span>
                  {user
                    ? isLoading
                      ? ''
                      : isFollowed
                        ? 'Đang theo dõi'
                        : 'Theo dõi'
                    : 'Theo dõi'}
                </span>
              </Button>
              <Button variant="outline" size="icon" className="size-8">
                <Bell className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-8">
                <Share2 className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}
