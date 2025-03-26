import { useMutation, useQueryClient } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { transationApi } from '@/services/transation/transation-api'

export const useEnrollFreeCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => transationApi.enrollFreeCourse(courseId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.USER_GET_MY_COURSES],
      })
    },
  })
}

export const useApplyCoupon = () => {
  return useMutation({
    mutationFn: (data: any) => transationApi.applyCoupon(data),
  })
}

export const useDeleteApplyCoupon = () => {
  return useMutation({
    mutationFn: (data: { code: string }) =>
      transationApi.deleteApplyCoupon(data),
  })
}
