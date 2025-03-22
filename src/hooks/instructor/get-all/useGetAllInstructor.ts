import { useQuery } from '@tanstack/react-query'
import QUERY_KEY from '@/constants/query-key'
import { instructorApi } from '@/services/instructor/get-all/get-all-api'

export const useGetAllInstructor = () => {
  return useQuery({
    queryKey: [QUERY_KEY.INSTRUCTOR_ALL],
    queryFn: () => instructorApi.getAll(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetTopInstructors = () => {
  return useQuery({
    queryKey: [QUERY_KEY.INSTRUCTOR_TOP],
    queryFn: () => instructorApi.getTopInstructors(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
