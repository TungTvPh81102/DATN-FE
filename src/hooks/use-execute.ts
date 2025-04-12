import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { executeApi } from '@/services/execute-api'

export const useExecuteCode = () => {
  return useMutation({
    mutationFn: executeApi.executeCode,
    onSuccess: (res) => {
      if (res.run.code === 0) toast.success('Biên dịch thành công')
      else toast.error('Biên dịch thất bại')
    },
    onError: () => {
      toast.error('Biên dịch thất bại')
    },
  })
}

export const useExecuteTestCase = () => {
  return useMutation({
    mutationFn: executeApi.executeTestCase,
    onError: (error: any) => {
      toast.error(error.response?.data?.message)
    },
  })
}
