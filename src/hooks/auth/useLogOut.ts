'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { authApi } from '@/services/auth/authApi'
import { useWishListStore } from '@/stores/useWishListStore'

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

      queryClient.clear()
      setWishList([])

      toast.success(res?.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
