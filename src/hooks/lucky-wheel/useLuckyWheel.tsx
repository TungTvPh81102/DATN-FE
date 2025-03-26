import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import QueryKey from '@/constants/query-key'
import { luckyWheelApi } from '@/services/lucky-wheel/lucky-wheel-api'
import { toast } from 'react-toastify'

export const useGetRewards = () => {
  return useQuery({
    queryKey: [QueryKey.WHEEL_REWARDS],
    queryFn: () => luckyWheelApi.getRewards(),
  })
}

export const useGetSpinTurn = () => {
  return useQuery({
    queryKey: [QueryKey.WHEEL_TURN],
    queryFn: () => luckyWheelApi.getSpinTurn(),
  })
}
export const useGetSpinHistory = () => {
  return useQuery({
    queryKey: [QueryKey.WHEEL_SPIN_HISTORY],
    queryFn: () => luckyWheelApi.getSpinHistory(),
  })
}

export const useSpinRun = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => luckyWheelApi.spinRun(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.WHEEL_TURN],
      })
      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: [QueryKey.WHEEL_SPIN_HISTORY],
        })
      }, 5000)
    },
    onError: (error: any) => {
      toast.error(error?.message || 'loi quay')
    },
  })
}
