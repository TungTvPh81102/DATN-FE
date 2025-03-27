import { useEffect } from 'react'

import { ILesson } from '@/types'
import { formatDate } from '@/lib/common'
import { useCompleteLesson } from '@/hooks/learning-path/useLearningPath'

import HtmlRenderer from '@/components/shared/html-renderer'

type Props = {
  lesson: ILesson
  isCompleted: boolean
}

const DocumentLesson = ({ lesson, isCompleted }: Props) => {
  const { mutate } = useCompleteLesson()

  useEffect(() => {
    if (isCompleted) return

    const timer = setTimeout(() => {
      mutate({
        lessonId: lesson.id,
      })
    }, 10000)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-16 mb-40 mt-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p className="text-sm text-muted-foreground">
          Cập nhật{' '}
          {formatDate(lesson.updated_at, {
            dateStyle: 'long',
          })}
        </p>
      </div>

      <HtmlRenderer html={lesson.content} className="mt-8" />
    </div>
  )
}

export default DocumentLesson
