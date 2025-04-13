import { useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { instructorStatisticApi } from '@/services/instructor/statistics-api'
import { DateRange } from '@/types/Common'

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

export const useGetFollowStatistics = (year: number) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_STATISTICS_FOLLOW, year],
    queryFn: () => instructorStatisticApi.getFollowStatistics(year),
    enabled: year > 0,
  })
}

export const useGetRatingStatistics = (
  selectedCourse: string,
  dateRange: DateRange
) => {
  return useQuery({
    queryKey: [
      QueryKey.INSTRUCTOR_STATISTICS_RATINGS,
      selectedCourse,
      dateRange,
    ],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (selectedCourse !== 'all') {
        params.course_id = selectedCourse
      }

      if (dateRange.from) {
        params.date_from = dateRange.from.toISOString().split('T')[0]
      }

      if (dateRange.to) {
        params.date_to = dateRange.to.toISOString().split('T')[0]
      }

      const response = await instructorStatisticApi.getRatingStatistics(params)

      response.data = response.data.sort(
        (a: { rating: number }, b: { rating: number }) => a.rating - b.rating
      )

      return response
    },
  })
}

export const useGetMonthlyMembershipRevenueStatistics = () => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_STATISTICS_MEMBERSHIPS_REVENUE],
    queryFn: instructorStatisticApi.getMonthlyMembershipsRevenue,
  })
}
