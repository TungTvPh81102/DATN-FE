import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Bell,
  Loader2,
  Share2,
  UserCheck,
  UserPlus,
  Calendar,
  Info,
} from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  useCheckInstructorFollow,
  useFollowInstructor,
} from '@/hooks/instructor/profile/useGetProfile'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export function LivestreamInfo({ liveSession }: any) {
  const { user } = useAuthStore()

  const { data, isLoading: isChecking } = useCheckInstructorFollow(
    liveSession?.instructor?.code,
    !!user
  )
  const { mutate, isPending } = useFollowInstructor()

  const isLoading = isChecking || isPending
  const isFollowed = !!data?.followed
  const isAuthor = user?.code === liveSession?.instructor?.code

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="size-12 border-2 border-primary">
              <AvatarImage
                src={liveSession?.instructor?.avatar}
                alt={liveSession?.instructor?.name}
              />
              <AvatarFallback>
                {liveSession?.instructor?.name?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">
                {liveSession?.title || ''}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1">
                <Link
                  href={
                    isAuthor
                      ? '/me'
                      : `/profile/${liveSession?.instructor?.code}`
                  }
                  className="font-medium text-foreground"
                  target="_blank"
                >
                  {liveSession?.instructor?.name || ''}
                </Link>
              </CardDescription>
            </div>
          </div>

          {!isAuthor && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => mutate({ code: liveSession?.instructor?.code })}
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

      <CardContent className="pt-0">
        <div className="mt-2 space-y-3">
          {liveSession?.description && (
            <p className="text-sm text-muted-foreground">
              {liveSession.description}
            </p>
          )}

          <div className="flex flex-wrap gap-6">
            {liveSession?.starts_at && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span>{formatDate(liveSession.starts_at)}</span>
              </div>
            )}

            {liveSession?.status && (
              <Badge
                variant={
                  liveSession.status === 'upcoming' ? 'outline' : 'default'
                }
                className="rounded-md"
              >
                {liveSession.status === 'upcoming'
                  ? 'Sắp diễn ra'
                  : liveSession.status === 'live'
                    ? 'Đang phát trực tiếp'
                    : liveSession.status === 'ended'
                      ? 'Đã kết thúc'
                      : liveSession.status}
              </Badge>
            )}

            {liveSession?.visibility && (
              <div className="flex items-center gap-2 text-sm">
                <Info className="size-4 text-muted-foreground" />
                <span className="capitalize">
                  {liveSession.visibility === 'public'
                    ? 'Công khai'
                    : 'Riêng tư'}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {liveSession?.instructor?.profile?.about_me && (
        <CardFooter className="border-t pt-4">
          <div>
            <h4 className="text-sm font-medium">Giới thiệu giảng viên</h4>
            <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
              {liveSession.instructor.profile.about_me}
            </p>
            <Link
              href={
                isAuthor ? '/me' : `/profile/${liveSession?.instructor?.code}`
              }
              className="mt-2 text-xs font-medium text-primary hover:underline"
              target="_blank"
            >
              Xem thêm
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
