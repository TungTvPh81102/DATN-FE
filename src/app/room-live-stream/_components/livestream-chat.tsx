'use client'

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Loader2, MessageSquare, Send, SmilePlus, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSendMessageLive } from '@/hooks/live/useLive'
import echo from '@/lib/echo'
import { toast } from 'react-toastify'
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

interface LivestreamChatProps {
  id: string
  liveSession: any
  setJoinNotification: (notification: string | null) => void
  isLoading?: boolean
}

export function LivestreamChat({
  liveSession,
  setJoinNotification,
  isLoading,
}: LivestreamChatProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const { isAuthenticated } = useAuthStore()
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
    <Card className="flex h-full flex-col">
      <CardHeader className="border-b pb-3 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Chat</CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8">
              <Users className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <Tabs defaultValue="chat" className="flex-1 overflow-hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageSquare className="size-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="participants" className="flex items-center gap-1">
            <Users className="size-4" />
            <span>Participants</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="chat"
          className="flex h-[480px] flex-col data-[state=inactive]:hidden"
        >
          <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
            {chatMessages.map((chat) => (
              <div key={chat.id} className="flex items-start gap-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={chat?.userAvatar || '/default-avatar.png'}
                    alt={chat?.userName || ''}
                  />
                  <AvatarFallback>
                    {chat?.userName?.charAt(0) || ''}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className={`font-medium}`}>{chat?.userName}</span>
                  </div>
                  <p className="text-sm">{chat.message}</p>
                  <span className="text-xs text-muted-foreground">
                    {chat?.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
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
                          onClick={() => setChatInput((prev) => prev + emoji)}
                          className="p-2 text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="relative flex-1">
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="pr-16"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button
                size="icon"
                className="shrink-0"
                disabled={!isAuthenticated || chatInput.trim().length === 0}
                onClick={handleSendMessage}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-primary-foreground" />
                  </>
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </CardFooter>
        </TabsContent>
        <TabsContent
          value="participants"
          className="h-[calc(100%-40px)] data-[state=inactive]:hidden"
        >
          <CardContent className="h-full overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium">Moderators (2)</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="GameMaster"
                        />
                        <AvatarFallback>GM</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-primary">
                        GameMaster
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Follow
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="ModHelper"
                        />
                        <AvatarFallback>MH</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-primary">
                        ModHelper
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium">VIP Members (3)</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="Alex"
                        />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-blue-500">Alex</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Follow
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="Jessica"
                        />
                        <AvatarFallback>J</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-green-500">
                        Jessica
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Follow
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="Chris"
                        />
                        <AvatarFallback>C</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-amber-500">Chris</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium">Viewers (1,243)</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="Sarah"
                        />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-pink-500">Sarah</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Follow
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="Mike"
                        />
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-purple-500">Mike</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Follow
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="Taylor"
                        />
                        <AvatarFallback>T</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Taylor</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Follow
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" className="mt-2 w-full text-xs">
                  Show more
                </Button>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
