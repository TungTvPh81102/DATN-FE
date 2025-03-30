import { useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { instructorTransationApi } from '@/services/instructor/transaction/instructor-transaction-api'

export const useGetParticipatedCourses = (filters?: {
  fromDate?: string | undefined
  toDate?: string | undefined
}) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_GET_PARTICIPATED_COURSE, filters],
    queryFn: () => instructorTransationApi.getParticipatedCourses(filters),
  })
}

export const useGetParticipatedMembership = (filters?: {
  fromDate?: string | undefined
  toDate?: string | undefined
}) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_GET_PARTICIPATED_MEMBERSHIP, filters],
    queryFn: () => instructorTransationApi.getParticipatedMembership(filters),
  })
}
