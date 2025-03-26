import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import {
  LessonCommentPayload,
  ReplyLessonCommentPayload,
} from '@/validations/comment'
import QueryKey from '@/constants/query-key'
import { commentLessonApi } from '@/services/comment-lesson/comment-lesson-api'

export const useGetLessonComments = (lessonId: string) => {
  return useQuery({
    queryKey: [QueryKey.LESSON_COMMENT, lessonId],
    queryFn: () => commentLessonApi.getCommentLessons(lessonId!),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
export const useGetReplyLessonComment = (commentId: string) => {
  return useQuery({
    queryKey: [QueryKey.LESSON_COMMENT, commentId],
    queryFn: () => commentLessonApi.getCommentReplyLesson(commentId!),
    enabled: !!commentId,
  })
}

export const useStoreCommentLesson = () => {
  return useMutation({
    mutationFn: (data: LessonCommentPayload) =>
      commentLessonApi.storeCommentLesson(data),
  })
}

export const useStoreReplyCommentLesson = () => {
  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string
      data: ReplyLessonCommentPayload
    }) => commentLessonApi.storeReplyCommentLesson(commentId, data),
  })
}

export const useDeleteComment = (commentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => commentLessonApi.deleteComment(commentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.LESSON_COMMENT],
      })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Xóa bình luận không thành công')
    },
  })
}
