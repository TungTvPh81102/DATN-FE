import { useEffect } from 'react'

import { useCompleteLesson } from '@/hooks/learning-path/useLearningPath'
import { formatDate } from '@/lib/common'
import { ILesson } from '@/types'

import HtmlRenderer from '@/components/shared/html-renderer'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import Link from 'next/link'

type Props = {
  lesson: ILesson
  isCompleted: boolean
}

const DocumentLesson = ({ lesson, isCompleted }: Props) => {
  const { mutate } = useCompleteLesson()

  const filePath = lesson.lessonable?.file_path

  const fileLink = filePath?.startsWith('http')
    ? filePath
    : `${process.env.NEXT_PUBLIC_STORAGE}/${filePath}`

  console.log('lessonable', lesson.lessonable)

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
    <div className="mx-16 mb-40 mt-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p className="text-sm text-muted-foreground">
          Cập nhật{' '}
          {formatDate(lesson.updated_at, {
            dateStyle: 'long',
          })}
        </p>
      </div>
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
