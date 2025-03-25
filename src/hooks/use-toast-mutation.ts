'use client'

import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useToastMutation = ({
  mutationFn,
  queryKey,
  queryKeys,
  onSuccess,
  onError,
}: {
  mutationFn: MutationFunction<any, any>
  queryKey?: string[]
  queryKeys?: string[][]
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: any) => {
      return toast.promise(mutationFn(payload), {
        pending: 'Đang xử lý...',
        success: {
          render: ({ data }) => data.message as string,
        },
        error: {
          render: ({ data }: { data: { message: string } }) => data.message,
        },
      })
    },
    onSuccess: (data) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey })
      }

      if (queryKeys) {
        queryKeys.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
      onSuccess?.(data)
    },
    onError,
  })
}
