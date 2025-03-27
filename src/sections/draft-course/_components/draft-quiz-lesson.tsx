import { formatDate } from '@/lib/common'
import { cn } from '@/lib/utils'
import { AnswerType } from '@/types'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DraftLesson } from '@/types/DraftCourse'

type Props = {
  lesson: DraftLesson
}

const DraftQuizLesson = ({ lesson }: Props) => {
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

      <div className="space-y-8">
        {lesson.questions?.map((question, questionIndex) => (
          <div key={questionIndex}>
            Câu hỏi {questionIndex + 1}:{' '}
            {question.answer_type === AnswerType.MULTIPLE_CHOICE && (
              <span className="text-sm text-muted-foreground">
                (Chọn nhiều đáp án)
              </span>
            )}
            <h3 className="text-lg font-semibold">{question.question}</h3>
            <div className="mt-4 space-y-4">
              {question.answer_type === AnswerType.SINGLE_CHOICE ? (
                <RadioGroup className="gap-4">
                  {question.answers.map((answer, answerIndex: number) => (
                    <Label
                      key={answerIndex}
                      className={cn(
                        'flex items-center space-x-4 rounded border p-4 font-normal',
                        answer.is_correct
                          ? 'border-green-500 bg-green-100'
                          : 'border-red-500 bg-red-100'
                      )}
                    >
                      <RadioGroupItem
                        value={answerIndex + ''}
                        checked={answer.is_correct}
                        className="cursor-default"
                      />
                      <span>{answer.answer}</span>
                    </Label>
                  ))}
                </RadioGroup>
              ) : (
                question.answers.map((answer, index) => (
                  <Label
                    key={index}
                    className={cn(
                      'flex items-center space-x-4 rounded border p-4 font-normal',
                      answer.is_correct
                        ? 'border-green-500 bg-green-100'
                        : 'border-red-500 bg-red-100'
                    )}
                  >
                    <Checkbox
                      checked={answer.is_correct}
                      className="cursor-default"
                    />
                    <span>{answer.answer}</span>
                  </Label>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DraftQuizLesson
