'use client'

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
import MuxPlayerElement from '@mux/mux-player'
import MuxPlayer from '@mux/mux-player-react'
import { AlertTriangle, Plus, Rewind } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AddNoteSheet from './add-note-sheet'

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
  const lastCallRef = useRef<number>(Date.now())

  const [videoState, setVideoState] = useState({
    currentTime: lastTimeVideo,
    watchedTime: lastTimeVideo,
  })

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

  const handleCompleteLesson = useCallback(
    (currentTime: number) => {
      if (lesson?.lessonable?.duration)
        if (
          currentTime > (2 / 3) * lesson.lessonable.duration &&
          !isCalled.current
        ) {
          isCalled.current = true
          completeLesson(
            {
              lessonId: lesson.id,
              payload: { current_time: currentTime },
            },
            {
              onError: () => {
                isCalled.current = false
              },
            }
          )
        }
    },
    [completeLesson, lesson.id, lesson.lessonable?.duration]
  )

  const handleAutoSave = useCallback(() => {
    const now = Date.now()

    const currentTime = muxPlayerRef.current?.currentTime
      ? Math.floor(muxPlayerRef.current.currentTime)
      : 0

    if (now - lastCallRef.current > 30000) {
      lastCallRef.current = now
      updateLastTime({
        lesson_id: lesson.id,
        last_time_video: currentTime,
      })
    }
  }, [lesson.id, updateLastTime])

  const handleTimeUpdate = useCallback(() => {
    if (!muxPlayerRef.current) return

    const { currentTime } = muxPlayerRef.current
    const roundedCurrentTime = Math.round(currentTime)

    if (!isCompleted && handleSeekingProtection()) return

    setVideoState((prev) => ({
      currentTime: roundedCurrentTime,
      watchedTime: Math.max(roundedCurrentTime, prev.watchedTime),
    }))

    if (!isCompleted) handleCompleteLesson(roundedCurrentTime)

    handleAutoSave()
  }, [
    handleAutoSave,
    handleCompleteLesson,
    handleSeekingProtection,
    isCompleted,
  ])

  useEffect(() => {
    if (muxPlayerRef.current && time) {
      muxPlayerRef.current.currentTime = +time
    }
  }, [time])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!muxPlayerRef.current) return

      const isHidden =
        document.hidden ||
        (document as any).webkitHidden ||
        (document as any).msHidden ||
        (document as any).mozHidden

      if (isHidden) {
        updateLastTime({
          lesson_id: lesson.id,
          last_time_video: Math.floor(muxPlayerRef.current.currentTime),
        })
        muxPlayerRef.current.pause()
      } else if (muxPlayerRef.current?.paused) muxPlayerRef.current.play()
    }

    const visibilityEvents = [
      'visibilitychange',
      'webkitvisibilitychange',
      'msvisibilitychange',
      'mozvisibilitychange',
    ]

    visibilityEvents.forEach((event) => {
      document.addEventListener(event, handleVisibilityChange)
    })

    return () => {
      visibilityEvents.forEach((event) => {
        document.removeEventListener(event, handleVisibilityChange)
      })
    }
  }, [lesson.id, updateLastTime])

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
              muxPlayerRef.current?.pause()
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
        onOpenChange={(open) => {
          setOpenAddNote(open)

          if (open) {
            muxPlayerRef.current?.pause()
          }
        }}
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
