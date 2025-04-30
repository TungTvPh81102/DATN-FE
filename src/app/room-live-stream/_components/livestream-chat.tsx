'use client'

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Loader2, Send, SmilePlus } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSendMessageLive } from '@/hooks/live/useLive'
import echo from '@/lib/echo'
import { toast } from 'react-toastify'
import { formatDate } from '@/lib/common'
import { LiveChat } from '@/types/Live'
import { Badge } from '@/components/ui/badge'

interface LivestreamChatProps {
  liveSession: any
  streamStatus?: 'upcoming' | 'live' | 'ended' | 'connecting'
}

export function LivestreamChat({
  liveSession,
  streamStatus = 'upcoming',
}: LivestreamChatProps) {
  const [chatMessages, setChatMessages] = useState<LiveChat[]>([])
  const [message, setMessage] = useState('')
  const { user, isAuthenticated } = useAuthStore()
  const { mutate: sendMessageLive, isPending } = useSendMessageLive()

  useEffect(() => {
    if (liveSession?.conversation?.messages) {
      const oldMessages = liveSession.conversation.messages.map((msg: any) => ({
        id: msg.id,
        userId: msg.sender_id,
        userName: msg.sender.name,
        message: msg.content,
        userAvatar: msg.sender.avatar,
        timestamp: formatDate(msg.created_at),
      }))

      setChatMessages(oldMessages)
    }
  }, [liveSession])

  useEffect(() => {
    if (liveSession?.id && user?.id) {
      const channel = echo.channel(`live-session.${liveSession.id}`)

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

      return () => {
        channel.stopListening('LiveChatMessageSent')
      }
    }
  }, [liveSession?.id, user?.id])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSendMessage()
    }
  }

  const handleSendMessage = () => {
    if (!message.trim() || !liveSession?.id) return

    sendMessageLive(
      { liveSessionId: liveSession.id, data: { message: message.trim() } },
      {
        onSuccess: () => {
          setMessage('')
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Không thể gửi tin nhắn')
        },
      }
    )
  }

  return (
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
        <div className="space-y-4">
          {chatMessages.map((msg) => (
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
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{msg?.userName}</span>
                </div>
                <p className="max-h-32 overflow-y-auto whitespace-pre-wrap break-words text-sm text-slate-700">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                disabled={streamStatus !== 'live'}
                variant="outline"
                size="icon"
                className="shrink-0"
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
            disabled={!isAuthenticated || !message.trim() || isPending}
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
        {streamStatus === 'connecting' && (
          <p className="mt-2 text-center text-xs text-slate-500">
            Chat sẽ mở khi stream được kết nối.
          </p>
        )}
      </div>
    </div>
  )
}
