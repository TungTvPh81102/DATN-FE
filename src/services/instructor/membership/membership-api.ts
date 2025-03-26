import api from '@/configs/api'
import { IMembershipPlansResponse } from '@/types'

export const instructorMemberShipApi = {
  getMemberShipPlans: async (
    code: string
  ): Promise<IMembershipPlansResponse> => {
    return await api.get(`get-member-ship-plans/${code}`)
  },
}
