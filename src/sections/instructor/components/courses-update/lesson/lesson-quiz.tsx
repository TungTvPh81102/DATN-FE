'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  useCreateLessonQuiz,
  useUpdateQuizContent,
} from '@/hooks/instructor/lesson/useLesson'
import { useGetQuiz } from '@/hooks/instructor/quiz/useQuiz'
import { LessonQuizPayload, lessonQuizSchema } from '@/validations/lesson'

import QuillEditor from '@/components/shared/quill-editor'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import ListQuestion from './quiz/list-question'

type Props = {
  chapterId?: string
  onHide: () => void
  isEdit?: boolean
  quizId?: string
}

const LessonQuiz = ({ chapterId, onHide, isEdit, quizId }: Props) => {
  const { isDraftOrRejected } = useCourseStatusStore()

  const { data: questionData, isLoading: isQuestionLoading } = useGetQuiz(
    quizId as string
  )

  const { mutate: createLessonQuiz, isPending: isLessonQuizCreatePending } =
    useCreateLessonQuiz()
  const { mutate: updateQuizContent, isPending: isUpdating } =
    useUpdateQuizContent()

  const form = useForm<LessonQuizPayload>({
    resolver: zodResolver(lessonQuizSchema),
    defaultValues: {
      title: '',
      content: '',
    },
    values: questionData,
    disabled: !isDraftOrRejected || isLessonQuizCreatePending || isUpdating,
  })

  useEffect(() => {
    if (isEdit && questionData) {
      form.reset({
        title: questionData.title || '',
        content: questionData.content || '',
      })
    }
  }, [isEdit, questionData, form])

  const onSubmit = (data: LessonQuizPayload) => {
    const onSuccess = () => {
      form.reset()
      onHide()
    }

    if (isEdit)
      updateQuizContent({
        quizId: quizId as string,
        payload: data,
      })
    else
      createLessonQuiz(
        {
          chapterId: chapterId as string,
          payload: data,
        },
        {
          onSuccess,
        }
      )
  }

  if (isQuestionLoading) {
    return <Loader2 className="mx-auto animate-spin text-muted-foreground" />
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="font-semibold">
            {isDraftOrRejected ? (isEdit ? 'Cập nhật' : 'Thêm') : 'Thông tin'}{' '}
            bài ôn tập trắc nghiệm
          </h2>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề bài giảng</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề bài giảng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung bài giảng</FormLabel>
                <FormControl>
                  <QuillEditor {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isDraftOrRejected && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLessonQuizCreatePending || isUpdating}
              >
                {(isLessonQuizCreatePending || isUpdating) && (
                  <Loader2 className="animate-spin" />
                )}
                {isEdit ? 'Cập nhật' : 'Thêm bài học'}
              </Button>
            </div>
          )}
        </form>
      </Form>

      {quizId && (
        <ListQuestion quizId={quizId} questions={questionData?.questions} />
      )}
    </>
  )
}

export default LessonQuiz
