import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Trophy,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useCompleteLesson } from '@/hooks/learning-path/useLearningPath'
import { formatDate } from '@/lib/common'
import { cn } from '@/lib/utils'
import { AnswerType, ILesson } from '@/types'
import {
  QuizSubmissionPayload,
  quizSubmissionSchema,
} from '@/validations/quiz-submission'

import HtmlRenderer from '@/components/shared/html-renderer'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Image from 'next/image'
import confetti from 'canvas-confetti'

type Props = {
  lesson: ILesson
  isCompleted: boolean
}

const triggerSuccessAnimation = () => {
  const duration = 5 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: any, max: any) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    )
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    )
  }, 250)
}

const QuizLesson = ({ lesson, isCompleted }: Props) => {
  const { lessonable: quizData } = lesson
  const { questions = [] } = quizData!

  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [isCorrect, setIsCorrect] = useState<{
    [key: number]: boolean
  }>({})
  const [answerStatus, setAnswerStatus] = useState<{
    [key: number]: { [key: number]: string }
  }>({})
  const [isRevising, setIsRevising] = useState<boolean>(false)

  const form = useForm<QuizSubmissionPayload>({
    resolver: zodResolver(quizSubmissionSchema),
    defaultValues: {
      quiz_id: lesson.lessonable_id,
      answers: questions.map((question) => ({
        question_id: question.id,
        answer_id: [],
      })),
    },
  })

  const { mutate: completeLesson, isPending } = useCompleteLesson()

  const handleAnswerChange = () => {
    setIsCorrect({
      ...isCorrect,
      [currentQuestion]: false,
    })
    setAnswerStatus({
      ...answerStatus,
      [currentQuestion]: {},
    })
  }

  const checkAnswer = () => {
    const allAnswers = questions[currentQuestion].answers
    const selectedAnswers = form.getValues().answers[currentQuestion].answer_id

    const correctAnswers = allAnswers
      ?.filter((answer) => answer.is_correct === 1)
      .map((answer) => answer.id)

    const selectedSet = new Set(
      Array.isArray(selectedAnswers) ? selectedAnswers : [selectedAnswers]
    )
    const correctSet = new Set(correctAnswers)

    const isAnswerCorrect =
      selectedSet.size === correctSet.size &&
      Array.from(selectedSet).every((id) => correctSet.has(id))

    setIsCorrect({
      ...isCorrect,
      [currentQuestion]: isAnswerCorrect,
    })

    const newAnswerStatus: { [key: number]: string } = {}
    allAnswers?.forEach((answer) => {
      if (selectedSet.has(answer.id!)) {
        newAnswerStatus[answer.id!] = answer.is_correct
          ? 'bg-green-100 border-green-500'
          : 'bg-red-100 border-red-500'
      }
    })
    setAnswerStatus({
      ...answerStatus,
      [currentQuestion]: newAnswerStatus,
    })
  }

  const isCorrectAll = useMemo(() => {
    return (
      Object.values(isCorrect).every((correct) => correct) &&
      Object.keys(isCorrect).length === questions.length
    )
  }, [isCorrect, questions.length])

  const onSubmit = (values: QuizSubmissionPayload) => {
    completeLesson(
      {
        lessonId: lesson.id!,
        payload: values,
      },
      {
        onSuccess: () => {
          triggerSuccessAnimation()
        },
      }
    )
  }

  const resetQuiz = () => {
    form.reset({
      quiz_id: lesson.lessonable_id,
      answers: questions.map((question) => ({
        question_id: question.id,
        answer_id: [],
      })),
    })

    setCurrentQuestion(0)
    setIsCorrect({})
    setAnswerStatus({})
    setIsRevising(true)
  }

  useEffect(() => {
    if (quizData?.user_submitted_answers) {
      form.reset({
        quiz_id: lesson.lessonable_id,
        answers: quizData.user_submitted_answers,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizData])

  if (!quizData || !questions.length) return <p>Không có câu hỏi nào.</p>

  if (isCompleted && !isRevising) {
    return (
      <div className="mx-6 mt-8 space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
          <p className="text-sm text-gray-500">
            Cập nhật{' '}
            {formatDate(lesson.updated_at, {
              dateStyle: 'long',
            })}
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border-none bg-gradient-to-br from-[#E27447]/10 to-[#E27447]/5">
          <div className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-6 rounded-full bg-[#E27447]/20 p-4">
                <Trophy className="size-16 text-[#E27447]" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Chúc mừng! Bạn đã hoàn thành bài học
              </h2>
              <p className="mb-6 text-lg text-gray-600">
                Bạn đã trả lời đúng {questions.length}/{questions.length} câu
                hỏi.
              </p>
              <Button
                variant="outline"
                onClick={resetQuiz}
                className="flex items-center gap-2 border-[#E27447] bg-white text-[#E27447] hover:bg-[#E27447]/10"
              >
                <RefreshCw className="size-4" /> Ôn tập lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-6 mb-40 mt-8 space-y-4">
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {quizData.questions?.map((question, questionIndex) => (
            <div
              key={question.id!}
              className={cn(currentQuestion !== questionIndex && 'hidden')}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  <span className="text-lg font-medium">
                    Câu hỏi {currentQuestion + 1}:{' '}
                  </span>
                  {question.question}
                  {question.answer_type === AnswerType.MULTIPLE_CHOICE && (
                    <span className="text-sm text-muted-foreground">
                      (Chọn nhiều đáp án)
                    </span>
                  )}
                </h3>
                <span className="text-sm">
                  Tiến độ: {Object.keys(isCorrect).length}/{questions.length}{' '}
                  câu hỏi
                </span>
              </div>

              {question.image && (
                <div className="relative mt-4 h-80">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STORAGE}/${question.image}`}
                    alt={`Hình ảnh cho câu hỏi ${currentQuestion + 1}`}
                    className="rounded-md object-contain"
                    fill
                  />
                </div>
              )}

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
                            className="gap-4"
                            onValueChange={(value) => {
                              field.onChange(parseInt(value))
                              field.onBlur()
                              handleAnswerChange()
                            }}
                            value={field.value?.toString()}
                          >
                            {question.answers.map(
                              (answer, answerIndex: number) => (
                                <FormItem key={answerIndex}>
                                  <FormLabel
                                    className={cn(
                                      'flex cursor-pointer items-center space-x-4 rounded border p-4 font-normal',
                                      answerStatus[currentQuestion]?.[
                                        answer.id!
                                      ]
                                    )}
                                  >
                                    <FormControl>
                                      <RadioGroupItem
                                        value={answer.id!.toString()}
                                      />
                                    </FormControl>
                                    <div className="flex flex-1 items-center justify-between">
                                      <span>{answer.answer}</span>
                                      {answerStatus[currentQuestion]?.[
                                        answer.id!
                                      ]?.includes('green') && (
                                        <CheckCircle2 className="size-5 text-green-600" />
                                      )}
                                      {answerStatus[currentQuestion]?.[
                                        answer.id!
                                      ]?.includes('red') && (
                                        <XCircle className="size-5 text-red-600" />
                                      )}
                                    </div>
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
                      <FormItem className="space-y-4">
                        {question.answers.map((answer) => (
                          <FormField
                            key={`${question.id}-${answer.id}`}
                            control={form.control}
                            name={`answers.${questionIndex}.answer_id`}
                            render={({ field }) => {
                              const value = field.value as number[]
                              return (
                                <FormItem key={`${question.id}-${answer.id}`}>
                                  <FormLabel
                                    className={cn(
                                      'flex cursor-pointer items-center space-x-4 rounded border p-4 font-normal',
                                      answerStatus[currentQuestion]?.[
                                        answer.id!
                                      ]
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
                                                (value) => value !== answer.id
                                              )
                                            )
                                          }
                                          handleAnswerChange()
                                          field.onBlur()
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex flex-1 items-center justify-between">
                                      <span>{answer.answer}</span>
                                      {answerStatus[currentQuestion]?.[
                                        answer.id!
                                      ]?.includes('green') && (
                                        <CheckCircle2 className="size-5 text-green-600" />
                                      )}
                                      {answerStatus[currentQuestion]?.[
                                        answer.id!
                                      ]?.includes('red') && (
                                        <XCircle className="size-5 text-red-600" />
                                      )}
                                    </div>
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          ))}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-4">
              {currentQuestion > 0 && (
                <Button
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                >
                  <ChevronLeft className="size-4" /> Quay lại
                </Button>
              )}

              {isCorrect[currentQuestion] ? (
                currentQuestion < questions.length - 1 && (
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  >
                    Tiếp tục <ChevronRight className="size-4" />
                  </Button>
                )
              ) : (
                <Button onClick={checkAnswer}>Kiểm tra đáp án</Button>
              )}
            </div>

            <div className="flex gap-4">
              {isCompleted && !isRevising && (
                <Button
                  variant="outline"
                  onClick={resetQuiz}
                  className="flex items-center gap-2 border-blue-200 hover:bg-blue-50"
                >
                  <RefreshCw className="size-4" /> Ôn tập lại
                </Button>
              )}

              {isCorrectAll && (
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Nộp bài
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default QuizLesson
