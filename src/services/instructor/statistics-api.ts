import api from '@/configs/api'
import {
  CourseRevenueStatistics,
  IMembershipsRevenueStatistics,
  OverviewStatistics,
  RevenueStatistics,
  StudentPurchaseStatistics,
} from '@/types/Statistics'

const prefix = '/instructor/statistics'

export const instructorStatisticApi = {
  getOverviewStatistics: async (): Promise<OverviewStatistics> => {
    const res = await api.get(`${prefix}/get-course-overview`)
    return res.data
  },

  getMonthlyRevenueStatistics: async (
    year: number
  ): Promise<RevenueStatistics> => {
    const res = await api.get(`${prefix}/get-month-revenue`, {
      params: {
        year,
      },
    })
    return res.data
  },

  getStudentPurchaseStatistics: async (
    year: number
  ): Promise<StudentPurchaseStatistics> => {
    const res = await api.get(`${prefix}/get-monthly-course-statistics`, {
      params: {
        year,
      },
    })
    return res.data
  },

  getCourseRevenueStatistics: async (): Promise<CourseRevenueStatistics[]> => {
    const res = await api.get(`${prefix}/get-course-revenue`)
    return res.data
  },

  getFollowStatistics: async (year: number | undefined) => {
    const res = await api.get(`${prefix}/follows`, {
      params: {
        year,
      },
    })
    return res.data
  },

  getRatingStatistics: async (params: {
    course_id?: string
    date_from?: string
    date_to?: string
  }) => {
    const res = await api.get(`${prefix}/ratings`, {
      params,
    })
    return res.data
  },

  getMonthlyMembershipsRevenue: async (): Promise<
    IMembershipsRevenueStatistics[]
  > => {
    const res = await api.get(`${prefix}/get-monthly-memberships-revenue`)
    return res.data
  },
}
