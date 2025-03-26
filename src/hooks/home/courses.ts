import { useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { homeCoursesApi } from '@/services/home/courses-api'

export const useGetDiscountedCourses = () => {
  return useQuery({
    queryKey: [QueryKey.COURSES_DISCOUNTED],
    queryFn: homeCoursesApi.getDiscountedCourses,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetFreeCourses = () => {
  return useQuery({
    queryKey: [QueryKey.COURSES_FREE],
    queryFn: async () => await homeCoursesApi.getFreeCourses(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCategoryCourses = () => {
  return useQuery({
    queryKey: [QueryKey.COURSES_CATEGORIES],
    queryFn: async () => await homeCoursesApi.getCategoriesCourses(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
