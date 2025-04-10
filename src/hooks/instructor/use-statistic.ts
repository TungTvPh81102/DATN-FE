import { useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { instructorStatisticApi } from '@/services/instructor/statistics-api'

export const useGetOverviewStatistics = () => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_STATISTICS_OVERVIEW],
    queryFn: instructorStatisticApi.getOverviewStatistics,
  })
}

export const useGetMonthlyRevenueStatistics = (year: number) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_STATISTICS_REVENUE, year],
    queryFn: () => instructorStatisticApi.getMonthlyRevenueStatistics(year),
    enabled: year > 0,
  })
}

export const useGetStudentPurchaseStatistics = (year: number) => {
  return useQuery({
    queryKey: [
      QueryKey.INSTRUCTOR_STATISTICS_PURCHASE,
      QueryKey.INSTRUCTOR_STATISTICS_STUDENT,
      year,
    ],
    queryFn: () => instructorStatisticApi.getStudentPurchaseStatistics(year),
    enabled: year > 0,
  })
}

export const useGetCourseRevenueStatistics = () => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_STATISTICS_COURSE_REVENUE],
    queryFn: instructorStatisticApi.getCourseRevenueStatistics,
  })
}

export const useGetMonthlyMembershipRevenueStatistics = () => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_STATISTICS_MEMBERSHIPS_REVENUE],
    queryFn: instructorStatisticApi.getMonthlyMembershipsRevenue,
  })
}
