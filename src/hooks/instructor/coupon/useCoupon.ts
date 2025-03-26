import { useMutation, useQuery } from '@tanstack/react-query'

import { CouponPayload } from '@/validations/coupon'
import QueryKey from '@/constants/query-key'
import { instructorCouponApi } from '@/services/instructor/coupon/coupon-api'
import { useToastMutation } from '@/hooks/use-toast-mutation'

export const useGetCoupons = () => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_COUPON],
    queryFn: () => instructorCouponApi.getCoupons(),
  })
}

export const useGetCoupon = (id: string) => {
  return useQuery({
    queryKey: [QueryKey.INSTRUCTOR_COUPON, id],
    queryFn: () => instructorCouponApi.getCoupon(id),
    enabled: !!id,
  })
}

export const useCreateCoupon = () => {
  return useMutation({
    mutationFn: (data: CouponPayload) => instructorCouponApi.createCoupon(data),
  })
}

export const useUpdateCoupon = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CouponPayload }) =>
      instructorCouponApi.updateCoupon(id, data),
  })
}

export const useToggleStatus = () => {
  return useToastMutation({
    mutationFn: instructorCouponApi.toggleStatus,
    queryKey: [QueryKey.INSTRUCTOR_COUPON],
  })
}
