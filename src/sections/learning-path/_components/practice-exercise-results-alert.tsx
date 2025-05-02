'use client'

import React, { useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  result?: {
    correct_answer: number
    total_question: number
    incorrect_questions?: Array<{
      question_id: number
      question: string
      user_answer: string | string[]
    }>
  }
  onNext?: () => void
}

export function PracticeExerciseResultsAlert({
  result,
  onNext,
  ...props
}: Props) {
  const [activeTab, setActiveTab] = useState<string>('overview')

  if (!result) return null
  const { correct_answer, total_question, incorrect_questions = [] } = result

  const percentage = Math.round((correct_answer / total_question) * 100)
  const isAllCorrect = correct_answer === total_question

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-2 text-center text-2xl">
            Kết Quả Bài Kiểm Tra
          </AlertDialogTitle>
        </AlertDialogHeader>

        {isAllCorrect ? (
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="flex items-center justify-center rounded-full border-8 border-green-100 bg-green-50 p-8 text-center shadow-md">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-green-600">
                  {correct_answer}/{total_question}
                </span>
                <span className="text-sm text-muted-foreground">
                  Câu Trả Lời Đúng
                </span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Điểm: {percentage}%</span>
                <span className="text-sm font-medium text-green-600">Đạt</span>
              </div>
              <Progress
                value={percentage}
                className="h-3 rounded-full bg-green-100"
              />
            </div>

            <div className="flex w-full items-center justify-center gap-2 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="size-5" />
                <span className="font-medium">
                  Chúc mừng! Bạn đã vượt qua bài kiểm tra!
                </span>
              </div>
            </div>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
              {!isAllCorrect && (
                <TabsTrigger value="mistakes">
                  Câu Sai ({total_question - correct_answer})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="flex flex-col items-center space-y-6 py-4">
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full border-8 p-8 text-center shadow-md',
                    isAllCorrect
                      ? 'border-green-100 bg-green-50'
                      : 'border-amber-100 bg-amber-50'
                  )}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        'text-5xl font-bold',
                        isAllCorrect ? 'text-green-600' : 'text-amber-600'
                      )}
                    >
                      {correct_answer}/{total_question}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Câu Trả Lời Đúng
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Điểm: {percentage}%
                    </span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isAllCorrect ? 'text-green-600' : 'text-amber-600'
                      )}
                    >
                      {isAllCorrect ? 'Đạt' : 'Chưa Đạt'}
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn(
                      'h-3 rounded-full',
                      isAllCorrect ? 'bg-green-100' : 'bg-amber-100'
                    )}
                  />
                </div>

                <div className="flex w-full items-center justify-center gap-2 rounded-lg border p-4">
                  {isAllCorrect ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="size-5" />
                      <span className="font-medium">
                        Chúc mừng! Bạn đã vượt qua bài kiểm tra!
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="size-5" />
                      <span className="font-medium">
                        Bạn cần cải thiện điểm số. Hãy xem lại các câu sai!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {!isAllCorrect && (
              <TabsContent value="mistakes" className="mt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {incorrect_questions.map((question) => (
                      <div
                        key={question.question_id}
                        className="rounded-lg border p-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <XCircle className="size-4 shrink-0 text-red-500" />
                            <h1 className="mt-1 text-sm font-medium">
                              {question.question}
                            </h1>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Đáp án của bạn:{' '}
                            <span className="font-medium text-red-500">
                              {question.user_answer
                                ? Array.isArray(question.user_answer)
                                  ? question.user_answer.join(', ')
                                  : question.user_answer
                                : 'Không có đáp án'}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>
        )}

        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>
            <RotateCcw />
            Thử Lại
          </AlertDialogCancel>

          {isAllCorrect && onNext && (
            <AlertDialogAction onClick={onNext}>
              Tiếp Theo
              <ArrowRight />
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
