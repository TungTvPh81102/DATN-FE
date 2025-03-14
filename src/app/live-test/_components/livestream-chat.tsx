'use client'

import { useState, useEffect } from 'react'
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
import {
  AtSign,
  Gift,
  MessageSquare,
  MoreVertical,
  Send,
  Settings,
  SmilePlus,
  Users,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { Theme } from 'emoji-picker-react'

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-4">
      <p>Loading emoji picker...</p>
    </div>
  ),
})

// Sample chat messages
const chatMessages = [
  {
    id: 1,
    user: {
      name: 'Alex',
      avatar: '/placeholder.svg?height=40&width=40',
      color: 'text-blue-500',
      supporter: true,
    },
    message: 'That last play was incredible! 🔥',
    time: '2m ago',
  },
  {
    id: 2,
    user: {
      name: 'Sarah',
      avatar: '/placeholder.svg?height=40&width=40',
      color: 'text-pink-500',
    },
    message: 'Who do you think will win the finals?',
    time: '1m ago',
  },
  {
    id: 3,
    user: {
      name: 'GameMaster',
      avatar: '/placeholder.svg?height=40&width=40',
      color: 'text-primary',
      moderator: true,
    },
    message:
      'Welcome everyone to the championship! Remember to follow the chat rules.',
    time: '1m ago',
  },
  {
    id: 4,
    user: {
      name: 'Mike',
      avatar: '/placeholder.svg?height=40&width=40',
      color: 'text-purple-500',
    },
    message: "I'm rooting for Team Alpha!",
    time: 'Just now',
  },
  {
    id: 5,
    user: {
      name: 'Jessica',
      avatar: '/placeholder.svg?height=40&width=40',
      color: 'text-green-500',
      supporter: true,
    },
    message: 'The commentary is on point today',
    time: 'Just now',
  },
]

export function LivestreamChat() {
  const [message, setMessage] = useState('')
  const [theme, setTheme] = useState('light')

  // Detect theme for emoji picker
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setTheme(isDarkMode ? 'dark' : 'light')

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark')
          setTheme(isDarkMode ? 'dark' : 'light')
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Handle emoji selection
  const onEmojiClick = (emojiObject: any) => {
    setMessage((prev) => prev + emojiObject.emoji)
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Chat</CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8">
              <Users className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <Settings className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <Tabs defaultValue="chat">
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
        <TabsContent value="chat" className="flex flex-1 flex-col">
          <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
            {chatMessages.map((chat) => (
              <div key={chat.id} className="flex items-start gap-2">
                <Avatar className="size-8">
                  <AvatarImage src={chat.user.avatar} alt={chat.user.name} />
                  <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className={`font-medium ${chat.user.color}`}>
                      {chat.user.name}
                    </span>
                    {chat.user.moderator && (
                      <span className="rounded bg-primary px-1 text-[10px] text-primary-foreground">
                        MOD
                      </span>
                    )}
                    {chat.user.supporter && (
                      <span className="rounded bg-amber-500 px-1 text-[10px] text-white">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{chat.message}</p>
                  <span className="text-xs text-muted-foreground">
                    {chat.time}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="p-4 pt-2">
            <div className="flex w-full items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <SmilePlus className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start" side="top">
                  <div className="emoji-picker-container">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      theme={theme as Theme}
                      searchDisabled={false}
                      skinTonesDisabled={false}
                      width="100%"
                      height="350px"
                      previewConfig={{
                        showPreview: true,
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <div className="relative flex-1">
                <Input
                  placeholder="Send a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pr-16"
                />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-7">
                    <AtSign className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7">
                    <Gift className="size-4" />
                  </Button>
                </div>
              </div>
              <Button
                size="icon"
                className="shrink-0"
                disabled={!message.trim()}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </CardFooter>
        </TabsContent>
        <TabsContent value="participants" className="flex flex-1 flex-col">
          <CardContent className="flex-1 overflow-y-auto p-4">
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
