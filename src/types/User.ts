export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Banned = 'banned',
}

export interface IUser {
  id?: number
  code: string
  name?: string
  email: string
  emailVerifiedAt?: Date | null
  password: string
  avatar?: string | null
  verificationToken?: string | null
  rememberToken?: string | null
  status: UserStatus
  deletedAt?: Date | null
  createdAt?: Date | null
  updatedAt?: Date | null
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
