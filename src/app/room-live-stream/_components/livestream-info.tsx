'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/common'

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

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <Avatar className="size-12 border-2 border-[#E27447] shadow-sm">
              <AvatarImage
                src={liveSession?.instructor?.avatar || '/placeholder.svg'}
                alt={liveSession?.instructor?.name}
              />
              <AvatarFallback className="bg-[#E27447]/10 text-[#E27447]">
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
                  className="font-medium text-[#E27447] hover:underline"
                  target="_blank"
                >
                  {liveSession?.instructor?.name || ''}
                </Link>
                {liveSession?.instructor?.verified && (
                  <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    ✓
                  </span>
                )}
              </CardDescription>
            </div>
          </div>

          {!isAuthor && (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <Button
                variant="default"
                size="sm"
                className="gap-1 bg-[#E27447] hover:bg-[#E27447]/90"
                onClick={() => mutate({ code: liveSession?.instructor?.code })}
                disabled={isLoading}
              >
                {user ? (
                  isLoading ? (
                    <Loader2 className="inline-block size-4 animate-spin" />
                  ) : isFollowed ? (
                    <UserCheck size={16} />
                  ) : (
                    <UserPlus size={16} />
                  )
                ) : (
                  <UserPlus size={16} />
                )}
                <span>
                  {user
                    ? isLoading
                      ? 'Đang xử lý'
                      : isFollowed
                        ? 'Đang theo dõi'
                        : 'Theo dõi'
                    : 'Theo dõi'}
                </span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-9 border-slate-300"
              >
                <Bell className="size-4 text-slate-700" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-9 border-slate-300"
              >
                <Share2 className="size-4 text-slate-700" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100">
          <TabsTrigger value="info" className="text-sm">
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="instructor" className="text-sm">
            Giảng viên
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="pt-4">
          <CardContent>
            <div className="space-y-4">
              {liveSession?.description && (
                <p className="text-sm text-slate-700">
                  {liveSession.description}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
                {liveSession?.starts_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-[#E27447]" />
                    <span className="font-medium text-slate-700">
                      {formatDate(liveSession.starts_at, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}

                {liveSession?.status && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        liveSession.status === 'live' ? 'default' : 'outline'
                      }
                      className={`rounded-md ${
                        liveSession.status === 'live'
                          ? 'bg-green-500 text-white'
                          : liveSession.status === 'upcoming'
                            ? 'border-blue-500 text-blue-500'
                            : 'border-slate-500 text-slate-500'
                      }`}
                    >
                      {liveSession.status === 'upcoming'
                        ? 'Sắp diễn ra'
                        : liveSession.status === 'live'
                          ? 'Đang phát trực tiếp'
                          : liveSession.status === 'ended'
                            ? 'Đã kết thúc'
                            : liveSession.status}
                    </Badge>
                  </div>
                )}

                {liveSession?.visibility && (
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="size-4 text-[#E27447]" />
                    <span className="font-medium capitalize text-slate-700">
                      {liveSession.visibility === 'public'
                        ? 'Công khai'
                        : 'Riêng tư'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="instructor" className="pt-4">
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-14 border-2 border-[#E27447]">
                  <AvatarImage
                    src={liveSession?.instructor?.avatar || '/placeholder.svg'}
                    alt={liveSession?.instructor?.name}
                  />
                  <AvatarFallback className="bg-[#E27447]/10 text-[#E27447]">
                    {liveSession?.instructor?.name?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {liveSession?.instructor?.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {liveSession?.instructor?.title || 'Giảng viên'}
                  </p>
                </div>
              </div>

              {liveSession?.instructor?.profile?.about_me && (
                <div className="rounded-lg bg-slate-50 p-4">
                  <h4 className="mb-2 font-medium text-slate-900">
                    Giới thiệu
                  </h4>
                  <p className="text-sm text-slate-700">
                    {liveSession.instructor.profile.about_me}
                  </p>
                  <Link
                    href={
                      isAuthor
                        ? '/me'
                        : `/profile/${liveSession?.instructor?.code}`
                    }
                    className="mt-3 inline-block text-sm font-medium text-[#E27447] hover:underline"
                    target="_blank"
                  >
                    Xem hồ sơ đầy đủ
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
