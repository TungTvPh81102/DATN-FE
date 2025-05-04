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
import { useLeaveStream, useSendHeartbeat } from '@/hooks/live/useLive'

interface LivestreamPlayerProps {
  liveSession?: any
}

export function LivestreamPlayer({ liveSession }: LivestreamPlayerProps) {
  const router = useRouter()
  const [streamStatus, setStreamStatus] = useState('upcoming')
  const [streamUrl, setStreamUrl] = useState('')
  const [playbackId, setPlaybackId] = useState('')
  const [showEndedAlert, setShowEndedAlert] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)

  const { mutate: sendHeartbeat } = useSendHeartbeat(liveSession?.id)
  const { mutate: leaveStream } = useLeaveStream(liveSession?.id)

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

    channel.listen('.viewer-count-updated', (event: any) => {
      setViewerCount(event.viewer_count)
    })

    return () => {
      channel.stopListening('.status-changed')
      channel.stopListening('.viewer-count-updated')
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

  useEffect(() => {
    let heartbeatInterval: string | number | NodeJS.Timeout | undefined

    if (streamStatus === 'live' && liveSession?.id) {
      sendHeartbeat()

      heartbeatInterval = setInterval(() => {
        sendHeartbeat()
      }, 20000)

      const handleBeforeUnload = () => {
        leaveStream()
      }
      window.addEventListener('beforeunload', handleBeforeUnload)

      return () => {
        clearInterval(heartbeatInterval)
        window.removeEventListener('beforeunload', handleBeforeUnload)
        leaveStream()
      }
    }

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval)
    }
  }, [liveSession?.id, streamStatus, sendHeartbeat, leaveStream])

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      <StreamContent
        streamStatus={streamStatus}
        streamTitle={liveSession?.title || 'Buổi học trực tuyến'}
        startTime={liveSession?.starts_at}
        playbackId={playbackId || ''}
        streamUrl={streamUrl}
        viewerCount={viewerCount}
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
