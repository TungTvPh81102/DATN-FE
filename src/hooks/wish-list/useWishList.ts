import { useWishListStore } from '@/stores/useWishListStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CreateWishListPayload } from '@/validations/wish-list'
import QueryKey from '@/constants/query-key'
import { wishListApi } from '@/services/wish-list/wish-list-api'

export const useGetWishLists = () => {
  return useQuery({
    queryKey: [QueryKey.WISH_LIST],
    queryFn: () => wishListApi.getWishLists(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useCreateWishList = () => {
  const queryClient = useQueryClient()
  const addToWishList = useWishListStore((state) => state.addToWishList)

  return useMutation({
    mutationFn: (data: CreateWishListPayload) =>
      wishListApi.createWishList(data),
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.WISH_LIST],
      })
      addToWishList(res?.data.course_id)

      const successMessage = res?.message

      toast.success(successMessage)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteWishList = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => wishListApi.deleteWishList(id),
    onSuccess: async (res: any) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.WISH_LIST],
      })

      const successMessage = res?.message

      toast.success(successMessage)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
