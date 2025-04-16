'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { LivestreamSidebar } from '@/app/room-live-stream/_components/livestream-sidebar'
import { LivestreamPlayer } from '@/app/room-live-stream/_components/livestream-player'
import { LivestreamInfo } from '@/app/room-live-stream/_components/livestream-info'
import { LivestreamChat } from '@/app/room-live-stream/_components/livestream-chat'
import { useLiveSessionInfo } from '@/hooks/live/useLive'
import { useRouter } from 'next/navigation'

interface LivestreamLayoutProps {
  stream_key: string
}

export function LivestreamLayout({ stream_key }: LivestreamLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [joinNotification, setJoinNotification] = useState<string | null>(null)
  const { data: liveSession, isLoading: isLoadingLive } =
    useLiveSessionInfo(stream_key)
  useEffect(() => {
    if (
      liveSession?.data?.status == 'Kết thúc' ||
      liveSession?.data?.status == 'Đã hủy'
    ) {
      router.push('/404')
    }
  }, [liveSession?.data?.status, router])
  return (
    <div className="flex min-h-screen bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="size-5" />
      </Button>

      {/* Sidebar */}
      <LivestreamSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex w-full flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
            {/* Video player and info section */}
            <div className="space-y-4 lg:col-span-2">
              <LivestreamPlayer
                playbackId={liveSession?.data.mux_playback_id}
                isLoading={isLoadingLive}
                joinNotification={joinNotification}
              />
              <LivestreamInfo liveSession={liveSession} />
            </div>

            {/* Chat section */}
            <div className="lg:col-span-1">
              <LivestreamChat
                setJoinNotification={setJoinNotification}
                liveSession={liveSession}
                isLoading={isLoadingLive}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
