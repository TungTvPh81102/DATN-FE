import {
  CreateCoursePayload,
  RequestModifyContentPayload,
  UpdateCourseObjectivePayload,
  UpdateCourseOverViewPayload,
} from '@/validations/course'
import api from '@/configs/api'
import { CoursePreview, ICourse, ITrashCourse } from '@/types'
import { ValidateCourse } from '@/types/validate-course'

const prefix = '/instructor/manage/courses'

export interface GetCoursesParams {
  type: 'course' | 'practical-course'
}

export const instructorCourseApi = {
  // GET COURSES
  getCourses: async (params?: GetCoursesParams): Promise<ICourse[]> => {
    const res = await api.get(prefix, {
      params,
    })
    return res.data
  },
  getCoursesWithPrice: async (): Promise<ICourse[]> => {
    const res = await api.get(`${prefix}/course-with-price`)
    return res.data
  },
  getCourseOverview: async (slug: string): Promise<ICourse> => {
    const res = await api.get(`${prefix}/${slug}`)
    return res.data
  },
  getApprovedCourses: async (): Promise<CoursePreview[]> => {
    const res = await api.get(`${prefix}/course-approved`)
    return res.data
  },

  // MUTATE COURSES
  createCourse: (payload: CreateCoursePayload) => {
    return api.post(prefix, payload)
  },
  updateCourseOverView: ({
    slug,
    payload,
  }: {
    slug: string
    payload: UpdateCourseOverViewPayload
  }) => {
    const finalPayload = {
      ...payload,
      price: payload.is_free === '1' ? 0 : payload.price,
      price_sale: payload.is_free === '1' ? 0 : payload.price_sale,
      thumbnail:
        payload.thumbnail instanceof File ? payload.thumbnail : undefined,
      allow_coding_lesson: payload.allow_coding_lesson ? 1 : 0,
      _method: 'PUT',
    }

    return api.post(`${prefix}/${slug}/courseOverView`, finalPayload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  // updateCourseOverView: (slug: string, data: FormData) => {
  //   return api.post(`${prefix}/${slug}/courseOverView`, data, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   })
  // },
  updateCourseObjective: (
    slug: string,
    payload: UpdateCourseObjectivePayload
  ) => {
    return api.put(`${prefix}/${slug}/courseObjective`, {
      ...payload,
      benefits: payload.benefits.map((benefit) => benefit.value),
      requirements: payload.requirements.map(
        (requirement) => requirement.value
      ),
      qa: payload.qa?.filter(
        (faq) => faq.question.trim() !== '' && faq.answer.trim() !== ''
      ),
    })
  },
  downloadQuizForm: async () => {
    return await api.get(`/instructor/manage/lessons/quiz/download-quiz-form`, {
      responseType: 'blob',
    })
  },
  exportQuiz: async (quizId: number) => {
    return await api.get(
      `/instructor/manage/lessons/quiz/export-quiz/${quizId}`,
      {
        responseType: 'blob',
      }
    )
  },
  validateCourse: async (slug: string): Promise<ValidateCourse> => {
    const { data } = await api.get(`${prefix}/${slug}/validate-course`)
    return data
  },
  submitCourse: (slug: string) => {
    return api.post(`${prefix}/${slug}/submit-course`)
  },
  requestModifyContent: (data: RequestModifyContentPayload) => {
    return api.post(`${prefix}/request-modify-content`, data)
  },
  courseListOfUser: (slug: string) => {
    return api.get(`${prefix}/${slug}/course-list-of-user`)
  },

  // API TRASH
  getCoursesFormTrash: async (): Promise<ITrashCourse[]> => {
    const res = await api.get(`${prefix}/trash`)
    return res.data
  },

  moveCoursesToTrash: (
    ids: number[]
  ): Promise<{
    message: string
    data: any
  }> => api.delete(`${prefix}/move-to-trash`, { data: { ids } }),

  restoreCourses: (
    ids: number[]
  ): Promise<{
    message: string
    data: any
  }> => api.post(`${prefix}/restore`, { ids }),
}
