import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, Loader2, Video, Eye, AlertCircle } from 'lucide-react'
import MuxPlayer from '@mux/mux-player-react'

interface StreamContentProps {
  streamStatus: string
  streamTitle: string
  startTime: string
  streamUrl?: string
  playbackId: string
  duration?: number
  viewerCount?: number
}

const formatTimeRemaining = (startTimeStr: string) => {
  const startDate = new Date(startTimeStr)
  const now = new Date()
  const diffMs = startDate.getTime() - now.getTime()

  if (diffMs <= 0) return 'Sắp bắt đầu'

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffDays > 0) {
    return `Còn ${diffDays} ngày ${diffHours} giờ`
  } else if (diffHours > 0) {
    return `Còn ${diffHours} giờ ${diffMinutes} phút`
  } else {
    return `Còn ${diffMinutes} phút`
  }
}

const StreamContent = ({
  streamStatus,
  streamTitle,
  startTime,
  streamUrl,
  playbackId,
  viewerCount,
}: StreamContentProps) => {
  switch (streamStatus) {
    case 'upcoming':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-white">
          <Clock className="mb-2 size-16 text-blue-400" />
          <h3 className="mb-2 text-xl font-medium">Sắp diễn ra</h3>
          <p className="mb-3 text-lg">{streamTitle}</p>
          <Badge
            variant="outline"
            className="border-blue-400 bg-blue-900/50 text-blue-100"
          >
            {startTime
              ? formatTimeRemaining(startTime)
              : 'Chưa có thời gian bắt đầu'}
          </Badge>
          <p className="mt-4 text-sm text-slate-300">
            Buổi phát trực tiếp sẽ bắt đầu theo lịch
          </p>
        </div>
      )

    case 'overdue':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-900 to-amber-950 text-white">
          <AlertCircle className="mb-2 size-16 text-amber-400" />
          <h3 className="mb-2 text-xl font-medium">Đã quá hạn</h3>
          <p className="mb-3 text-lg">{streamTitle}</p>
          <Badge
            variant="outline"
            className="border-amber-400 bg-amber-900/50 text-amber-100"
          >
            Không được phát sóng
          </Badge>
          <p className="mt-4 text-sm text-amber-200">
            Buổi phát trực tiếp đã quá thời hạn và không diễn ra
          </p>
        </div>
      )

    case 'connecting':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="mb-4 flex items-center justify-center">
            <Loader2 className="size-16 animate-spin text-yellow-400" />
          </div>
          <p className="text-lg">Đang thiết lập kết nối stream...</p>
          <p className="mt-2 text-sm text-slate-400">
            Khi bạn bắt đầu phát trực tiếp, video sẽ xuất hiện ở đây
          </p>
        </div>
      )

    case 'live':
      return (
        <>
          {streamUrl ? (
            <MuxPlayer
              playbackId={streamUrl}
              metadata={{
                video_title: streamTitle,
                player_name: 'CourseMeLy Player',
              }}
              className="size-full"
              accentColor={'hsl(var(--primary))'}
              streamType="live"
              autoPlay
              muted={false}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white">
              <Loader2 className="mb-2 size-16 animate-spin text-primary" />
              <p className="text-lg">Đang kết nối stream...</p>
            </div>
          )}

          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge
                variant="destructive"
                className="flex items-center gap-1 bg-red-600"
              >
                <span className="block size-2 animate-pulse rounded-full bg-white"></span>
                LIVE
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-black/70 text-white">
                <Eye className="mr-1 size-3" /> {viewerCount}
              </Badge>
            </div>
          </div>
        </>
      )

    case 'ended':
      return (
        <>
          {playbackId ? (
            <MuxPlayer
              playbackId={playbackId}
              metadata={{
                video_title: streamTitle,
                player_name: 'CourseMeLy Player',
              }}
              className="size-full"
              accentColor={'hsl(var(--primary))'}
              streamType="on-demand"
              autoPlay={false}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
              <Video className="mb-2 size-16 text-gray-400" />
              <p className="text-lg">Buổi phát trực tiếp đã kết thúc</p>
              <p className="text-sm text-slate-400">
                Bản ghi sẽ sớm được xử lý và có sẵn để xem lại
              </p>
            </div>
          )}

          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-slate-600 bg-slate-800/80 text-white"
            >
              Xem lại
            </Badge>
          </div>
        </>
      )

    default:
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <Video className="mb-2 size-16 opacity-60" />
          <p className="text-lg">Đang tải thông tin stream...</p>
        </div>
      )
  }
}

export default StreamContent
