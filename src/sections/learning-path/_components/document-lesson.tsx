import { useState } from 'react'

import { useCompleteLesson } from '@/hooks/learning-path/useLearningPath'
import { formatDate } from '@/lib/common'
import { ILesson } from '@/types'

import HtmlRenderer from '@/components/shared/html-renderer'
import { Button } from '@/components/ui/button'
import { CircleCheck, FileText } from 'lucide-react'
import Link from 'next/link'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

type Props = {
  lesson: ILesson
  isCompleted: boolean
}

const DocumentLesson = ({ lesson, isCompleted }: Props) => {
  const { mutate } = useCompleteLesson()
  const [showTimer, setShowTimer] = useState(!isCompleted)
  const totalSeconds = 10

  const filePath = lesson.lessonable?.file_path

  const fileLink = filePath?.startsWith('http')
    ? filePath
    : `${process.env.NEXT_PUBLIC_STORAGE}/${filePath}`

  const handleComplete = () => {
    if (!isCompleted) {
      mutate({
        lessonId: lesson.id,
      })
      setShowTimer(false)
    }
    return { shouldRepeat: false }
  }

  return (
    <div className="mx-16 mb-40 mt-12 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          {showTimer && (
            <CountdownCircleTimer
              isPlaying
              duration={totalSeconds}
              colors={['#22c55e', '#EA580C', '#f59e0b', '#ef4444']}
              colorsTime={[10, 7, 3, 0]}
              strokeWidth={4}
              size={50}
              onComplete={handleComplete}
            >
              {({ remainingTime }) => (
                <div className="text-xl font-bold text-primary">
                  {remainingTime}
                </div>
              )}
            </CountdownCircleTimer>
          )}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Cập nhật{' '}
          {formatDate(lesson.updated_at, {
            dateStyle: 'long',
          })}
        </p>
      </div>

      {isCompleted && (
        <div className="rounded-lg bg-green-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-green-600">
            <CircleCheck />
            <span className="font-medium">Bài học đã hoàn thành</span>
          </div>
        </div>
      )}

      <HtmlRenderer html={lesson.content} />
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">Tài nguyên cho bài giảng này</h3>
        <Button
          asChild
          variant={'ghost'}
          className="h-auto w-full justify-start py-4 text-lg hover:bg-primary/10"
        >
          <Link href={fileLink} target="_blank">
            <FileText className="!size-6" /> Xem tài liệu
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default DocumentLesson
