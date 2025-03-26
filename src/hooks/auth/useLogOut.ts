'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { authApi } from '@/services/auth/authApi'
import { useWishListStore } from '@/stores/useWishListStore'
import QueryKey from '@/constants/query-key'

export const useLogOut = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()
  const setWishList = useWishListStore((state) => state.setWishList)

  return useMutation({
    mutationFn: async () => authApi.logout(),
    onSuccess: async (res: any) => {
      logout()

      localStorage.clear()

      router.push('/')

      queryClient.removeQueries({ queryKey: [QueryKey.USER_NOTIFICATION] })
      queryClient.removeQueries({ queryKey: [QueryKey.WISH_LIST] })

      setWishList([])

      toast.success(res?.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
