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
import { useMoveCoursesToTrash } from '@/hooks/instructor/course/useCourse'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ICourse } from '@/types'

interface DeleteCoursesDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  courses: Row<ICourse>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteCoursesDialog({
  courses,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteCoursesDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const { mutate, isPending } = useMoveCoursesToTrash()

  const onDelete = () => {
    mutate(
      courses.map((course) => course.id!),
      {
        onSuccess: () => {
          props.onOpenChange?.(false)
          onSuccess?.()
        },
      }
    )
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Xóa ({courses.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn không?</DialogTitle>
            <DialogDescription>
              Bạn có muốn chuyển{' '}
              <span className="font-medium">{courses.length}</span> khóa học vào
              thùng rác không? Bạn có thể khôi phục sau này.
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
                <Loader2
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
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
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Xóa ({courses.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bạn có chắc chắn không?</DrawerTitle>
          <DrawerDescription>
            Bạn có muốn chuyển{' '}
            <span className="font-medium">{courses.length}</span> khóa học vào
            thùng rác không? Bạn có thể khôi phục sau này.
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
              <Loader2
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Xóa
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
