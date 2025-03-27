'use client'

import type { Table } from '@tanstack/react-table'
import { Download, FileDown, FileUp, Plus, PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useExportQuiz } from '@/hooks/instructor/quiz/useQuiz'
import { instructorCourseApi } from '@/services/instructor/course/course-api'
import { Question } from '@/types'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { UpsertQuestionDialog } from './upsert-question-dialog'
import ImportQuestion from './import-question'

interface Props {
  table: Table<Question>
  quizId: number
  disableAdd?: boolean
}

export function QuestionsTableToolbarActions({ quizId, disableAdd }: Props) {
  const [isOpenAddQuestion, setIsOpenAddQuestion] = useState(false)
  const [isOpenImportQuestion, setIsOpenImportQuestion] = useState(false)

  const { mutate: exportQuiz, isPending } = useExportQuiz()

  const handleDownloadQuizForm = async () => {
    try {
      const res =
        (await instructorCourseApi.downloadQuizForm()) as unknown as BlobPart

      const url = window.URL.createObjectURL(new Blob([res]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'quiz_import_template.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error: any) {
      toast(error.message)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={disableAdd}
              aria-label="Open menu"
              size="sm"
              className="data-[state=open]:bg-primary/80"
            >
              <Plus />
              Thêm câu hỏi
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="max-w-40 *:cursor-pointer"
          >
            <DropdownMenuItem onSelect={() => setIsOpenAddQuestion(true)}>
              <PlusCircle />
              Thêm thủ công
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsOpenImportQuestion(true)}>
              <FileUp />
              Import từ file
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleDownloadQuizForm}>
              <FileDown />
              Tải file mẫu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          disabled={isPending}
          onClick={() => exportQuiz(quizId)}
          variant="outline"
          size="sm"
        >
          <Download aria-hidden="true" />
          Xuất file
        </Button>
      </div>

      <UpsertQuestionDialog
        isOpen={isOpenAddQuestion}
        onOpenChange={setIsOpenAddQuestion}
        quizId={quizId}
      />

      <ImportQuestion
        quizId={quizId}
        isOpenImportQuestion={isOpenImportQuestion}
        setIsOpenImportQuestion={setIsOpenImportQuestion}
      />
    </>
  )
}
