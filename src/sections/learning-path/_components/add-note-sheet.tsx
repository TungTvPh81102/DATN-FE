'use client'

import QuillEditor from '@/components/shared/quill-editor'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useStoreNote } from '@/hooks/note/useNote'
import { formatDuration } from '@/lib/common'
import { NotePayload, noteSchema } from '@/validations/note'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  lessonId: number
  currentTime: number
}

const AddNoteSheet = ({ open, onOpenChange, currentTime, lessonId }: Props) => {
  const form = useForm<NotePayload>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      lesson_id: lessonId,
      time: currentTime,
    },
  })

  const { mutate: storeNote, isPending: isPendingStoreNote } = useStoreNote()

  const onSubmit = (values: NotePayload) => {
    storeNote(values, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (isPendingStoreNote) return

        onOpenChange(open)
        form.reset()
      }}
    >
      <SheetContent side="bottom" aria-describedby={undefined} overlay={false}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SheetHeader>
              <SheetTitle>
                Thêm ghi chú tại
                <span className="ml-1 rounded bg-primary px-1 py-0.5 text-primary-foreground">
                  {formatDuration(currentTime, 'colon')}
                </span>
              </SheetTitle>
            </SheetHeader>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <QuillEditor
                      theme="snow"
                      placeholder="Nhập nội dung ghi chú"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" disabled={isPendingStoreNote}>
                  Huỷ bỏ
                </Button>
              </SheetClose>
              <Button disabled={isPendingStoreNote} type="submit">
                {isPendingStoreNote && <Loader2 className="animate-spin" />}
                Tạo ghi chú
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
export default AddNoteSheet
