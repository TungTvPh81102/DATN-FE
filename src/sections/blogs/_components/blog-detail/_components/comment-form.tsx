import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  blogCommentSchema,
  replyBlogCommentSchema,
} from '@/validations/comment'
import {
  useStoreCommentBlog,
  useStoreReplyCommentBlog,
} from '@/hooks/comment-blog/useCommentBlog'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import Swal from 'sweetalert2'

interface CommentFormProps {
  postId?: string
  commentId?: string
  onSuccess?: () => void
  isReply?: boolean
  onCancel?: () => void
  replyToUser?: {
    name: string
  }
}

const CommentForm = ({
  postId,
  commentId,
  onSuccess,
  isReply = false,
  onCancel,
  replyToUser,
}: CommentFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isReply ? replyBlogCommentSchema : blogCommentSchema),
  })

  const { user } = useAuthStore()
  const router = useRouter()

  const storeComment = useStoreCommentBlog()
  const storeReply = useStoreReplyCommentBlog()

  useEffect(() => {
    if (isReply && replyToUser) {
      setValue('content', `@${replyToUser.name} `)
    }
  }, [isReply, replyToUser, setValue])

  const onSubmit = async (data: any) => {
    if (!user) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Bạn phải đăng nhập mới được bình luận!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đăng nhập',
        cancelButtonText: 'Hủy',
      }).then((result: any) => {
        if (result.isConfirmed) {
          router.push('/sign-in')
        }
      })
      return
    }
    try {
      if (isReply && commentId) {
        await storeReply.mutateAsync({
          commentId,
          data: {
            ...data,
            post_id: postId,
            parent_id: commentId,
          },
        })
      } else {
        await storeComment.mutateAsync({ ...data, post_id: postId })
      }
      reset()
      if (onSuccess) onSuccess()
      if (onCancel) onCancel()
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  const content = watch('content')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow focus-within:ring-1 focus-within:ring-orange-500">
        <textarea
          {...register('content')}
          rows={3}
          className="w-full resize-none border-0 bg-transparent px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
          placeholder={
            isReply ? 'Viết phản hồi...' : 'Chia sẻ suy nghĩ của bạn...'
          }
        />
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-3 py-2">
          {isReply && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </Button>
          )}
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              (isReply &&
                (!content || content.trim() === `@${replyToUser?.name}`))
            }
            className="inline-flex items-center gap-2 px-4 py-2"
          >
            <Send className="size-4" />
            {isReply ? 'Gửi phản hồi' : 'Đăng bình luận'}
          </Button>
        </div>
      </div>
      {errors.content && (
        <p className="mt-2 text-sm text-red-500">
          {errors.content.message as string}
        </p>
      )}
    </form>
  )
}

export default CommentForm
