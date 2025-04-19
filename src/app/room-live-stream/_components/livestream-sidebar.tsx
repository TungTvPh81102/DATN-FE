'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {
  Compass,
  Gamepad2,
  Heart,
  Home,
  Library,
  Music2,
  Settings,
  Trophy,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/useAuthStore'

// Sample recommended channels
const recommendedChannels = [
  {
    id: 1,
    name: 'ProGamer',
    game: 'Fortnite',
    avatar: '/placeholder.svg?height=40&width=40',
    isLive: true,
    viewers: 12500,
  },
  {
    id: 2,
    name: 'MusicLover',
    game: 'Just Chatting',
    avatar: '/placeholder.svg?height=40&width=40',
    isLive: true,
    viewers: 8700,
  },
  {
    id: 3,
    name: 'ArtistPro',
    game: 'Digital Art',
    avatar: '/placeholder.svg?height=40&width=40',
    isLive: false,
  },
  {
    id: 4,
    name: 'ChessGrandmaster',
    game: 'Chess',
    avatar: '/placeholder.svg?height=40&width=40',
    isLive: true,
    viewers: 5200,
  },
  {
    id: 5,
    name: 'TechTalks',
    game: 'Science & Technology',
    avatar: '/placeholder.svg?height=40&width=40',
    isLive: false,
  },
]

// Sample categories
const categories = [
  { id: 1, name: 'Games', icon: Gamepad2 },
  { id: 2, name: 'Esports', icon: Trophy },
  { id: 3, name: 'Music', icon: Music2 },
]

interface LivestreamSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function LivestreamSidebar({ open, setOpen }: LivestreamSidebarProps) {
  const { user } = useAuthStore()

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
            L
          </div>
          <span className="text-lg font-bold">LiveStream</span>
        </div>
        {/*<Button*/}
        {/*  variant="ghost"*/}
        {/*  size="icon"*/}
        {/*  className="md:hidden"*/}
        {/*  onClick={() => setOpen(false)}*/}
        {/*>*/}
        {/*  <X className="size-5" />*/}
        {/*</Button>*/}
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6">
          {/* Main navigation */}
          <div className="space-y-1">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Home className="size-5" />
              <span>Home</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-foreground transition-all"
            >
              <Compass className="size-5" />
              <span>Browse</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Heart className="size-5" />
              <span>Following</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Library className="size-5" />
              <span>Library</span>
            </Link>
          </div>

          {/* Recommended channels */}
          <div>
            <h3 className="mb-2 px-3 text-sm font-semibold">
              RECOMMENDED CHANNELS
            </h3>
            <div className="space-y-1">
              {recommendedChannels.map((channel) => (
                <Link
                  key={channel.id}
                  href="#"
                  className="flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-7">
                      <AvatarImage src={channel.avatar} alt={channel.name} />
                      <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium leading-none">
                        {channel.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {channel.game}
                      </div>
                    </div>
                  </div>
                  {channel.isLive ? (
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-red-500"></span>
                      <span className="text-xs">
                        {channel?.viewers?.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Offline
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-2 px-3 text-sm font-semibold">CATEGORIES</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <category.icon className="size-5" />
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar ?? ''} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="truncate font-medium">{user?.name}</div>
              <div className="text-xs text-muted-foreground">
                {user?.status}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8">
              <User className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <Settings className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="flex w-72 flex-col p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden h-screen w-64 flex-col border-r bg-background md:flex">
        {sidebarContent}
      </div>
    </>
  )
}
