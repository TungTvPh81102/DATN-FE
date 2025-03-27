'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuthStore } from '@/stores/useAuthStore'
import MuxPlayer from '@mux/mux-player-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Loader2, Smile } from 'lucide-react'
import { toast } from 'react-toastify'

import echo from '@/lib/echo'
import { useLiveSessionInfo, useSendMessageLive } from '@/hooks/live/useLive'

import { Button } from '@/components/ui/button'
import ModalLoading from '@/components/common/ModalLoading'

interface ChatMessage {
  id: number
  userId?: number | null
  userName?: string
  message: string
  timestamp: string
  userAvatar?: string
  type?: 'chat' | 'system'
}

const RoomLiveStream = ({ id }: { id: string }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [joinNotification, setJoinNotification] = useState<string | null>(null)

  const { isAuthenticated } = useAuthStore()
  const { data: liveSession, isLoading } = useLiveSessionInfo(id)
  const { mutate: sendMessage, isPending } = useSendMessageLive()

  useEffect(() => {
    if (liveSession?.data.conversation?.messages) {
      const instructorId = liveSession.data.instructor.id

      const oldMessages = liveSession.data.conversation.messages.map(
        (msg: any) => ({
          id: msg.id,
          userId: msg.sender_id,
          userName:
            msg.sender_id === instructorId
              ? 'Giảng viên'
              : `Học viên ${msg.sender_id}`,
          message: msg.content,
          userAvatar:
            msg.sender_id === instructorId
              ? liveSession.data.instructor.avatar
              : '/default-avatar.png',
          timestamp: new Date(msg.created_at).toLocaleTimeString(),
        })
      )

      setChatMessages(oldMessages)
    }
  }, [liveSession])

  useEffect(() => {
    if (liveSession?.data.id) {
      const channel = echo.channel(`live-session.${liveSession.data.id}`)

      channel.listen('LiveChatMessageSent', (event: any) => {
        const newMessage: ChatMessage = {
          id: event.id,
          userId: event.user?.id,
          userName:
            event.user?.id === liveSession.data.instructor.id
              ? 'Giảng viên'
              : event.user?.name,
          message: event.message,
          timestamp: new Date().toLocaleTimeString(),
          userAvatar: event.user?.avatar,
        }

        setChatMessages((prev) => [...prev, newMessage])
      })

      channel.listen('UserJoinedLiveSession', (event: any) => {
        const systemMessage: ChatMessage = {
          id: Date.now(),
          message: event.message,
          timestamp: new Date().toLocaleTimeString(),
          type: 'system',
        }

        setChatMessages((prev) => [...prev, systemMessage])
        setJoinNotification(event.message)

        setTimeout(() => setJoinNotification(null), 3000)
      })

      return () => {
        channel.stopListening('LiveChatMessageSent')
        channel.stopListening('UserJoinedLiveSession')
      }
    }
  }, [liveSession?.data])

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !liveSession?.data.id) return

    sendMessage(
      { liveSessionId: liveSession.data.id, data: { message: chatInput } },
      {
        onSuccess: () => {
          setChatInput('')
        },
        onError: (error: any) => {
          toast.success(error?.message)
          const errorMessage: ChatMessage = {
            id: Date.now(),
            message: 'Không thể gửi tin nhắn. Vui lòng thử lại.',
            timestamp: new Date().toLocaleTimeString(),
            type: 'system',
          }
          setChatMessages((prev) => [...prev, errorMessage])
        },
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isAuthenticated && chatInput.trim()) {
      handleSendMessage()
    }
  }

  if (isLoading) return <ModalLoading />

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="relative flex w-2/3 flex-col border-r border-gray-300">
        <div className="flex items-center justify-between bg-white p-4 shadow-md">
          <h1 className="text-lg font-semibold text-gray-800">
            Phòng live của: {liveSession?.data.instructor.name || ''}
          </h1>
        </div>

        <div className="relative flex grow items-center justify-center bg-black">
          <MuxPlayer
            // streamType="live"
            playbackId={liveSession?.data.mux_playback_id}
            // metadata={{ viewer_user_id: user?.id || 'anonymous' }}
            className="size-full"
            accentColor={'hsl(var(--primary))'}
          />

          {joinNotification && (
            <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-md bg-white px-4 py-2 text-gray-800 shadow-lg">
              {joinNotification}
            </div>
          )}
        </div>
      </div>

      <div className="flex w-1/3 flex-col border-b bg-white">
        <div className="bg-white p-4 shadow-md">
          <h1 className="text-lg font-semibold text-gray-800">Tin nhắn</h1>
        </div>

        <ScrollArea className="grow space-y-4 overflow-y-auto bg-gray-50 p-4">
          {chatMessages.map((message, index) => {
            if (message.type === 'system') {
              return (
                <div
                  key={index}
                  className="my-2 text-center text-sm italic text-gray-500"
                >
                  {message.message}
                </div>
              )
            }

            return (
              <div
                key={index}
                className="flex items-start space-x-3 rounded-md border border-gray-200 bg-white p-2 shadow-sm"
              >
                <Image
                  width={50}
                  height={50}
                  src={message.userAvatar || '/default-avatar.png'}
                  alt={message.userName || ''}
                  className="size-10 rounded-full"
                />
                <div className="flex max-w-full flex-col">
                  <p className="text-sm font-medium text-gray-800">
                    {message.userName}
                  </p>
                  <p className="break-words text-sm text-gray-700">
                    {message.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            )
          })}
        </ScrollArea>

        <div className="flex items-center border-t border-gray-300 p-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                <Smile size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="rounded-md bg-white p-2 text-sm shadow-lg"
            >
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
                    onClick={() => setChatInput((prev) => prev + emoji)}
                    className="text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="mx-2 grow rounded-md border border-gray-300 px-4 py-2 text-sm"
          />

          <Button
            disabled={!isAuthenticated || chatInput.trim().length === 0}
            onClick={handleSendMessage}
            className="rounded-md px-4 py-2 text-sm text-white hover:bg-orange-600"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 animate-spin" /> Đang gửi...
              </>
            ) : (
              'Gửi'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RoomLiveStream
