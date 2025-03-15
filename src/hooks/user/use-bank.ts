import QueryKey from '@/constants/query-key'
import { bankApi } from '@/services/bank-api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useGetBanks = () => {
  return useQuery({
    queryKey: [QueryKey.BANKS],
    queryFn: bankApi.getBanks,
  })
}

export const useAddBank = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bankApi.addBank,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.BANKS],
      })
      toast.success(res.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export const useUpdateBank = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bankApi.updateBank,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.BANKS],
      })
      toast.success(res.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export const useDeleteBank = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      return toast.promise(bankApi.deleteBank(id), {
        pending: 'Đang xử lý...',
        success: {
          render: ({ data }) => data.message as string,
        },
        error: {
          render: ({ data }: { data: { message: string } }) => data.message,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.BANKS],
      })
    },
  })
}

export const useSetDefaultBank = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      return toast.promise(bankApi.setDefault(id), {
        pending: 'Đang xử lý...',
        success: {
          render: ({ data }) => data.message as string,
        },
        error: {
          render: ({ data }: { data: { message: string } }) => data.message,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.BANKS],
      })
    },
  })
}
