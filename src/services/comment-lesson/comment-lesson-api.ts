import {
  LessonCommentPayload,
  ReplyLessonCommentPayload,
  ReportCommentPayload,
} from '@/validations/comment'
import api from '@/configs/api'

const prefix = 'lessons/comments'

export const commentLessonApi = {
  getCommentLessons: async (lessonId: number) => {
    return await api.get(`${prefix}/${lessonId}/lesson-comment`)
  },

  getCommentReplyLesson: async (commentId: string) => {
    return await api.get(`${prefix}/${commentId}/replies`)
  },

  getCommentBlockTime: async () => {
    return await api.get(`${prefix}/comment-block-time`)
  },

  storeCommentLesson: async (data: LessonCommentPayload) => {
    return await api.post(`${prefix}/store-lesson-comment`, data)
  },

  storeReplyCommentLesson: async (
    commentId: string,
    data: ReplyLessonCommentPayload
  ) => {
    return await api.post(`${prefix}/${commentId}/reply`, data)
  },

  deleteComment: async (commentId: string) => {
    return await api.delete(`${prefix}/${commentId}`)
  },

  reportComment: async (lessonId: number, data: ReportCommentPayload) => {
    return await api.post(`${prefix}/report-comment/${lessonId}`, data)
  },
}
