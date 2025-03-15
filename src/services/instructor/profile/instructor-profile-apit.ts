import api from '@/configs/api'
import {
  IInstructorCourseResponse,
  IInstructorFollow,
  IInstructorProfileResponse,
} from '@/types'

export const instructorProfileApi = {
  getProfile: async (code: string): Promise<IInstructorProfileResponse> => {
    return await api.get(`instructor-info/${code}`)
  },
  getCourses: async (
    code: string,
    page: number
  ): Promise<IInstructorCourseResponse> => {
    return await api.get(`get-course-instructor/${code}?${page}`)
  },
  checkFollow: async (code: string): Promise<IInstructorFollow> => {
    return await api.get(`instructors/${code}/follow-status`)
  },
  followInstructor: async (code: string) => {
    return await api.put(`users/follow/${code}`)
  },
}
