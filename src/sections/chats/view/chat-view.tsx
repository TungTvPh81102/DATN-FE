'use client'

import type { EmojiClickData } from 'emoji-picker-react'
import EmojiPicker from 'emoji-picker-react'
import {
  Archive,
  Film,
  Info,
  Loader2,
  Menu,
  MoreVertical,
  Paperclip,
  Plus,
  Search,
  Send,
  ShieldAlert,
  Smile,
  Trash2,
  Volume2,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import EmptyChatState from '@/components/shared/empty-chat-state'
import {
  EnhancedMessageItem,
  ReplyPreview,
} from '@/components/shared/message-content'
import { SidebarChatInfo } from '@/components/chat/sidebar-chat-info'
import { AutosizeTextarea } from '@/components/ui/autosize-textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PLACEHOLDER_AVATAR } from '@/constants/common'
import { useGetMessage, useSendMessage } from '@/hooks/chat/useChat'
import { timeAgo } from '@/lib/common'
import echo from '@/lib/echo'
import { useAuthStore } from '@/stores/useAuthStore'
import { IChannel, IMessage } from '@/types/Chat'
import { MessagePayload } from '@/validations/chat'
import Image from 'next/image'
import { ChatSidebar } from '../_components/chat-sidebar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'react-toastify'

interface FilePreview {
  name: string
  url: string
  type: 'file' | 'image' | 'video'
  blob: Blob
}

const ChatView = () => {
  const { user } = useAuthStore()

  const [message, setMessage] = useState('')
  const [replyTo, setReplyTo] = useState<IMessage | null>(null)
  const [chats, setChats] = useState<Record<number, IMessage[]>>({})
  // const selectedChannelLocal: IChannel | null = getLocalStorage(
  //   StorageKey.CHANNEL
  // )
  const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null)
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<number | null>(null)
  const [isUserBlocked, setIsUserBlocked] = useState(false)

  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([])
  const [openSidebarChatInfo, setOpenSidebarChatInfo] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: getMessageData, isLoading: isLoadingGetMessageData } =
    useGetMessage(selectedChannel?.conversation_id ?? 0)
  const { mutate: senderMessage, isPending: isPendingSendMessage } =
    useSendMessage()

  useEffect(() => {
    if (
      selectedChannel?.type === 'group' &&
      selectedChannel.users &&
      user?.id
    ) {
      const currentUserInGroup = selectedChannel.users.find(
        (groupUser) => groupUser.id === user.id
      )
      if (currentUserInGroup && currentUserInGroup.is_blocked === 1) {
        setIsUserBlocked(true)
      } else {
        setIsUserBlocked(false)
      }
    } else {
      setIsUserBlocked(false)
    }
  }, [selectedChannel, user])

  useEffect(() => {
    if (getMessageData && selectedChannel) {
      const conversationId = selectedChannel?.conversation_id

      const messages = getMessageData?.messages || []

      const formattedMessages = messages.map((msg: any) => ({
        id: msg.id,
        senderId: msg.sender_id,
        text: msg.content,
        type: msg.type,
        meta_data: msg.meta_data,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sender: {
          name: msg.sender.name,
          avatar: msg.sender.avatar,
        },
        parent: msg.parent
          ? {
              id: msg.parent.id,
              senderId: msg.parent.sender_id,
              text: msg.parent.content,
              sender: {
                name: msg.parent.sender.name,
                avatar: msg.parent.sender.avatar,
              },
            }
          : null,
      }))

      setCurrentUser(user?.id ?? null)

      setChats((prev) => ({
        ...prev,
        [conversationId]: formattedMessages,
      }))
    }
  }, [getMessageData, selectedChannel, user?.id])

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chats])

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji)
  }

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'file' | 'image' | 'video'
  ) => {
    if (isUserBlocked) return

    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newPreviews = files
      .map((file) => {
        if (type === 'image' && !file.type.startsWith('image/')) {
          alert('Please select an image file')
          return null
        }

        if (type === 'video' && !file.type.startsWith('video/')) {
          alert('Please select a video file')
          return null
        }

        const fileUrl = URL.createObjectURL(file)
        return {
          name: file.name,
          url: fileUrl,
          type,
          blob: file,
        }
      })
      .filter((preview) => preview !== null)

    setFilePreviews((prev) => [...prev, ...newPreviews])
    e.target.value = ''
  }

  const removeFilePreview = (index: number) => {
    setFilePreviews((prev) => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index].url)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isUserBlocked) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    return () => {
      Object.values(chats).forEach((messages) => {
        messages.forEach((msg) => {
          if (msg.meta_data?.file_path) {
            URL.revokeObjectURL(msg.meta_data.file_path)
          }
        })
      })
      filePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url)
      })
    }
  }, [chats, filePreviews])

  useEffect(() => {
    setActiveUsers([])
    if (selectedChannel) {
      const conversationId = selectedChannel.conversation_id
      const channel = echo.join(`conversation.${conversationId}`)

      const handleNewMessage = (event: any) => {
        console.log(event)

        setChats((prevChats) => ({
          ...prevChats,
          [conversationId]: [
            ...(prevChats[conversationId] || []),
            {
              id: event.message_id,
              senderId: event.sender.id,
              content: event.content,
              text: event.content,
              type: event.type || 'text',
              meta_data: event.meta_data,
              timestamp: timeAgo(event.sent_at),
              sender: {
                name: event?.sender?.name || 'Unknown',
                avatar: event?.sender?.avatar ?? '',
              },
              parent: event.parent
                ? {
                    id: event.parent.id,
                    senderId: event.parent.sender_id,
                    text: event.parent.content,
                    sender: {
                      name: event.parent.sender.name,
                      avatar: event.parent.sender.avatar,
                    },
                  }
                : null,
            } satisfies IMessage,
          ],
        }))
      }

      channel
        .listen('.MessageSent', handleNewMessage)
        .here((users: any[]) => {
          console.log('Danh sách người dùng:', users)
          setActiveUsers(users)
        })
        .joining((user: any) => {
          console.log('Người dùng đã tham gia:', user.name)
          setActiveUsers((prev) => {
            const exists = prev.some((u) => u.id === user.id)
            return exists ? prev : [...prev, user]
          })
        })
        .leaving((user: any) => {
          console.log('Người dùng rời kênh:', user.name)
          setActiveUsers((prev) => prev.filter((u) => u.id !== user.id))
        })

      return () => {
        channel.stopListening('.MessageSent')
      }
    }
  }, [selectedChannel])

  const handleReply = (message: IMessage) => {
    if (isUserBlocked) return
    setReplyTo(message)
  }

  const clearReply = () => {
    setReplyTo(null)
  }

  const sendMessage = () => {
    if (isUserBlocked) return

    if (!message.trim() && filePreviews.length === 0) return
    if (!selectedChannel?.conversation_id) return

    let filesData = undefined
    if (filePreviews.length > 0) {
      filesData = filePreviews.map((preview) => ({
        name: preview.name,
        url: URL.createObjectURL(preview.blob),
        type: preview.type,
        blob: preview.blob,
      }))
    }

    const newMessage: MessagePayload = {
      conversation_id: selectedChannel?.conversation_id,
      parent_id: replyTo ? replyTo.id : undefined,
      content: message,
      type: 'text',
      file: filesData,
    }

    senderMessage(newMessage, {
      onSuccess: () => {
        setMessage('')
        setReplyTo(null)
        setFilePreviews([])
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

    filePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview.url)
    })
    setFilePreviews([])
  }

  const getFileSize = (blob: Blob) => {
    const bytes = blob.size
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const isUserOnline = (userId: number) => {
    return activeUsers.some((user) => user.id === userId)
  }

  const StatusIndicator = ({ isOnline }: { isOnline: boolean }) => (
    <div className="flex items-center gap-1.5">
      <div
        className={`size-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        } animate-${isOnline ? 'pulse' : 'none'}`}
      />
      <span className="text-xs font-medium text-muted-foreground">
        {isOnline ? 'Đang hoạt động' : 'Offline'}
      </span>
    </div>
  )

  const GroupActiveUsers = ({
    activeCount,
    totalCount,
  }: {
    activeCount: number
    totalCount: number
  }) => (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <div className="size-2 animate-pulse rounded-full bg-green-500" />
      </div>
      <span className="text-xs text-muted-foreground">
        {totalCount} thành viên -{' '}
        <span className="font-medium text-green-600">
          {activeCount} đang hoạt động
        </span>
      </span>
    </div>
  )

  return (
    <>
      <div className="flex h-full">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'file')}
          accept=".pdf,.doc,.docx,.txt,.zip,.rar"
          multiple
          disabled={isUserBlocked}
        />
        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'image')}
          accept="image/*"
          multiple
          disabled={isUserBlocked}
        />
        <input
          type="file"
          ref={videoInputRef}
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'video')}
          accept="video/*"
          multiple
          disabled={isUserBlocked}
        />

        <div className="hidden md:block">
          <ChatSidebar
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
          />
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 sm:max-w-xs">
            <ChatSidebar
              selectedChannel={selectedChannel}
              setSelectedChannel={(channel) => {
                setSelectedChannel(channel)
                setMobileMenuOpen(false)
              }}
            />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 flex-col">
          {selectedChannel ? (
            <>
              <div className="flex h-16 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="block self-center md:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu className="size-5" />
                  </Button>
                  {!openSidebarChatInfo && (
                    <div className="relative">
                      <Avatar className="size-8">
                        <AvatarImage
                          src={selectedChannel?.avatar || PLACEHOLDER_AVATAR}
                          alt={selectedChannel?.name}
                        />
                        <AvatarFallback>L</AvatarFallback>
                      </Avatar>
                      {selectedChannel?.type !== 'group' && (
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white ${
                            isUserOnline(selectedChannel?.id)
                              ? 'bg-green-500'
                              : 'bg-gray-400'
                          }`}
                        />
                      )}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold">
                        {selectedChannel.name}
                      </h2>
                      {isUserBlocked && (
                        <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
                          Bị chặn
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedChannel?.type === 'group' ? (
                        <GroupActiveUsers
                          activeCount={activeUsers.length}
                          totalCount={selectedChannel?.users_count ?? 0}
                        />
                      ) : (
                        <StatusIndicator
                          isOnline={isUserOnline(selectedChannel?.id)}
                        />
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  {showSearch ? (
                    <div className="flex items-center gap-2 rounded-md bg-secondary px-2">
                      <Search className="size-4 text-muted-foreground sm:block" />
                      <Input
                        ref={searchInputRef}
                        placeholder="Tìm kiếm tin nhắn"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => {
                          setShowSearch(false)
                          setSearchQuery('')
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowSearch(true)}
                      className="ml-auto sm:ml-0"
                    >
                      <Search className="size-5" />
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hidden sm:flex"
                      >
                        <MoreVertical className="size-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                        <Archive className="size-4" />
                        <span>Archive</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                        <Volume2 className="size-4" />
                        <span>Muted</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive">
                        <Trash2 className="size-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setOpenSidebarChatInfo(!openSidebarChatInfo)}
                  >
                    <Info className="size-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4 sm:p-4">
                <div className="space-y-4">
                  {isLoadingGetMessageData ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="size-8 animate-spin text-orange-500" />
                    </div>
                  ) : selectedChannel?.conversation_id !== undefined &&
                    chats[selectedChannel.conversation_id]?.length > 0 ? (
                    chats[selectedChannel.conversation_id]?.map(
                      (msg: IMessage) => {
                        const isCurrentUser = msg.senderId === currentUser
                        const isGroupChat = selectedChannel?.type === 'group'

                        return (
                          <EnhancedMessageItem
                            key={msg.id}
                            message={msg}
                            isCurrentUser={isCurrentUser}
                            isGroupChat={isGroupChat}
                            onReply={handleReply}
                          />
                        )
                      }
                    )
                  ) : (
                    <EmptyChatState conversationName={selectedChannel?.name} />
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {filePreviews.length > 0 && (
                <div className="border-t bg-secondary p-2">
                  <ScrollArea className="h-24 sm:h-32">
                    <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4">
                      {filePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          {preview.type === 'image' ? (
                            <div className="group relative aspect-video h-16 sm:h-24">
                              <Image
                                src={preview.url}
                                alt={preview.name}
                                className="absolute rounded-lg object-contain"
                                fill
                              />
                              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-8 text-white"
                                  onClick={() => removeFilePreview(index)}
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                            </div>
                          ) : preview.type === 'video' ? (
                            <div className="group relative">
                              <div className="relative h-24 w-full rounded-lg bg-black/10 sm:h-24">
                                <video
                                  src={preview.url}
                                  className="size-full rounded-lg object-cover"
                                  muted
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg">
                                  <Film className="mb-1 size-6 text-white/90" />
                                  <span className="line-clamp-1 rounded bg-black/30 px-1 text-xs text-white/90">
                                    {preview.name.substring(0, 15)}
                                    {preview.name.length > 15 ? '...' : ''}
                                  </span>
                                  <span className="mt-1 rounded bg-black/30 px-1 text-xs text-white/90">
                                    {getFileSize(preview.blob)}
                                  </span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-8 text-white"
                                    onClick={() => removeFilePreview(index)}
                                  >
                                    <X className="size-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="group relative flex h-24 flex-col items-center justify-center rounded-lg bg-background p-2 sm:h-24">
                              <Paperclip className="mb-1 size-5 sm:size-6" />
                              <span className="line-clamp-2 px-1 text-center text-xs">
                                {preview.name}
                              </span>
                              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-8 text-white"
                                  onClick={() => removeFilePreview(index)}
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-16 w-full rounded-lg sm:h-24"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Plus className="size-5 sm:size-6" />
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="border-t bg-white p-2 sm:p-4">
                {isUserBlocked && (
                  <Alert className="mb-2 border-red-200 bg-red-50">
                    <ShieldAlert className="size-4 text-red-500" />
                    <AlertTitle className="text-sm text-red-600">
                      Bạn đã bị chặn từ nhóm này
                    </AlertTitle>
                    <AlertDescription className="text-xs text-red-500">
                      Bạn không thể gửi tin nhắn hoặc tương tác với nhóm này.
                    </AlertDescription>
                  </Alert>
                )}

                {replyTo && (
                  <ReplyPreview
                    message={replyTo}
                    isReplyingToSelf={replyTo.senderId === currentUser}
                    onClear={clearReply}
                  />
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-9 rounded-full hover:bg-secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUserBlocked}
                    >
                      <Paperclip className="size-4 text-muted-foreground sm:size-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 rounded-full hover:bg-secondary sm:size-9"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUserBlocked}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4 text-muted-foreground sm:size-5"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M20.4 14.5 16 10 4 20" />
                      </svg>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 rounded-full hover:bg-secondary sm:size-9"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={isUserBlocked}
                    >
                      <Film className="size-4 text-muted-foreground sm:size-5" />
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-9 rounded-full hover:bg-secondary sm:size-9"
                        >
                          <Smile className="size-4 text-muted-foreground sm:size-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-64 p-0 sm:w-80"
                        side="top"
                        align="start"
                      >
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          width="100%"
                          height={400}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center gap-2">
                    <AutosizeTextarea
                      placeholder="Nhập tin nhắn của bạn..."
                      className="resize-none border-0 bg-secondary !text-base focus-visible:ring-primary"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxHeight={140}
                      onKeyDown={handleKeyDown}
                      disabled={isUserBlocked}
                    />
                    <Button
                      size="icon"
                      className="shrink-0 rounded-full"
                      onClick={() => sendMessage()}
                      disabled={isPendingSendMessage || isUserBlocked}
                    >
                      <Send className="size-4 sm:size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                Vui lòng chọn người bạn muốn liên hệ.
              </p>
            </div>
          )}
        </div>

        {selectedChannel && openSidebarChatInfo && (
          <SidebarChatInfo
            selectedChannel={selectedChannel}
            messages={chats[selectedChannel?.conversation_id] || []}
            setSelectedChannel={setSelectedChannel}
          />
        )}
      </div>
    </>
  )
}

export default ChatView
