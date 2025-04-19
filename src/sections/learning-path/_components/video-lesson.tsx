'use client'

import MuxPlayerElement from '@mux/mux-player'
import MuxPlayer from '@mux/mux-player-react'
import { AlertTriangle, Plus, Rewind } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import HtmlRenderer from '@/components/shared/html-renderer'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  useCompleteLesson,
  useUpdateLastTime,
} from '@/hooks/learning-path/useLearningPath'
import { formatDate, formatDuration } from '@/lib/common'
import { ILesson } from '@/types'
import AddNoteSheet from './add-note-sheet'
import { useCurrentTimeStore } from '@/stores/use-current-time-store'

type Props = {
  lesson: ILesson
  isCompleted: boolean
  lastTimeVideo?: number
}

const VideoLesson = ({ lesson, isCompleted, lastTimeVideo = 0 }: Props) => {
  const searchParams = useSearchParams()
  const time = searchParams.get('time')

  const muxPlayerRef = useRef<MuxPlayerElement>(null)
  const isCalled = useRef<boolean>(false)

  const [videoState, setVideoState] = useState({
    currentTime: lastTimeVideo,
    watchedTime: lastTimeVideo,
  })

  const setCurrentTime = useCurrentTimeStore((state) => state.setCurrentTime)

  const [openWarningSeeking, setOpenWarningSeeking] = useState(false)
  const [openAddNote, setOpenAddNote] = useState(false)

  const { mutate: completeLesson } = useCompleteLesson()
  const { mutate: updateLastTime } = useUpdateLastTime()

  const handleSeekingProtection = useCallback(() => {
    const currentTime = muxPlayerRef.current?.currentTime
      ? Math.round(muxPlayerRef.current.currentTime)
      : 0

    if (currentTime > videoState.watchedTime + 10) {
      muxPlayerRef.current?.pause()
      if (muxPlayerRef.current) {
        muxPlayerRef.current.currentTime = videoState.currentTime
      }
      setOpenWarningSeeking(true)
      return true
    }

    return false
  }, [videoState.currentTime, videoState.watchedTime])

  const handleTimeUpdate = useCallback(() => {
    if (!muxPlayerRef.current) return

    const { currentTime } = muxPlayerRef.current
    const roundedCurrentTime = Math.round(currentTime)

    if (!isCompleted && handleSeekingProtection()) return

    setVideoState((prev) => ({
      currentTime: roundedCurrentTime,
      watchedTime: Math.max(roundedCurrentTime, prev.watchedTime),
    }))
    setCurrentTime(roundedCurrentTime)
  }, [handleSeekingProtection, isCompleted, setCurrentTime])

  useEffect(() => {
    if (muxPlayerRef.current && time) {
      muxPlayerRef.current.startTime = +time
    }
  }, [time])

  // Autosave
  useEffect(() => {
    if (videoState.currentTime > 0 && videoState.currentTime % 30 === 0) {
      updateLastTime({
        lesson_id: lesson.id,
        last_time_video: videoState.currentTime,
      })
    }
  }, [lesson.id, updateLastTime, videoState.currentTime])

  // Complete lesson
  useEffect(() => {
    if (
      !isCompleted &&
      lesson?.lessonable?.duration &&
      videoState.watchedTime > (2 / 3) * lesson.lessonable.duration &&
      !isCalled.current
    ) {
      isCalled.current = true
      completeLesson(
        {
          lessonId: lesson.id,
          payload: { current_time: videoState.watchedTime },
        },
        {
          onError: () => {
            isCalled.current = false
          },
        }
      )
    }
  }, [
    completeLesson,
    isCompleted,
    lesson.id,
    lesson.lessonable?.duration,
    videoState.watchedTime,
  ])

  // Save progress when leaving the page
  useEffect(() => {
    const saveProgress = () => {
      if (!muxPlayerRef.current) return

      const body = {
        lesson_id: lesson.id,
        last_time_video: Math.round(muxPlayerRef.current.currentTime),
      }

      navigator.sendBeacon('/api/save-video-progress', JSON.stringify(body))
    }

    window.addEventListener('pagehide', saveProgress)

    return () => {
      window.removeEventListener('pagehide', saveProgress)
    }
  }, [lesson.id])

  useEffect(() => {
    let isPlaying = false

    const handleVisibilityChange = () => {
      if (!muxPlayerRef.current) return

      if (document.hidden) {
        isPlaying = !muxPlayerRef.current.paused
        muxPlayerRef.current.pause()
      } else if (isPlaying) {
        muxPlayerRef.current.play()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <>
      <div className="aspect-[21/9] bg-black/95">
        <div className="mx-auto aspect-video h-full">
          <MuxPlayer
            ref={muxPlayerRef}
            playbackId={lesson.lessonable?.mux_playback_id}
            accentColor={'hsl(var(--primary))'}
            className="h-full"
            startTime={time ? +time : lastTimeVideo}
            onTimeUpdate={handleTimeUpdate}
            style={
              {
                '--seek-forward-button': isCompleted ? 'flex' : 'none',
                '--playback-rate-button': isCompleted ? 'flex' : 'none',
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      <div className="mx-16 mb-40 mt-8">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <p className="text-sm text-muted-foreground">
              Cập nhật{' '}
              {formatDate(lesson.updated_at, {
                dateStyle: 'long',
              })}
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              setOpenAddNote(true)
            }}
          >
            <Plus />
            Thêm ghi chú tại{' '}
            <span className="font-semibold">
              {formatDuration(videoState.currentTime, 'colon')}
            </span>
          </Button>
        </div>
        <HtmlRenderer html={lesson.content} className="mt-8" />
      </div>

      <AddNoteSheet
        open={openAddNote}
        onOpenChange={setOpenAddNote}
        lessonId={lesson.id!}
        currentTime={videoState.currentTime}
      />

      <AlertDialog
        open={openWarningSeeking}
        onOpenChange={setOpenWarningSeeking}
      >
        <AlertDialogContent className="max-w-md rounded-xl border-orange-400 bg-white shadow-lg dark:bg-slate-900">
          <div className="absolute -top-12 left-1/2 flex size-24 -translate-x-1/2 items-center justify-center rounded-full bg-orange-100 text-orange-500 shadow-lg dark:bg-orange-900/30">
            <AlertTriangle className="size-12" />
          </div>
          <AlertDialogHeader className="pt-12 text-center">
            <AlertDialogTitle className="text-2xl font-bold text-orange-500">
              Bạn đang tua quá nhanh
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-base">
              <p>Việc tua nhanh có thể khiến bạn bỏ lỡ nội dung quan trọng.</p>
              <p className="mt-2 text-muted-foreground">
                Hệ thống phát hiện bạn đang học nhanh hơn bình ui lòng không tua
                quá nhiều khi học!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 flex items-center justify-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-200 to-transparent dark:via-orange-800/30"></div>
          </div>
          <AlertDialogFooter className="flex flex-col sm:flex-row">
            <AlertDialogAction
              className="mt-2 flex w-full items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => muxPlayerRef.current?.play()}
            >
              <Rewind className="size-4" />
              Quay lại và tiếp tục học
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default VideoLesson
