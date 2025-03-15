'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGetUserWithToken } from '@/hooks/auth/useAuth'
import { toast } from 'react-toastify'
import StorageKey from '@/constants/storage-key'
import { useAuthStore } from '@/stores/useAuthStore'
import Cookies from 'js-cookie'

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
  const setRole = useAuthStore((state) => state.setRole)

  const { data: user } = useGetUserWithToken()
  const token = searchParams.get('token')

  useEffect(() => {
    const handleAuth = async () => {
      if (!token) {
        toast.error('Đăng nhập thất bại, vui lòng thử lại!')
        router.replace('/sign-in')
        return
      }

      Cookies.set(StorageKey.ACCESS_TOKEN, token, { expires: 7 })
      setToken(token)

      if (user?.data) {
        setUser(user?.data.user)
        setRole(user?.data.role || 'member')

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: 'AUTH_SUCCESS' },
            window.location.origin
          )
          window.close()
          router.replace('/')
        }
      }
    }

    handleAuth()
  }, [token, router, setToken, setUser, setRole, user?.data])
}

export default Page
