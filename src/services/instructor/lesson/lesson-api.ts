import { UpdateCodingLessonPayload } from '@/validations/course'
import {
  CreateLessonPayload,
  LessonCodingPayload,
  LessonQuizPayload,
  UpdateTitleLessonPayload,
} from '@/validations/lesson'
import api from '@/configs/api'
import { IMediaQueryParams, IMediaResponse } from '@/types/Common'

const prefix = '/instructor/manage/lessons'

export const instructorLessonApi = {
  getLessonOverview: async (slug: string) => {
    return await api.get(`${prefix}/${slug}`)
  },
  getLessonCoding: async (lessonSlug: string, codingId: number) => {
    return await api.get(`${prefix}/${lessonSlug}/${codingId}/coding-exercise`)
  },
  getLessonVideo: async (chapterId: string, lessonId: string) => {
    return await api.get(`${prefix}/${chapterId}/${lessonId}/show-lesson`)
  },
  getLessonDocument: async (chapterId: string, lessonId: string) => {
    return await api.get(`${prefix}/${chapterId}/${lessonId}/lesson-document`)
  },
  createLesson: (payload: CreateLessonPayload) => {
    return api.post(prefix, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  createLessonVideo: (chapterId: string, payload: FormData): Promise<any> => {
    return api.post(`${prefix}/${chapterId}/store-lesson-video`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  createLessonDocument: (chapterId: string, payload: FormData) => {
    return api.post(`${prefix}/${chapterId}/store-lesson-document`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  createLessonQuiz: (
    chapterId: string,
    payload: LessonQuizPayload
  ): Promise<any> => {
    return api.post(`${prefix}/${chapterId}/store-lesson-quiz`, payload)
  },
  createLessonCoding: (chapterId: string, payload: LessonCodingPayload) => {
    return api.post(`${prefix}/${chapterId}/store-lesson-coding`, payload)
  },
  updateContentLesson: (
    chapterId: number,
    id: number,
    payload: UpdateTitleLessonPayload
  ) => {
    return api.put(`${prefix}/${chapterId}/${id}`, payload)
  },
  updateOrderLesson: async (
    slug: string,
    payload: { lessons: { id: number; order: number }[] }
  ) => {
    return await api.put(
      `${prefix}/${slug}/update-order`,
      {
        lessons: payload.lessons,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  },
  updateLessonVideo: (
    chapterId: string,
    lessonId: string,
    payload: FormData
  ): Promise<any> => {
    return api.post(
      `${prefix}/${chapterId}/${lessonId}/update-lesson-video`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },
  updateLessonDocument: (
    chapterId: string,
    lessonId: string,
    payload: FormData
  ) => {
    return api.post(
      `${prefix}/${chapterId}/${lessonId}/update-lesson-document`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },
  deleteLesson: (chapterId: number, id: number) => {
    return api.delete(`${prefix}/${chapterId}/${id}`)
  },
  updateCodingLesson: ({
    lessonSlug,
    codingId,
    payload,
  }: {
    lessonSlug: string
    codingId: number
    payload: UpdateCodingLessonPayload
  }) => {
    delete payload.checkTestCase

    return api.put(`${prefix}/${lessonSlug}/${codingId}/coding-exercise`, {
      ...payload,
      hints: payload.hints?.map((item) => item?.hint),
      test_case: !payload.ignore_test_case ? payload.test_case : null,
    })
  },
  updateQuizContent: ({
    quizId,
    payload,
  }: {
    quizId: number
    payload: LessonQuizPayload
  }): Promise<any> => {
    return api.put(`${prefix}/quiz/${quizId}/update-quiz-content`, payload)
  },
  getUploadUrl: async () => {
    return await api.get(`/instructor/manage/get-upload-url`)
  },
  getVideoInfo: async (uploadId: string) => {
    return await api.get(`/instructor/manage/get-video-info/${uploadId}`)
  },
  searchMediaItem: async (
    params: IMediaQueryParams
  ): Promise<IMediaResponse> => {
    const res = await api.get(`/instructor/manage/media`, {
      params,
    })
    return res.data
  },
}
