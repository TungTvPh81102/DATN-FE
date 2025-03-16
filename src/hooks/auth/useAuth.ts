import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import QUERY_KEY from '@/constants/query-key'
import { authApi } from '@/services/auth/authApi'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import Cookies from 'js-cookie'
import StorageKey from '@/constants/storage-key'
import { ResetPasswordPayload } from '@/validations/auth'
import { useEffect, useState } from 'react'
import echo from '@/lib/echo'
import api from '@/configs/api'

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

export const useGetOnlineUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEY.AUTH_ONLINE],
    queryFn: () => authApi.getOnlineUsers(),
  })
}

export const useAuthOnlineStatus = () => {
  const [onlineUsers, setOnlineUsers] = useState<Record<number, boolean>>({})

  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (!token) return

    echo
      .channel('user-status')
      .listen('UserStatusChanged', (e: { userId: number; status: string }) => {
        setOnlineUsers((prev) => ({
          ...prev,
          [e.userId]: e.status === 'online',
        }))
      })

    const fetchOnlineUsers = async () => {
      try {
        const response = await api.get('/auth/online-users')
        setOnlineUsers(response.data)
      } catch (error) {
        console.error('Failed to fetch online users', error)
      }
    }

    const sendHeartbeat = async () => {
      try {
        await api.get('get-user-with-token')
      } catch (error) {
        console.error('Failed to send heartbeat', error)
      }
    }

    const heartbeatInterval = setInterval(sendHeartbeat, 4 * 60 * 1000)
    const fetchInterval = setInterval(fetchOnlineUsers, 60 * 1000)

    return () => {
      clearInterval(heartbeatInterval)
      clearInterval(fetchInterval)
      echo.leaveChannel('user-status')
    }
  }, [token])

  return { onlineUsers }
}
