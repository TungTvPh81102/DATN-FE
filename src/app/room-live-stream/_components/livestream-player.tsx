'use client'

import React from 'react'

import MuxPlayer from '@mux/mux-player-react'
import ModalLoading from '@/components/common/ModalLoading'

interface LivestreamPlayerProps {
  playbackId: string
  isLoading?: boolean
  joinNotification: string | null
}

export function LivestreamPlayer({
  playbackId,
  isLoading,
  joinNotification,
}: LivestreamPlayerProps) {
  if (isLoading) return <ModalLoading />
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      {/* Video player */}
      <MuxPlayer
        // streamType="live"
        playbackId={playbackId}
        // metadata={{ viewer_user_id: user?.id || 'anonymous' }}
        className="size-full"
        accentColor="hsl(var(--primary))"
      />
      {joinNotification && (
        <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-md bg-white px-4 py-2 text-gray-800 shadow-lg">
          {joinNotification}
        </div>
      )}
    </div>
  )
}
