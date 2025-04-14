'use client'

import type { Row } from '@tanstack/react-table'
import { Loader2, Trash } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useDeleteQuestion } from '@/hooks/instructor/quiz/useQuiz'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Question } from '@/types'

interface Props extends React.ComponentPropsWithoutRef<typeof Dialog> {
  questions: Row<Question>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteQuestionsDialog({
  questions,
  showTrigger = true,
  onSuccess,
  ...props
}: Props) {
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const { mutate, isPending } = useDeleteQuestion()

  const onDelete = () => {
    mutate(questions.map((question) => question.id!)[0], {
      onSuccess: () => {
        props.onOpenChange?.(false)
        onSuccess?.()
      },
    })
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash aria-hidden="true" />
              Xóa ({questions.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn không?</DialogTitle>
            <DialogDescription>
              Bạn có muốn xóa{' '}
              <span className="font-medium">{questions.length}</span> câu hỏi
              không? Bạn không thể khôi phục sau khi xóa.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isPending}
            >
              {isPending && (
                <Loader2 className="animate-spin" aria-hidden="true" />
              )}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash aria-hidden="true" />
            Xóa ({questions.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bạn có chắc chắn không?</DrawerTitle>
          <DrawerDescription>
            Bạn có muốn xóa{' '}
            <span className="font-medium">{questions.length}</span> câu hỏi
            không? Bạn không thể khôi phục sau khi xóa.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Hủy</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="animate-spin" aria-hidden="true" />
            )}
            Xóa
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
