'use client'

import { TiptapEditor } from '@/components/tiptap-editor'
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
import { CreateNotePayload, createNoteSchema } from '@/validations/note'
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
  const form = useForm<CreateNotePayload>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      lesson_id: lessonId,
      time: currentTime,
      content: '',
    },
  })

  const { mutate: storeNote, isPending: isPendingStoreNote } = useStoreNote()

  const onSubmit = (values: CreateNotePayload) => {
    const payload = {
      ...values,
      time: currentTime,
    }

    storeNote(payload, {
      onSuccess: () => {
        onOpenChange(false)
        form.reset()
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
                    <TiptapEditor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  disabled={isPendingStoreNote}
                  size="sm"
                  onClick={() => form.reset()}
                >
                  Huỷ bỏ
                </Button>
              </SheetClose>
              <Button disabled={isPendingStoreNote} type="submit" size="sm">
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
