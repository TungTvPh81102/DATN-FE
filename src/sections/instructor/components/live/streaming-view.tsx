'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Send,
  Edit,
  Loader2,
  Clock,
  CircleHelp,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useGetLiveSchedule } from '@/hooks/live/useLive'
import { formatDate } from '@/lib/common'
import { useAuthStore } from '@/stores/useAuthStore'
import echo from '@/lib/echo'
import { VisibilityBadge } from '@/app/live-streaming/components/visibility-badge'
import DialogStreamEdit from '@/app/live-streaming/components/dialog-stream-edit'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StreamContent from '@/app/live-streaming/components/stream-content'

const StreamingView = ({ code }: { code: string }) => {
  const { user } = useAuthStore()
  const router = useRouter()

  const [message, setMessage] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [streamTitle, setStreamTitle] = useState('')
  const [streamDescription, setStreamDescription] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [thumbnailUrl, setThumbnailUrl] = useState('/api/placeholder/640/360')
  const [startTime, setStartTime] = useState('')

  const [streamStatus, setStreamStatus] = useState('upcoming')
  const [streamUrl, setStreamUrl] = useState('')
  const [playbackId, setPlaybackId] = useState('')
  const [viewerCount, setViewerCount] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isOBSDialogOpen, setIsOBSDialogOpen] = useState(false)

  const { data, isLoading } = useGetLiveSchedule(code)

  const chatMessages = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      message: 'Xin chào thầy/cô!',
      time: '10:02',
      avatar: 'A',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      message: 'Buổi học hôm nay có gì thú vị vậy ạ?',
      time: '10:03',
      avatar: 'B',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      message: 'Thầy/cô có thể giải thích lại phần đầu được không ạ?',
      time: '10:05',
      avatar: 'C',
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      message: 'Xin cảm ơn thầy/cô vì bài giảng rất hay!',
      time: '10:08',
      avatar: 'D',
    },
    {
      id: 5,
      name: 'Hồ Văn E',
      message: 'Tôi có một câu hỏi về phần React Hooks...',
      time: '10:10',
      avatar: 'E',
    },
    {
      id: 6,
      name: 'Vũ Thị F',
      message: 'Có thể chia sẻ thêm các ví dụ không ạ?',
      time: '10:12',
      avatar: 'F',
    },
    {
      id: 7,
      name: 'Đinh Văn G',
      message: 'Phần cuối mình không nghe rõ, có thể nhắc lại không ạ?',
      time: '10:15',
      avatar: 'G',
    },
  ]

  console.log(data)

  useEffect(() => {
    if (!user?.id) return

    const channel = echo.channel(`live-sessions.${data?.id}`)

    channel.listen('.status-changed', (event: any) => {
      if (event.data.session.status === 'live') {
        setStreamStatus('connecting')
        setTimeout(() => {
          if (event.data && event.data.playback_id) {
            setStreamUrl(event.data.playback_id)
            setStreamStatus('live')
          }
        }, 10000)
      } else if (
        event.data.session.status === 'ended' ||
        event.data.session.status === 'completed'
      ) {
        setStreamStatus('ended')
        if (event.data && event.data.playback_id) {
          setPlaybackId(event.data.playback_id)
        }
      }
    })

    return () => {
      channel.stopListening('.status-changed')
    }
  }, [user?.id, data?.id])

  useEffect(() => {
    if (streamStatus === 'live') {
      const interval = setInterval(() => {
        setViewerCount((prev) =>
          Math.min(prev + Math.floor(Math.random() * 3), 100)
        )
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [streamStatus])

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined
    if (streamStatus === 'live') {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [streamStatus])

  useEffect(() => {
    if (data) {
      setStreamTitle(data.title || '')
      setStreamDescription(data.description || '')
      setPrivacy(data.visibility || 'public')
      setThumbnailUrl(
        data.thumbnail ||
          'https://res.cloudinary.com/dvrexlsgx/image/upload/v1745869020/Gemini_Generated_Image_nkbuicnkbuicnkbu_qz4jrz.jpg'
      )
      setStartTime(data.starts_at || '')

      if (data.status === 'live') {
        setStreamStatus('live')
        setStreamUrl(data.live_stream_credential.mux_playback_id || '')
      } else if (data.status === 'ended') {
        setStreamStatus('ended')
        setPlaybackId(data.recording_playback_id || '')
      } else {
        setStreamStatus('upcoming')
      }
    }
  }, [data])

  const sendMessage = () => {
    if (message.trim()) {
      setMessage('')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center rounded-lg p-8">
          <div className="mb-4 rounded-full bg-orange-50 p-4">
            <Loader2 className="size-12 animate-spin text-primary" />
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-slate-900">
            Đang tải phiên livestream
          </h2>
          <p className="text-center text-slate-600">
            Chúng tôi đang chuẩn bị không gian phát trực tuyến của bạn
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return router.push('/live-streaming/manage-schedule')
  }

  return (
    <div className="flex size-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Cài đặt phát trực tiếp
            </h1>
            <CircleHelp
              className="cursor-pointer"
              onClick={() => setIsOBSDialogOpen(true)}
              size={16}
            />
          </div>
          <p className="text-slate-500">
            Thiết lập phiên livestream của bạn trên CourseMeLy
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="relative aspect-video w-full bg-black">
            <StreamContent
              streamStatus={streamStatus}
              streamTitle={streamTitle}
              startTime={startTime}
              streamUrl={streamUrl}
              playbackId={playbackId}
              duration={duration}
              viewerCount={viewerCount}
            />
          </div>
        </Card>

        <div className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  Thông tin phát trực tiếp
                </CardTitle>
                {streamStatus !== 'ended' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditDialogOpen(true)}
                    className="flex items-center"
                  >
                    <Edit className="mr-1 size-4" />
                    Chỉnh sửa
                  </Button>
                )}
              </div>
              <CardDescription>
                Thiết lập các thông số cho phiên livestream của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 sm:col-span-3">
                  <div className="overflow-hidden rounded-md">
                    <Image
                      src={thumbnailUrl}
                      alt="Thumbnail"
                      width={640}
                      height={360}
                      className="aspect-video w-full object-cover"
                      priority={false}
                      quality={75}
                    />
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-9">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {streamTitle}
                      </h3>
                      <p className="mt-1 text-slate-700">{streamDescription}</p>
                      {startTime && (
                        <p className="mt-2 text-sm text-slate-600">
                          <span className="font-medium">
                            Thời gian bắt đầu:
                          </span>{' '}
                          {formatDate(startTime, {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Chế độ:</span>
                        <VisibilityBadge
                          visibility={privacy as 'public' | 'private'}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Trạng thái:</span>
                        <Badge
                          variant="outline"
                          className={
                            streamStatus === 'live'
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : streamStatus === 'upcoming'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-500 bg-gray-50 text-gray-700'
                          }
                        >
                          {streamStatus === 'live' && 'Đang phát sóng'}
                          {streamStatus === 'upcoming' && 'Sắp diễn ra'}
                          {streamStatus === 'ended' &&
                            'Đã kết thúc - Có bản ghi'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-80 shrink-0 border-l border-slate-200 bg-white">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Chat phiên học</h3>
              <Badge
                variant="outline"
                className={`${streamStatus === 'live' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
              >
                {streamStatus === 'live' ? 'Trực tuyến' : 'Ngoại tuyến'}
              </Badge>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {streamStatus === 'upcoming' ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Clock className="mb-2 size-12 text-slate-300" />
                <p className="text-sm text-slate-600">
                  Chat sẽ khả dụng khi buổi học bắt đầu
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex space-x-2">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="bg-slate-200 text-slate-700">
                        {msg.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{msg.name}</p>
                        <span className="text-xs text-slate-500">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
                disabled={streamStatus !== 'live'}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!message.trim() || streamStatus !== 'live'}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="size-4" />
              </Button>
            </div>
            {streamStatus === 'ended' && (
              <p className="mt-2 text-center text-xs text-slate-500">
                Buổi học đã kết thúc. Chat không còn khả dụng.
              </p>
            )}
            {streamStatus === 'upcoming' && (
              <p className="mt-2 text-center text-xs text-slate-500">
                Chat sẽ mở khi buổi học bắt đầu.
              </p>
            )}
            {streamStatus === 'connecting' && (
              <p className="mt-2 text-center text-xs text-slate-500">
                Chat sẽ mở khi stream được kết nối.
              </p>
            )}
          </div>
        </div>
      </div>

      <DialogStreamEdit
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        data={data || {}}
        onSave={(updatedData) => {
          setStreamTitle(updatedData.title || '')
          setStreamDescription(updatedData.description || '')
          setPrivacy(updatedData.visibility || 'public')
          setThumbnailUrl(
            updatedData.thumbnail ||
              'https://res.cloudinary.com/dvrexlsgx/image/upload/v1745869019/Gemini_Generated_Image_ruui3nruui3nruui_ljsypw.jpg'
          )
          setIsEditDialogOpen(false)
        }}
      />

      <Dialog open={isOBSDialogOpen} onOpenChange={setIsOBSDialogOpen}>
        <DialogContent className="sm:max-w-md lg:max-w-lg">
          <DialogHeader>
            <DialogTitle>Kết nối với OBS Studio</DialogTitle>
            <DialogDescription>
              Để bắt đầu phát trực tiếp, bạn cần kết nối với phần mềm OBS
              Studio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 rounded-md border border-orange-200 bg-orange-50 p-3 text-orange-800">
                <AlertCircle className="size-5 text-orange-500" />
                <p className="text-sm">
                  OBS Studio cần được cài đặt và cấu hình trước trên máy tính
                  của bạn.
                </p>
              </div>

              <div className="mt-2 space-y-3 text-sm">
                <p>Để sử dụng tính năng này:</p>
                <ol className="ml-5 list-decimal space-y-2">
                  <li>Đảm bảo OBS Studio đã được cài đặt</li>
                  <li>Mở OBS Studio trên máy tính của bạn</li>
                  <li>
                    Cấu hình thông số stream trong OBS phù hợp với CourseMeLy
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
            <Button variant="outline" onClick={() => setIsOBSDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open('https://obsproject.com/download', '_blank')
              }
            >
              Tải OBS Studio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StreamingView
