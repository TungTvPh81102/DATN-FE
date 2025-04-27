'use client'

import { useLiveSessionInfo } from '@/hooks/live/useLive'
import { LivestreamPlayer } from '@/app/room-live-stream/_components/livestream-player'
import { LivestreamInfo } from '@/app/room-live-stream/_components/livestream-info'
import { LivestreamChat } from '@/app/room-live-stream/_components/livestream-chat'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  stream_key: string
}

export const LivestreamDetails = ({ stream_key }: Props) => {
  const router = useRouter()
  const [joinNotification, setJoinNotification] = useState<string | null>(null)
  const { data, isLoading } = useLiveSessionInfo(stream_key)

  useEffect(() => {
    if (data?.data?.status == 'Kết thúc' || data?.data?.status == 'Đã hủy') {
      router.push('/404')
    }
  }, [data?.data?.status, router])

  return (
    <div className="flex w-full flex-1 flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          {/* Video player and info section */}
          <div className="space-y-4 lg:col-span-2">
            <LivestreamPlayer
              playbackId={data?.data.mux_playback_id}
              isLoading={isLoading}
              joinNotification={joinNotification}
            />
            <LivestreamInfo liveSession={data} />
          </div>

          {/* Chat section */}
          <div className="lg:col-span-1">
            <LivestreamChat
              setJoinNotification={setJoinNotification}
              liveSession={data}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
