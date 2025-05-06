import React from 'react'
import { XCircle as CircleX } from 'lucide-react'
import MuxPlayer from '@mux/mux-player-react'

interface Video {
  id: number
  title: string
  type: 'upload'
  url: string
  asset_id: string
  mux_playback_id: string
  duration: number
  created_at: string
  updated_at: string
}

interface Lesson {
  id: number
  chapter_id: number
  title: string
  slug: string
  content: string
  is_free_preview: number
  order: number
  type: 'video'
  lessonable_type: string
  lessonable_id: number
  created_at: string
  updated_at: string
  lessonable: Video | null
}

interface LessonPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  lesson: Lesson | null
}

const lessonTypeLabels = {
  video: 'Video bài giảng',
}

export function LessonPreviewModal({
  isOpen,
  onClose,
  lesson,
}: LessonPreviewModalProps) {
  if (!lesson || !isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {lesson.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {lessonTypeLabels[lesson.type]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500"
          >
            <CircleX size={24} />
          </button>
        </div>

        <div className="mt-6">
          {lesson.type === 'video' && lesson.lessonable && (
            <div className="overflow-hidden rounded-lg bg-black">
              <div className="aspect-video">
                {(lesson.lessonable as Video).mux_playback_id ? (
                  <MuxPlayer
                    playbackId={(lesson.lessonable as Video).mux_playback_id}
                    accentColor={'hsl(var(--primary))'}
                    className="size-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white">
                    Video không khả dụng
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
