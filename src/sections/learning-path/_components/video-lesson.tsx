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
import {
  formatDate,
  formatDuration,
  generateRandomCode,
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@/lib/common'
import { ILesson } from '@/types'
import MuxPlayerElement from '@mux/mux-player'
import MuxPlayer from '@mux/mux-player-react'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
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
  const [videoState, setVideoState] = useState({
    currentTime: lastTimeVideo,
    watchedTime: lastTimeVideo,
  })

  const [openWarningSeeking, setOpenWarningSeeking] = useState(false)
  const [openAddNote, setOpenAddNote] = useState(false)
  const [openWarningMultiTab, setOpenWarningMultiTab] = useState(false)
  const currentTabId = useRef<string>(generateRandomCode(10))

  const { mutate: completeLesson } = useCompleteLesson()
  const { mutate: updateLastTime, isPending: isLastTimeUpdating } =
    useUpdateLastTime()

  useEffect(() => {
    if (!lesson.id) return

    const storageKey = `active-tab-lesson-${lesson.id}`

    const tabInfo = {
      tabId: currentTabId.current,
      timeStamp: new Date().getTime(),
    }

    const savedTabInfoStr = getLocalStorage(storageKey)

    if (savedTabInfoStr) {
      try {
        const savedTabInfo = JSON.parse(savedTabInfoStr as string)

        if (
          savedTabInfo.tabId !== currentTabId.current &&
          new Date().getTime() - savedTabInfo.timestamp < 5 * 60 * 1000
        ) {
          setOpenWarningMultiTab(true)
          if (muxPlayerRef.current && !muxPlayerRef.current.paused) {
            muxPlayerRef.current.pause()
          }
        } else {
          setLocalStorage(storageKey, JSON.stringify(tabInfo))
        }
      } catch (e: any) {
        console.log(e)
        setLocalStorage(storageKey, JSON.stringify(tabInfo))
      }
    } else {
      setLocalStorage(storageKey, JSON.stringify(tabInfo))
    }

    const intervalId = setInterval(() => {
      checkMultipleTabs()
    }, 5000)

    return () => {
      clearInterval(intervalId)
      if (getLocalStorage(storageKey)) {
        const savedInfo = JSON.parse(getLocalStorage(storageKey) || '{}')
        if (savedInfo.tabId === currentTabId.current) {
          removeLocalStorage(storageKey)
        }
      }
    }
  }, [lesson.id])

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden =
        document.hidden ||
        (document as any).webkitHidden ||
        (document as any).msHidden ||
        (document as any).mozHidden

      if (isHidden) {
        if (muxPlayerRef.current && !muxPlayerRef.current.paused) {
          // muxPlayerRef.current.pause()
          updateLastTime({
            lesson_id: lesson.id!,
            last_time_video: videoState.currentTime,
          })
        }
      } else if (document.visibilityState === 'visible') {
        if (muxPlayerRef.current && muxPlayerRef.current.paused) {
          muxPlayerRef.current.play()
        }
      }
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

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      visibilityEvents.forEach((event) => {
        document.removeEventListener(event, handleVisibilityChange)
      })
    }
  }, [videoState.currentTime, lesson.id, updateLastTime])

  const checkMultipleTabs = () => {
    if (!lesson.id) return

    const storageKey = `active-tab-lesson-${lesson.id}`

    const savedTabInfoStr = getLocalStorage(storageKey)

    if (savedTabInfoStr) {
      try {
        const savedTabInfo = JSON.parse(savedTabInfoStr as string)

        if (
          savedTabInfo.tabId !== currentTabId.current &&
          new Date().getTime() - savedTabInfo.timestamp < 5 * 60 * 1000
        ) {
          if (muxPlayerRef.current && !muxPlayerRef.current.paused) {
            muxPlayerRef.current.pause()
            setOpenWarningMultiTab(true)
          }
        } else {
          const tabInfo = {
            tabId: currentTabId.current,
            timestamp: new Date().getTime(),
          }
          localStorage.setItem(storageKey, JSON.stringify(tabInfo))
          setLocalStorage(storageKey, JSON.stringify(tabInfo))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleTimeUpdate = (e: Event) => {
    const { currentTime, duration } = e.target as MuxPlayerElement
    const roundedCurrentTime = Math.round(currentTime)

    if (!isCompleted && currentTime > videoState.watchedTime + 30) {
      muxPlayerRef.current?.pause()
      if (muxPlayerRef.current) {
        muxPlayerRef.current.currentTime = videoState.currentTime
      }
      setOpenWarningSeeking(true)
      return
    }

    setVideoState((prev) => ({
      currentTime: roundedCurrentTime,
      watchedTime: Math.max(roundedCurrentTime, prev.watchedTime),
    }))

    if (
      !isCompleted &&
      roundedCurrentTime > (2 / 3) * duration &&
      !isCalled.current
    ) {
      isCalled.current = true
      completeLesson(
        {
          lessonId: lesson.id,
          payload: { current_time: roundedCurrentTime },
        },
        {
          onError: () => {
            isCalled.current = false
          },
        }
      )
    }

    if (
      roundedCurrentTime !== 0 &&
      roundedCurrentTime % 30 === 0 &&
      !isLastTimeUpdating
    ) {
      updateLastTime({
        lesson_id: lesson.id!,
        last_time_video: roundedCurrentTime,
      })
    }
  }

  const handlePause = () => {
    updateLastTime({
      lesson_id: lesson.id!,
      last_time_video: videoState.currentTime,
    })
  }

  useEffect(() => {
    if (muxPlayerRef.current && time) {
      muxPlayerRef.current.currentTime = +time
    }
  }, [time])

  const handleContinueInCurrentTab = () => {
    setOpenWarningMultiTab(false)

    const storageKey = `active-tab-lesson-${lesson.id}`
    const tabInfo = {
      tabId: currentTabId.current,
      timestamp: new Date().getTime(),
    }
    setLocalStorage(storageKey, JSON.stringify(tabInfo))

    if (muxPlayerRef.current) {
      muxPlayerRef.current.play()
    }
  }

  return (
    <>
      <div className="aspect-[21/9] bg-black/95">
        <div className="mx-auto aspect-video h-full">
          <MuxPlayer
            hotkeys="noarrowright"
            ref={muxPlayerRef}
            playbackId={lesson.lessonable?.mux_playback_id}
            accentColor={'hsl(var(--primary))'}
            className="h-full"
            startTime={time ? +time : lastTimeVideo}
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePause}
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
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Cảnh báo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn đang học nhanh hơn bình thường, vui lòng không tua quá nhiều
              khi học!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => muxPlayerRef.current?.play()}>
              Đã hiểu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={openWarningMultiTab}
        onOpenChange={setOpenWarningMultiTab}
      >
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Phát hiện nhiều tab</AlertDialogTitle>
            <AlertDialogDescription>
              Chúng tôi phát hiện bạn đang mở nhiều tab cùng một bài học. Để đảm
              bảo chất lượng học tập, vui lòng chỉ xem bài học này trong một tab
              duy nhất.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleContinueInCurrentTab}>
              Tiếp tục ở tab này
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default VideoLesson
