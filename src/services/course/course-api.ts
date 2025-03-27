import {
  CourseDetail,
  ICourse,
  ICourseDataResponse,
  ICourseFilter,
  ICourseOtherResponse,
  ICourseRatingsResponse,
  ICourseRelatedResponse,
  IPracticeExerciseResponse,
} from '@/types'
import api from '@/configs/api'

const prefix = 'courses'

export const getCourseBySlug = async (slug: string): Promise<ICourse> => {
  const response = await api.get(`instructor/manage/${prefix}/${slug}`)
  return response.data
}

export const getInstructorsCourseBySlug = async (
  slug: string
): Promise<ICourse> => {
  const response = await api.get(`${prefix}/instructors/${slug}`)
  return response.data
}

export const getCourseDetailsBySlug = async (
  slug: string
): Promise<CourseDetail> => {
  const { data } = await api.get(`${prefix}/${slug}`)
  return data
}

export const getCourses = async (
  dataFilters: ICourseFilter
): Promise<ICourseDataResponse> => {
  const { data } = await api.get('/filters', {
    params: dataFilters,
  })
  return data
}

export const getCoursesRelated = async (
  slug: string
): Promise<ICourseRelatedResponse> => {
  const { data } = await api.get(`${prefix}/${slug}/related`)
  return data
}

export const getCoursesOther = async (
  slug: string
): Promise<ICourseOtherResponse> => {
  return await api.get(`${prefix}/${slug}/get-other-courses`)
}

export const getCourseRatings = async (
  slug: string
): Promise<ICourseRatingsResponse> => {
  return await api.get(`get-course-ratings/${slug}`)
}

export const getPracticeExercises =
  async (): Promise<IPracticeExerciseResponse> => {
    return await api.get(`${prefix}/practice-exercises`)
  }
