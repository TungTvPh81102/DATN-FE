import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import {
  BlogCommentPayload,
  ReplyBlogCommentPayload,
} from '@/validations/comment'
import QueryKey from '@/constants/query-key'
import { commentBlogApi } from '@/services/comment-blog/comment-blog-api'

export const useGetBlogComments = (postId: string) => {
  return useQuery({
    queryKey: [QueryKey.BLOG_COMMENT, postId],
    queryFn: () => commentBlogApi.getCommentBlog(postId!),
    enabled: !!postId,
  })
}
export const useGetReplyBLogComment = (commentId: string) => {
  return useQuery({
    queryKey: [QueryKey.BLOG_COMMENT, commentId],
    queryFn: () => commentBlogApi.getCommentReplyBlog(commentId!),
    enabled: !!commentId,
  })
}

export const useStoreCommentBlog = () => {
  return useMutation({
    mutationFn: (data: BlogCommentPayload) =>
      commentBlogApi.storeCommentBlog(data),
  })
}

export const useStoreReplyCommentBlog = () => {
  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string
      data: ReplyBlogCommentPayload
    }) => commentBlogApi.storeReplyCommentBlog(commentId, data),
  })
}

export const useDeleteCommentBlog = (commentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => commentBlogApi.deleteCommentBlog(commentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.BLOG_COMMENT],
      })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Xóa bình luận không thành công')
    },
  })
}
