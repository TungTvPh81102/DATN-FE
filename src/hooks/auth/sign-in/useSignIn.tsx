'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import api from '@/configs/api'
import QueryKey from '@/constants/query-key'
import StorageKey from '@/constants/storage-key'
import { authApi } from '@/services/auth/authApi'
import { IAuthData } from '@/types'

export const useSignIn = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
  const setRole = useAuthStore((state) => state.setRole)

  return useMutation({
    mutationFn: (data: IAuthData) => authApi.signIn(data),
    onSuccess: async (res) => {
      const token = res?.token
      const user = res?.user
      const role = res.role

      const currentToken = Cookies.get(StorageKey.ACCESS_TOKEN)

      if (token && currentToken !== token) {
        setToken(token)
        setUser(user)
        setRole(role)

        setTimeout(() => {
          api.get('/auth/get-user-with-token')
        }, 500)

        if (role === 'instructor') {
          router.push('/instructor')
        } else {
          router.push('/')
        }

        toast.success(res?.message)

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [QueryKey.AUTH] }),
          queryClient.invalidateQueries({
            queryKey: [QueryKey.USER_NOTIFICATION],
          }),
        ])

        await queryClient.invalidateQueries({ queryKey: [QueryKey.WISH_LIST] })
      } else {
        toast.error('Đăng nhập thất bại, vui lòng thử lại')
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
