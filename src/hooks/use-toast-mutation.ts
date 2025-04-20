'use client'

import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useToastMutation = <TData = unknown, TVariables = unknown>({
  mutationFn,
  onSuccess,
  onError,
  queryKey,
  queryKeys,
  pendingMessage = 'Đang xử lý...',
}: {
  mutationFn: MutationFunction<TData, TVariables>
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: unknown
  ) => Promise<unknown> | unknown
  onError?: (
    error: Error,
    variables: TVariables,
    context: unknown
  ) => Promise<unknown> | unknown
  queryKey?: string[]
  queryKeys?: string[][]
  pendingMessage?: string
}) => {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    mutationFn: (payload) => {
      return toast.promise(mutationFn(payload), {
        pending: pendingMessage,
        success: {
          render: ({ data }) => (data as any)?.message as string,
        },
        error: {
          render: ({ data }: { data: { message: string } }) => data.message,
        },
      })
    },
    onSuccess: (data, variables, context) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey })
      }

      if (queryKeys) {
        queryKeys.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
      onSuccess?.(data, variables, context)
    },
    onError,
  })
}
