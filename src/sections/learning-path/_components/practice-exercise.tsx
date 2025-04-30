import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

import HtmlRenderer from '@/components/shared/html-renderer'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCompletePracticeExercise } from '@/hooks/learning-path/useLearningPath'
import { formatDate } from '@/lib/common'
import { cn } from '@/lib/utils'
import { AnswerType, ILesson } from '@/types'
import {
  PracticeExerciseSubmissionPayload,
  practiceExerciseSubmissionSchema,
} from '@/validations/quiz-submission'
import { PracticeExerciseResultsAlert } from './practice-exercise-results-alert'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Props = {
  lesson: ILesson
  isCompleted: boolean
  courseSlug?: string
  nextLessonId?: number
}

export const PracticeExercise = ({
  lesson,
  isCompleted,
  courseSlug,
  nextLessonId,
}: Props) => {
  const router = useRouter()
  const { lessonable: quizData } = lesson
  const { questions = [] } = quizData!
  const [result, setResult] = useState<{
    correct_answer: number
    total_question: number
  }>()

  const form = useForm<PracticeExerciseSubmissionPayload>({
    resolver: zodResolver(practiceExerciseSubmissionSchema),
    defaultValues: {
      quiz_id: lesson.lessonable_id,
      answers: questions.map((question) => ({
        question_id: question.id,
        answer_id: [],
      })),
    },
  })

  useEffect(() => {
    if (quizData?.user_submitted_answers) {
      form.reset({
        quiz_id: lesson.lessonable_id,
        answers: quizData.user_submitted_answers,
      })
    }
  }, [quizData, isCompleted, form, lesson.lessonable_id])

  const { mutate: completeLesson, isPending } = useCompletePracticeExercise()

  const onSubmit = (payload: PracticeExerciseSubmissionPayload) => {
    completeLesson(
      {
        lessonId: lesson.id,
        payload,
      },
      {
        onSuccess: (res) => {
          setResult(res.data)
          form.reset()
        },
      }
    )
  }

  if (!quizData || !questions.length) return <p>Không có câu hỏi nào.</p>

  return (
    <>
      <div className="mx-16 mb-40 mt-8 space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">
            Cập nhật{' '}
            {formatDate(lesson.updated_at, {
              dateStyle: 'long',
            })}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {quizData.questions?.map((question, questionIndex) => (
              <div key={question.id!}>
                <h3 className="text-lg font-semibold">
                  <span className="text-lg font-medium">
                    Câu hỏi {questionIndex + 1}:{' '}
                  </span>
                  {question.question}
                  {question.answer_type === AnswerType.MULTIPLE_CHOICE && (
                    <span className="text-sm text-muted-foreground">
                      (Chọn nhiều đáp án)
                    </span>
                  )}
                </h3>

                {question.image && (
                  <div className="relative mt-4 h-80">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STORAGE}/${question.image}`}
                      alt={`Hình ảnh cho câu hỏi ${questionIndex + 1}`}
                      className="rounded-md object-contain"
                      fill
                    />
                  </div>
                )}

                {/* Display question description if available */}
                {question.description && (
                  <HtmlRenderer html={question.description} className="mt-2" />
                )}

                <div className="mt-4">
                  {question.answer_type === AnswerType.SINGLE_CHOICE ? (
                    <FormField
                      control={form.control}
                      name={`answers.${questionIndex}.answer_id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              className="grid gap-x-3 gap-y-4 xl:grid-cols-2"
                              onValueChange={(value) => {
                                field.onChange(parseInt(value))
                                field.onBlur()
                              }}
                              value={field.value?.toString()}
                            >
                              {question.answers.map(
                                (answer, answerIndex: number) => (
                                  <FormItem key={answerIndex}>
                                    <FormLabel
                                      className={cn(
                                        'flex cursor-pointer items-center space-x-4 rounded border p-4 font-normal'
                                      )}
                                    >
                                      <FormControl>
                                        <RadioGroupItem
                                          value={answer.id!.toString()}
                                        />
                                      </FormControl>
                                      <span>{answer.answer}</span>
                                    </FormLabel>
                                  </FormItem>
                                )
                              )}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name={`answers.${questionIndex}.answer_id`}
                      render={() => (
                        <FormItem>
                          <div className="grid gap-x-3 gap-y-4 xl:grid-cols-2">
                            {question.answers.map((answer) => (
                              <FormField
                                key={`${question.id}-${answer.id}`}
                                control={form.control}
                                name={`answers.${questionIndex}.answer_id`}
                                render={({ field }) => {
                                  const value = field.value as number[]
                                  return (
                                    <FormItem
                                      key={`${question.id}-${answer.id}`}
                                    >
                                      <FormLabel
                                        className={cn(
                                          'flex cursor-pointer items-center space-x-4 rounded border p-4 font-normal'
                                        )}
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={value.includes(answer.id!)}
                                            onCheckedChange={(checked) => {
                                              if (checked) {
                                                field.onChange([
                                                  ...value,
                                                  answer.id,
                                                ])
                                              } else {
                                                field.onChange(
                                                  value?.filter(
                                                    (value) =>
                                                      value !== answer.id
                                                  )
                                                )
                                              }
                                              field.onBlur()
                                            }}
                                          />
                                        </FormControl>
                                        <span>{answer.answer}</span>
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              {quizData?.user_submitted_answers !== null && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setResult(undefined)}
                  className="px-4"
                >
                  Ôn tập lại
                </Button>
              )}

              {!isCompleted && (
                <LoadingButton loading={isPending} type="submit">
                  Nộp bài
                </LoadingButton>
              )}
            </div>
          </form>
        </Form>
      </div>

      <PracticeExerciseResultsAlert
        open={!!result}
        onOpenChange={(open) => {
          if (!open) {
            setResult(undefined)
          }
        }}
        result={result}
        onNext={
          courseSlug && nextLessonId
            ? () => {
                router.push(`/learning/${courseSlug}/lesson/${nextLessonId}`)
              }
            : undefined
        }
      />
    </>
  )
}
