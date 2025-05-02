'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  CircleHelp,
  AlertCircle,
  SmilePlus,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGetLiveSchedule, useSendMessageLive } from '@/hooks/live/useLive'
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
import { toast } from 'react-toastify'
import { toast as toastHot } from 'react-hot-toast'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { LiveChat } from '@/types/Live'

const StreamingView = ({ code }: { code: string }) => {
  const { user } = useAuthStore()
  const router = useRouter()

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

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isOBSDialogOpen, setIsOBSDialogOpen] = useState(false)

  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<LiveChat[]>([])
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useGetLiveSchedule(code)
  const { mutate: sendMessageLive, isPending } = useSendMessageLive()

  useEffect(() => {
    if (!user?.id) return

    const channel = echo.channel(`live-session.${data?.id}`)

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

    channel.listen('LiveChatMessageSent', (event: any) => {
      const newMessage: LiveChat = {
        id: event.id || Date.now(),
        userId: event.user_id,
        userName: event.user_name,
        message: event.message,
        timestamp: formatDate(event.timestamp, {
          hour: '2-digit',
          minute: '2-digit',
        }),
        userAvatar: event.user_avater || '',
      }

      setChatMessages((prev) => [...prev, newMessage])
    })

    channel.listen('.user-joined', (event: any) => {
      toastHot.success(event.message)
    })

    return () => {
      channel.stopListening('.status-changed')
      channel.stopListening('LiveChatMessageSent')
      channel.stopListening('.user-joined')
    }
  }, [data?.id, data?.instructor_id, user?.id])

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
    scrollToBottom()
  }, [chatMessages])

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
      } else if (data.status === 'overdue') {
        setStreamStatus('overdue')
      } else {
        setStreamStatus('upcoming')
      }

      if (data.conversation?.messages) {
        const oldMessages = data.conversation.messages
          .slice()
          .reverse()
          .map((msg: any) => ({
            id: msg.id,
            userId: msg.sender_id,
            userName: msg.sender.name,
            message: msg.content,
            userAvatar: msg.sender.avatar,
            timestamp: formatDate(msg.created_at),
          }))

        setChatMessages(oldMessages)
      }
    }
  }, [data])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  const handleSendMessage = () => {
    if (!message.trim() || !data?.id) return

    sendMessageLive(
      { liveSessionId: data.id, data: { message: message.trim() } },
      {
        onSuccess: () => {
          setMessage('')
          setTimeout(() => {
            scrollToBottom()
          }, 100)
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Không thể gửi tin nhắn')
        },
      }
    )
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
    router.push('/live-streaming/manage-schedule')
    return null
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
                {streamStatus !== 'ended' && streamStatus !== 'overdue' && (
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
                                : streamStatus === 'overdue'
                                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                                  : 'border-gray-500 bg-gray-50 text-gray-700'
                          }
                        >
                          {streamStatus === 'live' && 'Đang phát sóng'}
                          {streamStatus === 'upcoming' && 'Sắp diễn ra'}
                          {streamStatus === 'overdue' && 'Đã quá hạn'}
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

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
            {streamStatus === 'upcoming' ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Clock className="mb-2 size-12 text-slate-300" />
                <p className="text-sm text-slate-600">
                  Chat sẽ khả dụng khi buổi học bắt đầu
                </p>
              </div>
            ) : streamStatus === 'overdue' ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <AlertCircle className="mb-2 size-12 text-amber-400" />
                <p className="text-sm text-slate-600">
                  Buổi học đã quá hạn và không diễn ra
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages?.map((msg) => (
                  <div key={msg.id} className="flex space-x-2">
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage
                        src={msg?.userAvatar || '/default-avatar.png'}
                        alt={msg?.userName || ''}
                      />
                      <AvatarFallback className="bg-slate-200 text-slate-700">
                        {msg?.userName?.charAt(0) || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium`}>{msg?.userName}</span>
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    disabled={streamStatus !== 'live'}
                  >
                    <SmilePlus className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start" side="top">
                  <div className="emoji-picker-container">
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        '😀',
                        '😍',
                        '😂',
                        '😢',
                        '👍',
                        '👎',
                        '👏',
                        '🔥',
                        '🎉',
                        '💯',
                      ].map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => setMessage((prev) => prev + emoji)}
                          className="p-2 text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Input
                placeholder="Nhập tin nhắn..."
                value={message}
                onKeyDown={handleKeyDown}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
                disabled={streamStatus !== 'live'}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={
                  !user?.id ||
                  !message.trim() ||
                  streamStatus !== 'live' ||
                  isPending
                }
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin text-primary-foreground" />
                ) : (
                  <Send className="size-4" />
                )}
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
            {streamStatus === 'overdue' && (
              <p className="mt-2 text-center text-xs text-slate-500">
                Buổi học đã quá hạn. Chat không khả dụng.
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
