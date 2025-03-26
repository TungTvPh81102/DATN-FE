import api from '@/configs/api'

const prefix = '/courses'

export const homeCoursesApi = {
  getDiscountedCourses: async () => {
    return await api.get(`${prefix}/discounted`)
  },
  getFreeCourses: async () => {
    return await api.get(`${prefix}/free`)
  },
  getCategoriesCourses: async () => {
    return await api.get(`${prefix}/top-categories-with-most-courses`)
  },
}
