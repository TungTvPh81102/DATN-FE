'use client'

import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react'

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

interface Props extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  result?: {
    correct_answer: number
    total_question: number
  }
  onNext?: () => void
}

export function PracticeExerciseResultsAlert({
  result,
  onNext,
  ...props
}: Props) {
  if (!result) return null
  const { correct_answer, total_question } = result

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
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="flex items-center justify-center rounded-full border-8 border-muted bg-background p-8 text-center shadow-md">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold">
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
              <span className="text-sm font-medium">
                {isAllCorrect ? 'Đạt' : 'Không Đạt'}
              </span>
            </div>
            <Progress value={percentage} className="h-3 rounded-full" />
          </div>

          <div className="flex w-full items-center justify-center gap-2">
            {isAllCorrect ? (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="size-5" />
                <span>Bạn đã vượt qua bài kiểm tra!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="size-5" />
                <span>Bạn cần cải thiện điểm số của mình.</span>
              </div>
            )}
          </div>
        </div>

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
