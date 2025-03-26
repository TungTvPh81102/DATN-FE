import api from '@/configs/api'
import { Membership, MembershipDetail } from '@/types/membership'
import { MembershipPayload } from '@/validations/membership'

const prefix = '/instructor/member-ship-plans'

export const memberShipApi = {
  getMemberships: async (): Promise<Membership[]> => {
    const res = await api.get(`${prefix}`)
    return res.data
  },

  getMembership: async (code: string): Promise<MembershipDetail> => {
    const res = await api.get(`${prefix}/${code}`)
    return res.data
  },

  createMembership: (
    payload: Omit<MembershipPayload, 'code'>
  ): Promise<{ message: string; data: any }> => {
    return api.post(`${prefix}`, {
      ...payload,
      benefits: payload.benefits.map((benefit) => benefit.value),
    })
  },

  updateMembership: ({
    code,
    ...payload
  }: MembershipPayload): Promise<{ message: string; data: any }> => {
    return api.put(`${prefix}/${code}`, {
      ...payload,
      benefits: payload.benefits.map((benefit) => benefit.value),
    })
  },

  toggleStatusMembership: (
    code: string
  ): Promise<{ message: string; data: any }> => {
    return api.put(`${prefix}/${code}/enable`)
  },

  sendMembershipRequest: (
    code: string
  ): Promise<{ message: string; data: any }> => {
    return api.post(`${prefix}/send-request-membership-plan/${code}`)
  },
}
