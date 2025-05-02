import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import {
  LessonCommentPayload,
  ReplyLessonCommentPayload,
  ReportCommentPayload,
} from '@/validations/comment'
import QueryKey from '@/constants/query-key'
import { commentLessonApi } from '@/services/comment-lesson/comment-lesson-api'

export const useGetLessonComments = (lessonId: number) => {
  return useQuery({
    queryKey: [QueryKey.LESSON_COMMENT, lessonId],
    queryFn: () => commentLessonApi.getCommentLessons(lessonId!),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
export const useGetCommentBlockTime = () => {
  return useQuery({
    queryKey: [QueryKey.COMMENT_BLOCK_TIME],
    queryFn: () => commentLessonApi.getCommentBlockTime(),
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LessonCommentPayload) =>
      commentLessonApi.storeCommentLesson(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.LESSON_COMMENT],
      })
    },
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

export const useReportComment = () => {
  return useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: number
      data: ReportCommentPayload
    }) => commentLessonApi.reportComment(lessonId, data),
  })
}
