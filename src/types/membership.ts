import { BadgeProps } from '@/components/ui/badge'

export enum MembershipStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const MembershipStatusMap: Record<
  MembershipStatus,
  { label: string; badge: BadgeProps['variant'] }
> = {
  [MembershipStatus.DRAFT]: { label: 'Bản nháp', badge: 'secondary' },
  [MembershipStatus.PENDING]: { label: 'Chờ duyệt', badge: 'info' },
  [MembershipStatus.ACTIVE]: { label: 'Hoạt động', badge: 'success' },
  [MembershipStatus.INACTIVE]: { label: 'Không hoạt động', badge: 'error' },
}

export interface Membership {
  id: number
  instructor_id: number
  code: string
  name: string
  price: string
  duration_months: number
  status: `${MembershipStatus}`
  created_at: Date
}

export interface MembershipDetail {
  id: number
  instructor_id: number
  code: string
  name: string
  description: string
  price: string
  duration_months: number
  benefits: string[]
  status: `${MembershipStatus}`
  created_at: Date
  updated_at: Date
  membership_course_access: MembershipCourseAccess[]
}

export interface MembershipCourseAccess {
  id: number
  name: string
  slug: string
  thumbnail: string
  pivot: Pivot
}

export interface Pivot {
  membership_plan_id: number
  course_id: number
}
