'use client'

import React, { useEffect, useState } from 'react'

import StreamContent from '@/app/live-streaming/components/stream-content'
import echo from '@/lib/echo'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface LivestreamPlayerProps {
  liveSession?: any
}

export function LivestreamPlayer({ liveSession }: LivestreamPlayerProps) {
  const router = useRouter()
  const [streamStatus, setStreamStatus] = useState('upcoming')
  const [streamUrl, setStreamUrl] = useState('')
  const [playbackId, setPlaybackId] = useState('')
  const [showEndedAlert, setShowEndedAlert] = useState(false)

  useEffect(() => {
    const channel = echo.channel(`live-session.${liveSession?.id}`)

    channel.listen('.status-changed', (event: any) => {
      if (event.data.session.status === 'live') {
        setStreamStatus('connecting')
        setTimeout(() => {
          if (event.data && event.data.playback_id) {
            setStreamUrl(event.data.playback_id)
            setStreamStatus('live')
          }
        }, 10000)
      } else if (event.data.session.status === 'ended') {
        setStreamStatus('completed')
        setShowEndedAlert(true)
        if (event.data && event.data.playback_id) {
          setPlaybackId(event.data.playback_id)
        }
      }
    })

    return () => {
      channel.stopListening('.status-changed')
    }
  }, [liveSession?.id])

  useEffect(() => {
    if (liveSession) {
      if (liveSession.status === 'live') {
        setStreamStatus('live')
        setStreamUrl(liveSession.live_stream_credential.mux_playback_id)
      } else if (liveSession.status === 'ended') {
        setStreamStatus('completed')
        setShowEndedAlert(true)
      } else {
        setStreamStatus('upcoming')
      }
    }
  }, [liveSession])

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      <StreamContent
        streamStatus={streamStatus}
        streamTitle={liveSession?.title || 'Buổi học trực tuyến'}
        startTime={liveSession?.starts_at}
        playbackId={playbackId || ''}
        streamUrl={streamUrl}
      />

      <AlertDialog open={showEndedAlert} onOpenChange={setShowEndedAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle> Phiên học đã kết thúc</AlertDialogTitle>
            <AlertDialogDescription>
              Phiên học trực tuyến này đã kết thúc. Bạn có thể xem lại bản ghi
              nếu có sẵn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-md bg-[#E27447] px-4 py-2 text-white shadow-md"
            >
              <ArrowLeft className="size-4" />
              Quay lại
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
