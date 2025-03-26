import {
  BlogCommentPayload,
  ReplyBlogCommentPayload,
} from '@/validations/comment'
import api from '@/configs/api'

const prefix = 'blogs/comments'

export const commentBlogApi = {
  getCommentBlog: async (commentId: string) => {
    return await api.get(`${prefix}/${commentId}/blog-comment`)
  },

  getCommentReplyBlog: async (commentId: string) => {
    return await api.get(`${prefix}/${commentId}/replies`)
  },

  storeCommentBlog: async (data: BlogCommentPayload) => {
    return await api.post(`${prefix}/store-blog-comment`, data)
  },

  storeReplyCommentBlog: async (
    commentId: string,
    data: ReplyBlogCommentPayload
  ) => {
    return await api.post(`${prefix}/${commentId}/reply`, data)
  },

  deleteCommentBlog: async (commentId: string) => {
    return await api.delete(`${prefix}/${commentId}`)
  },
}
