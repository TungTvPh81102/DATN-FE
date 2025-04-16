import { BankInfo } from '@/validations/bank'

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export interface IUser {
  id: number
  code: string
  name: string
  email: string
  email_verified_at: Date | null
  // password: string
  avatar: string
  verification_token: string | null
  remember_token: string | null
  status: UserStatus
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
  is_temporary: 0 | 1
}

export interface ISocialAccount {
  id?: number
  userId?: number
  provider: string
  providerId?: string
  avatar?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface IRole {
  id: number
  name: string
  guard_name: string
  description: string
  created_at: Date
  updated_at: Date
  pivot: {
    model_type: string
    model_id: number
    role_id: number
  }
}

export interface Profile {
  id: number
  user_id: number
  about_me: string
  phone: string
  address: string
  experience: string | null
  bio: string | null
  certificates: string[] | null
  qa_systems: QASystem[] | null
  banking_info: BankInfo[] | null
  identity_verification: null
  created_at: Date
  updated_at: Date
  careers: any[]
}

export interface UserWithProfile extends IUser {
  profile: Profile | null
}

interface QASystem {
  options: string[]
  question: string
  selected_options: number[]
}
