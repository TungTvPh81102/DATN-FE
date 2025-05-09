import { IAuthData, IRole, IUser } from '@/types'
import api from '@/configs/api'
import { ResetPasswordPayload } from '@/validations/auth'
import { Role } from '@/constants/role'

interface SignInResponse {
  message: string
  user: IUser & {
    roles: IRole[]
  }
  role: Role
  token: string
  expires_at: Date
}

export const authApi = {
  signUp: async (formData: IAuthData) => {
    return await api.post('auth/sign-up', formData)
  },
  signIn: async (formData: IAuthData): Promise<SignInResponse> => {
    return await api.post('auth/sign-in', formData)
  },
  logout: async () => {
    return await api.post('auth/logout')
  },
  getUserWithToken: async () => {
    return await api.get('auth/get-user-with-token')
  },
  googleRedirect: async () => {
    const res = await api.get('auth/google')
    return res.data
  },
  googleCallback: async (query: string) => {
    return await api.get(`auth/google/callback?${query}`)
  },
  forgotPassword: async (email: string) => {
    return await api.post('auth/forgot-password', { email })
  },
  resetPassword: async (data: ResetPasswordPayload) => {
    return await api.post('auth/reset-password', data)
  },
  getOnlineUsers: async () => {
    return await api.get(`auth/online-users`)
  },
}
