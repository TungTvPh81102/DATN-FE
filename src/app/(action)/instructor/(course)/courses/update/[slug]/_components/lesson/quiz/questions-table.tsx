'use client'

import { DataTable } from '@/components/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/use-data-table'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import { AnswerTypeMap, Question } from '@/types'
import { DataTableFilterField, DataTableRowAction } from '@/types/data-table'
import { useEffect, useMemo, useState } from 'react'
import { DeleteQuestionsDialog } from './delete-questions-dialog'
import { getColumns } from './questions-table-columns'
import { QuestionsTableToolbarActions } from './questions-table-toolbar-actions'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { useUpdateQuestionsOrder } from '@/hooks/instructor/quiz/useQuiz'
import { UpsertQuestionDialog } from './upsert-question-dialog'

const filterFields: DataTableFilterField<Question>[] = [
  {
    id: 'question',
    label: 'Câu hỏi',
    placeholder: 'Câu hỏi...',
  },
  {
    id: 'answer_type',
    label: 'Loại câu hỏi',
    options: Object.entries(AnswerTypeMap).map(([key, value]) => ({
      label: value.label,
      value: key,
    })),
  },
]

interface Props {
  questions?: Question[]
  quizId: number
}

export const QuestionsTable = ({
  questions: initialQuestions = [],
  quizId,
}: Props) => {
  const { isDraftOrRejected } = useCourseStatusStore()

  const [questions, setQuestions] = useState(initialQuestions)

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<Question> | null>(null)
  const [dragMode, setDragMode] = useState(false)

  const columns = useMemo(
    () => getColumns({ setRowAction, isDraftOrRejected, dragMode }),
    [isDraftOrRejected, dragMode]
  )

  const { table } = useDataTable({
    data: questions,
    columns,
    getRowId: (originalRow) => originalRow.id?.toString(),
  })

  const { mutate: updateQuestionsOrder, isPending: isUpdating } =
    useUpdateQuestionsOrder()

  const handleSaveOrder = () => {
    const payload = questions.map((question, index) => ({
      id: question.id,
      order: index + 1,
    }))
    updateQuestionsOrder({ quizId, payload })
  }

  useEffect(() => {
    setQuestions(initialQuestions)
  }, [initialQuestions])

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-semibold">Danh sách câu hỏi</h4>
        <div className="flex items-center space-x-2">
          <Switch
            checked={dragMode}
            onCheckedChange={(checked) => {
              setDragMode(checked)
              if (!checked) {
                setQuestions(initialQuestions)
              }
            }}
            id="allow-move"
          />
          <Label className="cursor-pointer" htmlFor="allow-move">
            Thay đổi vị trí
          </Label>
        </div>
      </div>

      <DataTable table={table} setData={setQuestions}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <QuestionsTableToolbarActions
            table={table}
            quizId={quizId}
            disableAdd={questions?.length >= 50}
          />
        </DataTableToolbar>
      </DataTable>

      {dragMode && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setDragMode(false)
              setQuestions(initialQuestions)
            }}
          >
            Hủy
          </Button>
          <LoadingButton loading={isUpdating} onClick={handleSaveOrder}>
            Lưu
          </LoadingButton>
        </div>
      )}

      <UpsertQuestionDialog
        isOpen={rowAction?.type === 'update'}
        onOpenChange={() => {
          setRowAction(null)
        }}
        question={rowAction?.row.original}
      />

      <DeleteQuestionsDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        questions={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
      />
    </>
  )
}
