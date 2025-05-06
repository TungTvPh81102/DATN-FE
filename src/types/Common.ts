export interface ISummary {
  total_courses: number
  completed_lessons: string
  average_progress: number
  completed_courses: number
}

export interface IMembershipPlan {
  id: number
  instructor_id: number
  code: string
  name: string
  description: string
  price: string
  duration_months: number
  benefits: string[]
  status: string
  created_at: string
  updated_at: string
}

export interface IPurchasedMembership {
  id: number
  membership_plan_id: number
  user_id: number
  start_date: string
  end_date: string
  status: string
  created_at: string
  updated_at: string
  membership_plan: IMembershipPlan
}

export interface IMediaItem {
  id: number
  title: string
  type: string
  asset_id: string | undefined
  playback_id?: string | undefined
  duration?: number | undefined
  thumbnail?: string
  created_at: string
  updated_at: string
}

export interface IMediaResponse {
  status: string
  data: IMediaItem[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface IMediaQueryParams {
  search?: string
  type?: string
  user_id?: number
  per_page?: number
  page?: number
  order_by?: string
  direction?: 'asc' | 'desc'
}

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}
