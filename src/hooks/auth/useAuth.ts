import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import QUERY_KEY from '@/constants/query-key'
import { authApi } from '@/services/auth/authApi'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import Cookies from 'js-cookie'
import StorageKey from '@/constants/storage-key'
import { ResetPasswordPayload } from '@/validations/auth'

export const useGetUserWithToken = () => {
  return useQuery({
    queryKey: [QUERY_KEY.AUTH],
    queryFn: () => authApi.getUserWithToken(),
  })
}

export const useGoogleRedirect = () => {
  return useQuery({
    queryKey: [QUERY_KEY.GOOGLE_REDIRECT],
    queryFn: () => authApi.googleRedirect(),
  })
}

export const useGoogleCallBack = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
  const setRole = useAuthStore((state) => state.setRole)

  return useMutation({
    mutationFn: (query: string) => authApi.googleCallback(query),
    onSuccess: async (res: any) => {
      const token = res?.access_token
      const user = res?.user
      const role = res.role

      Cookies.get(StorageKey.ACCESS_TOKEN)

      if (!token || !user) {
        toast.error('Đăng nhập thất bại, vui lòng thử lại')
        return
      }

      setToken(token)
      setUser(user)
      setRole(role)
      router.push('/')

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AUTH] })

      toast.success(res?.message)

      if (window.opener) {
        window.opener.location.reload()
        window.close()
      } else {
        router.push('/')
      }
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => authApi.resetPassword(data),
  })
}
