import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  LessonCommentPayload,
  lessonCommentSchema,
} from '@/validations/comment'
import QueryKey from '@/constants/query-key'
import { useStoreCommentLesson } from '@/hooks/comment-lesson/useComment'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export const CommentForm = ({
  lessonId,
  user,
}: {
  lessonId: string
  user: any
}) => {
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)
  const { mutate: storeLessonComment, isPending } = useStoreCommentLesson()

  const form = useForm<LessonCommentPayload>({
    resolver: zodResolver(lessonCommentSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = (values: LessonCommentPayload) => {
    const payload: LessonCommentPayload = {
      ...values,
      lesson_id: lessonId,
    }

    storeLessonComment(payload, {
      onSuccess: async (res: any) => {
        toast.success(res.message)
        form.reset()
        setIsAdding(false)

        await queryClient.invalidateQueries({
          queryKey: [QueryKey.LESSON_COMMENT, lessonId],
        })
      },
      onError: (error: any) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <div className="flex gap-3">
      <Avatar className="size-10">
        <AvatarImage src={user?.avatar || ''} alt={user?.name} />
        <AvatarFallback className="bg-blue-100 text-blue-800">
          {user?.name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 rounded-3xl bg-gray-50 p-2">
        {!isAdding ? (
          <div
            className="cursor-text px-4 py-3 text-gray-500 hover:text-gray-700"
            onClick={() => setIsAdding(true)}
          >
            Nhập bình luận mới của bạn...
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        placeholder="Nhập bình luận của bạn..."
                        className="min-h-[100px] border border-gray-200 focus:border-gray-300 focus:outline-none focus:ring-0 focus-visible:border-gray-300 focus-visible:ring-0"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="reset"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                  disabled={isPending}
                  className="rounded-full"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 size-4" />
                      Bình luận
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}
