import { CouponPayload } from '@/validations/coupon'
import api from '@/configs/api'
import { Coupon } from '@/types'

const prefix = 'instructor/coupons'

export const instructorCouponApi = {
  getCoupons: async (): Promise<Coupon[]> => {
    const res = await api.get(`${prefix}`)
    return res.data
  },
  getCoupon: async (id: string) => {
    return await api.get(`${prefix}/${id}`)
  },
  createCoupon: async (data: CouponPayload) => {
    return await api.post(`${prefix}`, data)
  },
  updateCoupon: async (id: string, data: CouponPayload) => {
    return await api.put(`${prefix}/${id}`, data)
  },
  toggleStatus: async (id: string, action: string) => {
    return await api.put(`${prefix}/${id}/${action}`)
  },
}
