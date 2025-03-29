import api from '@/configs/api'
import { IParticipatedMembershipResponse } from '@/types'

const prefix = 'instructor/transactions'

export const instructorTransationApi = {
  getParticipatedCourses: async (params?: {
    fromDate?: string | undefined
    toDate?: string | undefined
  }) => {
    return await api.get(`${prefix}/participated-courses`, {
      params,
    })
  },
  getParticipatedMembership:
    async (): Promise<IParticipatedMembershipResponse> => {
      return await api.get(`${prefix}/participated-membership`)
    },
}
