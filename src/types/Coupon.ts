import { BadgeProps } from '@/components/ui/badge'

export enum DiscountType {
  Fixed = 'fixed',
  Percentage = 'percentage',
}

export const DiscountTypeMap: Record<
  DiscountType,
  { label: string; badge: BadgeProps['variant'] }
> = {
  [DiscountType.Fixed]: { label: 'Cố định', badge: 'info' },
  [DiscountType.Percentage]: { label: 'Phần trăm', badge: 'success' },
}

export interface Coupon {
  id: number
  user_id: number
  code: string
  name: string
  discount_type: `${DiscountType}`
  discount_value: string
  discount_max_value: string
  start_date: Date
  expire_date: Date | null
  description: string | null
  max_usage: number | null
  used_count: number
  status: 0 | 1
  specific_course: number
  deleted_at: Date | null
  created_at: Date
  updated_at: Date
  probability: null
}

export interface ICoupon {
  id?: number
  userId?: number
  name: string
  code: string
  description?: string | null
  discountType?: DiscountType
  discountValue: number
  startTime: Date
  endTime: Date
  usedCount: number
  status?: 0 | 1
  deletedAt?: Date | null
  createdAt?: Date | null
  updatedAt?: Date | null
}

export enum CouponUseStatus {
  Used = 'used',
  Unused = 'unused',
}

export interface ICouponUse {
  id?: number
  userId?: number
  couponId?: number
  status?: CouponUseStatus
  appliedAt?: Date | null
  expiresAt?: Date | null
  createdAt?: Date | null
  updatedAt?: Date | null
}
