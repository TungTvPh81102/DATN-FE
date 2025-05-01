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
import { Progress } from '@/components/ui/progress'

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
    incorrect_questions?: Array<{
      question_id: number
      question: string
      user_answer: string | string[]
    }>
  }>()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showAllQuestions, setShowAllQuestions] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)

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
          setIsReviewing(false)
          // form.reset()
        },
      }
    )
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const isAnswered = (questionIndex: number) => {
    const answers = form.getValues().answers[questionIndex].answer_id
    return Array.isArray(answers) ? answers.length > 0 : !!answers
  }

  const getAnsweredCount = () => {
    return form.getValues().answers.filter((a, idx) => isAnswered(idx)).length
  }

  const getAnswerValue = (questionIndex: number) => {
    const formValues = form.getValues()
    if (!formValues.answers || !formValues.answers[questionIndex]) {
      return null
    }
    return formValues.answers[questionIndex].answer_id
  }

  if (!quizData || !questions.length) return <p>Không có câu hỏi nào.</p>

  return (
    <>
      <div className="mx-16 mb-20 mt-8 space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">
            Cập nhật{' '}
            {formatDate(lesson.updated_at, {
              dateStyle: 'long',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {getAnsweredCount()}/{questions.length} câu hỏi đã trả lời
          </span>
          <Progress
            value={(getAnsweredCount() / questions.length) * 100}
            className="h-2 w-24 sm:w-32"
          />
        </div>

        {!showAllQuestions && (
          <div className="flex flex-wrap gap-2">
            {questions.map((_, idx) => (
              <Button
                key={idx}
                variant={currentQuestion === idx ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'h-8 w-8 p-0',
                  isAnswered(idx) &&
                    currentQuestion !== idx &&
                    'border-green-200 bg-green-50 text-green-600'
                )}
                onClick={() => setCurrentQuestion(idx)}
              >
                {idx + 1}
              </Button>
            ))}
            {!showAllQuestions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllQuestions(true)}
              >
                Xem tất cả
              </Button>
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {showAllQuestions ? (
              <div className="space-y-10">
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

                    {question.description && (
                      <HtmlRenderer
                        html={question.description}
                        className="mt-2"
                      />
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
                                                checked={value.includes(
                                                  answer.id!
                                                )}
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
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {currentQuestion + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">
                        {questions[currentQuestion].question}
                        {questions[currentQuestion].answer_type ===
                          AnswerType.MULTIPLE_CHOICE && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                            (Chọn nhiều đáp án)
                          </span>
                        )}
                      </h3>
                      {questions[currentQuestion].description && (
                        <HtmlRenderer
                          html={questions[currentQuestion].description}
                          className="mt-2 text-sm text-muted-foreground"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {questions[currentQuestion].image && (
                    <div className="relative mb-6 h-64 w-full overflow-hidden rounded-md">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_STORAGE}/${questions[currentQuestion].image}`}
                        alt={`Hình ảnh cho câu hỏi ${currentQuestion + 1}`}
                        className="rounded-md object-contain"
                        fill
                      />
                    </div>
                  )}

                  {questions[currentQuestion].answer_type ===
                  AnswerType.SINGLE_CHOICE ? (
                    <FormField
                      control={form.control}
                      name={`answers.${currentQuestion}.answer_id`}
                      render={({ field }) => {
                        const currentValue = getAnswerValue(currentQuestion)
                        const stringValue =
                          typeof currentValue === 'number'
                            ? currentValue.toString()
                            : ''

                        return (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                className="grid gap-3 md:grid-cols-2"
                                onValueChange={(value) => {
                                  field.onChange(Number.parseInt(value))
                                  field.onBlur()
                                }}
                                value={stringValue}
                              >
                                {questions[currentQuestion].answers.map(
                                  (answer, answerIndex: number) => (
                                    <FormItem key={answerIndex}>
                                      <FormLabel
                                        className={cn(
                                          'flex cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal transition-all hover:border-primary/50',
                                          field.value?.toString() ===
                                            answer.id?.toString() &&
                                            'border-primary/50 bg-primary/5'
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
                        )
                      }}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name={`answers.${currentQuestion}.answer_id`}
                      render={() => (
                        <FormItem>
                          <div className="grid gap-3 md:grid-cols-2">
                            {questions[currentQuestion].answers.map(
                              (answer) => (
                                <FormField
                                  key={`${questions[currentQuestion].id}-${answer.id}`}
                                  control={form.control}
                                  name={`answers.${currentQuestion}.answer_id`}
                                  render={({ field }) => {
                                    const value = field.value as number[]
                                    const isChecked = value.includes(answer.id!)
                                    return (
                                      <FormItem
                                        key={`${questions[currentQuestion].id}-${answer.id}`}
                                      >
                                        <FormLabel
                                          className={cn(
                                            'flex cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal transition-all hover:border-primary/50',
                                            isChecked &&
                                              'border-primary/50 bg-primary/5'
                                          )}
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={isChecked}
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
                              )
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Câu trước
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {currentQuestion + 1} / {questions.length}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={nextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                  >
                    Câu tiếp theo
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              {quizData?.user_submitted_answers !== null && !isReviewing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setResult(undefined)
                    setIsReviewing(true)
                    form.reset({
                      quiz_id: lesson.lessonable_id,
                      answers: questions.map((question) => ({
                        question_id: question.id,
                        answer_id: [],
                      })),
                    })
                  }}
                  className="px-4"
                >
                  Ôn tập lại
                </Button>
              )}

              {showAllQuestions ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAllQuestions(false)}
                >
                  Thu gọn
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAllQuestions(true)}
                >
                  Xem tất cả câu hỏi
                </Button>
              )}

              {(isReviewing || !isCompleted) && (
                <LoadingButton
                  disabled={getAnsweredCount() !== questions.length}
                  loading={isPending}
                  type="submit"
                >
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
