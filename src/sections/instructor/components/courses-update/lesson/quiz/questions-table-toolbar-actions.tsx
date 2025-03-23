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
import { Question } from '@/types'
import { instructorCourseApi } from '@/services/instructor/course/course-api'
import { toast } from 'react-toastify'
import ImportQuestion from './import-question'
import { useState } from 'react'
import AddQuestionDialog from './add-question-dialog'

interface Props {
  table: Table<Question>
  quizId: string
}

export function QuestionsTableToolbarActions({ quizId }: Props) {
  const [isOpenAddQuestion, setIsOpenAddQuestion] = useState(false)
  const [isOpenImportQuestion, setIsOpenImportQuestion] = useState(false)

  const handleDownloadQuizForm = async () => {
    try {
      const res = await instructorCourseApi.downloadQuizForm()

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'quiz_import_template.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
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
        <Button variant="outline" size="sm">
          <Download aria-hidden="true" />
          Xuất file
        </Button>
      </div>

      <AddQuestionDialog
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
