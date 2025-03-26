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
