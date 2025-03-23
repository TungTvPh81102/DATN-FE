import { FileUp, Replace } from 'lucide-react'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoadingButton } from '@/components/ui/loading-button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useImportQuestion } from '@/hooks/instructor/quiz/useQuiz'
import { cn } from '@/lib/utils'
import { PopoverClose } from '@radix-ui/react-popover'

interface ImportQuestionProps {
  quizId: string
  isOpenImportQuestion: boolean
  setIsOpenImportQuestion: (open: boolean) => void
}

const ImportQuestion: React.FC<ImportQuestionProps> = ({
  quizId,
  setIsOpenImportQuestion,
  isOpenImportQuestion,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const { mutate: importMutation, isPending } = useImportQuestion()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls', '.csv'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
      }
    },
  })

  const handleImport = (type: 'overwrite' | 'add') => {
    if (!file) {
      toast.error('Vui lòng chọn một file để import!')
      return
    }

    importMutation(
      {
        quizId,
        payload: {
          file,
          type,
        },
      },
      {
        onSuccess: async () => {
          setIsOpenImportQuestion(false)
          setFile(null)
        },
      }
    )
  }

  return (
    <Dialog
      open={isOpenImportQuestion}
      onOpenChange={(open) => {
        setIsOpenImportQuestion(open)
        if (!open) {
          setFile(null)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import câu hỏi</DialogTitle>
          <DialogDescription>
            Chọn tệp CSV để import câu hỏi vào hệ thống.
          </DialogDescription>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={cn(
            'flex min-h-36 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4',
            isDragActive && 'bg-gray-100'
          )}
        >
          <input {...getInputProps()} />
          {file ? (
            <p className="font-medium text-green-600">📂 {file.name}</p>
          ) : isDragActive ? (
            <p className="text-blue-600">Thả file vào đây...</p>
          ) : (
            <p className="text-gray-500">
              Kéo & Thả file hoặc click để chọn file
            </p>
          )}
        </div>

        <DialogFooter>
          <Popover>
            <PopoverTrigger asChild>
              <LoadingButton
                loading={isPending}
                variant="outline"
                disabled={!file}
              >
                <Replace />
                Thay thế
              </LoadingButton>
            </PopoverTrigger>
            <PopoverContent>
              <p className="font-semibold">Cảnh báo</p>
              <p className="text-sm text-muted-foreground">
                Hành động này sẽ ghi đè hết tất cả các câu hỏi trước đó
              </p>
              <div className="flex justify-end">
                <PopoverClose asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleImport('overwrite')}
                  >
                    Xác nhận
                  </Button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>

          <LoadingButton
            loading={isPending}
            onClick={() => handleImport('add')}
            disabled={!file}
          >
            <FileUp />
            Thêm mới
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImportQuestion
