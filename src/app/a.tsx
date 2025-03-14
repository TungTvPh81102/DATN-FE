'use client'

import React, { useEffect, useRef, useState } from 'react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Button } from '@/components/ui/button'
import {
  Archive,
  Info,
  Mic,
  MoreHorizontal,
  MoreVertical,
  Paperclip,
  Plus,
  Search,
  Send,
  Smile,
  Trash2,
  Volume2,
  X,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'next/navigation'

interface Message {
  id: number
  senderId: number
  text: string
  timestamp: string
  files?: {
    name: string
    url: string
    type: 'file' | 'image'
    blob?: Blob
  }[]
}

interface User {
  id: number
  name: string
  avatar: string
  online?: boolean
  messages?: number
  initials?: string
}

interface FilePreview {
  name: string
  url: string
  type: 'file' | 'image'
  blob: Blob
}

const users: User[] = [
  {
    id: 1,
    name: 'Alice Cruickshank',
    avatar: 'https://i.pravatar.cc/150?img=1',
    initials: 'AC',
    online: true,
  },
  {
    id: 2,
    name: 'Barrett Brown',
    avatar: 'https://i.pravatar.cc/150?img=2',
    initials: 'BB',
    online: false,
  },
  {
    id: 3,
    name: 'Chris Kiernan',
    avatar: 'https://i.pravatar.cc/150?img=3',
    initials: 'CK',
    online: true,
  },
  {
    id: 4,
    name: 'Clifford Taylor',
    avatar: 'https://i.pravatar.cc/150?img=4',
    initials: 'CT',
    online: true,
  },
  {
    id: 5,
    name: 'Edith Evans',
    avatar: 'https://i.pravatar.cc/150?img=5',
    initials: 'EE',
    online: false,
  },
  {
    id: 6,
    name: 'Frank Thomas',
    avatar: 'https://i.pravatar.cc/150?img=6',
    initials: 'FT',
    online: false,
  },
]

const channels = [
  { id: 1, name: 'Landing Design', messages: 7 },
  { id: 2, name: 'General' },
  { id: 3, name: 'Project Tasks', messages: 3 },
  { id: 4, name: 'Meeting' },
]

const ChatUserView = () => {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  const [message, setMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState<User>(users[3])
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats')
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [chats, setChats] = useState<Record<number, Message[]>>({
    1: [
      {
        id: 1,
        senderId: 1,
        text: "Hey! How's the new project going?",
        timestamp: '09:15 am',
      },
      {
        id: 2,
        senderId: 0,
        text: "It's going well! Just finishing up the designs",
        timestamp: '09:16 am',
      },
      {
        id: 3,
        senderId: 1,
        text: 'Great to hear! Can you share them with me?',
        timestamp: '09:17 am',
      },
    ],
    2: [
      {
        id: 1,
        senderId: 2,
        text: 'Did you see the latest updates?',
        timestamp: '10:30 am',
      },
      {
        id: 2,
        senderId: 0,
        text: "Yes, I'm reviewing them now",
        timestamp: '10:32 am',
      },
    ],
    3: [
      {
        id: 1,
        senderId: 3,
        text: 'Meeting at 2pm today?',
        timestamp: '08:45 am',
      },
      { id: 2, senderId: 0, text: "Yes, I'll be there", timestamp: '08:46 am' },
    ],
    4: [
      { id: 1, senderId: 4, text: 'Good morning 😊', timestamp: '09:07 am' },
      {
        id: 2,
        senderId: 0,
        text: 'Good morning. How are you? What about our next meeting?',
        timestamp: '09:08 am',
      },
    ],
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'file' | 'image'
  ) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newPreviews = files
      .map((file) => {
        if (type === 'image' && !file.type.startsWith('image/')) {
          alert('Please select an image file')
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

  const sendMessage = (text: string = message) => {
    if (!text.trim() && filePreviews.length === 0) return

    const now = new Date()
    const timestamp = now
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase()

    let filesData = undefined
    if (filePreviews.length > 0) {
      filesData = filePreviews.map((preview) => ({
        name: preview.name,
        url: URL.createObjectURL(preview.blob),
        type: preview.type,
        blob: preview.blob,
      }))
    }

    const newMessage: Message = {
      id: chats[selectedUser.id]?.length + 1 || 1,
      senderId: 0,
      text: text,
      timestamp,
      files: filesData,
    }

    setChats((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
    }))

    setMessage('')
    filePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview.url)
    })
    setFilePreviews([])
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const groupedUsers = users.reduce(
    (groups, user) => {
      const firstLetter = user.name.charAt(0).toUpperCase()
      if (!groups[firstLetter]) {
        groups[firstLetter] = []
      }
      groups[firstLetter].push(user)
      return groups
    },
    {} as Record<string, User[]>
  )

  const filteredMessages = chats[selectedUser.id]?.filter((msg) =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    return () => {
      Object.values(chats).forEach((messages) => {
        messages.forEach((msg) => {
          msg.files?.forEach((file) => {
            if (file.url) {
              URL.revokeObjectURL(file.url)
            }
          })
        })
      })
      filePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url)
      })
    }
  }, [chats, filePreviews])

  if (!user || !isAuthenticated) {
    router.push('/forbidden')
  }

  return (
    <div className="flex h-screen bg-white">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'file')}
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
        multiple
      />
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'image')}
        accept="image/*"
        multiple
      />

      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r">
        <div className="border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Chats</h2>
            <Button size="icon" variant="ghost">
              <Plus className="size-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search here..." className="pl-8" />
          </div>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'chats'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'contacts'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts
          </button>
        </div>

        <ScrollArea className="flex-1">
          {activeTab === 'chats' ? (
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  DIRECT MESSAGES
                </h3>
                <Button size="icon" variant="ghost" className="size-4">
                  <Plus className="size-4" />
                </Button>
              </div>

              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-secondary ${
                    user.id === selectedUser.id ? 'bg-secondary' : ''
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="relative">
                    <Avatar className="size-8">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="object-cover"
                      />
                    </Avatar>
                    {user.online && (
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium">
                    {user.name}
                  </span>
                  {user.messages && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {user.messages}
                    </span>
                  )}
                </div>
              ))}

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    CHANNELS
                  </h3>
                  <Button size="icon" variant="ghost" className="size-4">
                    <Plus className="size-4" />
                  </Button>
                </div>

                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary"
                  >
                    <span className="text-muted-foreground">#</span>
                    <span className="flex-1 text-sm font-medium">
                      {channel.name}
                    </span>
                    {channel.messages && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {channel.messages}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              {Object.entries(groupedUsers).map(([letter, users]) => (
                <div key={letter} className="mb-6">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    {letter}
                  </h3>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-secondary"
                      onClick={() => handleUserSelect(user)}
                    >
                      {/* <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                        <span className="text-sm font-medium">{user.initials}</span>
                      </Avatar> */}
                      <Avatar className="size-8">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="object-cover"
                        />
                      </Avatar>
                      <span className="flex-1 text-sm font-medium">
                        {user.name}
                      </span>
                      <Button size="icon" variant="ghost" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="object-cover"
              />
            </Avatar>
            <div>
              <h2 className="text-sm font-semibold">{selectedUser.name}</h2>
              <p className="text-xs text-muted-foreground">
                {selectedUser.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showSearch ? (
              <div className="flex items-center gap-2 rounded-md bg-secondary px-2">
                <Search className="size-4 text-muted-foreground" />
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
              >
                <Search className="size-5" />
              </Button>
            )}
            <Button size="icon" variant="ghost">
              <Info className="size-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
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
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {(searchQuery ? filteredMessages : chats[selectedUser.id])?.map(
              (msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.senderId === 0 ? 'justify-end' : ''}`}
                >
                  {msg.senderId !== 0 && (
                    <Avatar className="size-8">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="object-cover"
                      />
                    </Avatar>
                  )}
                  <div className={msg.senderId === 0 ? 'text-right' : ''}>
                    <div
                      className={`rounded-lg p-3 ${
                        msg.senderId === 0
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      {msg.files ? (
                        <div className="space-y-2">
                          {msg.files.map((file, index) => (
                            <div key={index}>
                              {file.type === 'image' ? (
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="max-w-[300px] rounded-lg"
                                />
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="size-4" />
                                    <span>{file.name}</span>
                                  </div>
                                  <a
                                    href={file.url}
                                    download={file.name}
                                    className="text-sm underline"
                                  >
                                    Download
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* File Preview */}
        {filePreviews.length > 0 && (
          <div className="border-t bg-secondary p-2">
            <ScrollArea className="h-32">
              <div className="grid grid-cols-4 gap-2 p-2">
                {filePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    {preview.type === 'image' ? (
                      <div className="group relative">
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="h-24 w-full rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-white hover:text-white/80"
                            onClick={() => removeFilePreview(index)}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="group relative flex h-24 flex-col items-center justify-center rounded-lg bg-background p-2">
                        <Paperclip className="mb-1 size-6" />
                        <span className="line-clamp-2 px-1 text-center text-xs">
                          {preview.name}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-white hover:text-white/80"
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
                    className="h-24 w-full rounded-lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="size-6" />
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Chat Input */}
        <div className="border-t bg-white p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Button
                size="icon"
                variant="ghost"
                className="size-9 rounded-full hover:bg-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="size-5 text-muted-foreground" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-9 rounded-full hover:bg-secondary"
                onClick={() => imageInputRef.current?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 text-muted-foreground"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M20.4 14.5 16 10 4 20" />
                </svg>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-9 rounded-full hover:bg-secondary"
                  >
                    <Smile className="size-5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" side="top" align="start">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width="100%"
                    height={400}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Type your message..."
                  className="border-0 bg-secondary py-6 pr-24 text-base focus-visible:ring-1 focus-visible:ring-primary"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                  onClick={() => sendMessage()}
                >
                  <Send className="size-5" />
                </Button>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="size-[52px] rounded-full hover:bg-secondary"
              >
                <Mic className="size-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatUserView
