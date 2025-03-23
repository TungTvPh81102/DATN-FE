import {
  CreateCoursePayload,
  RequestModifyContentPayload,
  UpdateCourseObjectivePayload,
} from '@/validations/course'
import api from '@/configs/api'
import { CoursePreview, ICourse } from '@/types'

const prefix = '/instructor/manage/courses'

export interface GetCoursesParams {
  type?: 'course' | 'practical-course'
}

export const instructorCourseApi = {
  // GET COURSES
  getCourses: async (params?: GetCoursesParams): Promise<ICourse[]> => {
    const res = await api.get(prefix, {
      params,
    })
    return res.data
  },
  getCourseOverview: async (slug: string) => {
    return await api.get(`${prefix}/${slug}`)
  },
  getApprovedCourses: async (): Promise<CoursePreview[]> => {
    const res = await api.get(`${prefix}/course-approved`)
    return res.data
  },

  // MUTATE COURSES
  createCourse: (payload: CreateCoursePayload) => {
    return api.post(prefix, payload)
  },
  updateCourseOverView: (slug: string, data: FormData) => {
    return api.post(`${prefix}/${slug}/courseOverView`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
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
  exportQuiz: async (quizId: string) => {
    return await api.get(
      `/instructor/manage/lessons/quiz/export-quiz/${quizId}`,
      {
        responseType: 'blob',
      }
    )
  },
  validateCourse: (slug: string) => {
    return api.get(`${prefix}/${slug}/validate-course`)
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
  getCoursesFormTrash: async (): Promise<any> => {
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
