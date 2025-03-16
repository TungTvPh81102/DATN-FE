'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

import { IAuthData } from '@/types'
import StorageKey from '@/constants/storage-key'
import { authApi } from '@/services/auth/authApi'
import QueryKey from '@/constants/query-key'
import api from '@/configs/api'

export const useSignIn = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
  const setRole = useAuthStore((state) => state.setRole)

  return useMutation({
    mutationFn: (data: IAuthData) => authApi.signIn(data),
    onSuccess: async (res: any) => {
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

        await queryClient.invalidateQueries({ queryKey: [QueryKey.AUTH] })

        toast.success(res?.message)
      } else {
        toast.error('Đăng nhập thất bại, vui lòng thử lại')
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
