export interface OverviewStatistics {
  totalCourse: number
  totalEnrollments: number
  totalRevenue: string
  averageRating: string
}

export interface RevenueStatistics {
  [key: string]: null | string
}

export interface StudentPurchaseStatistics {
  [key: string]: {
    total_purchases: number
    total_students: number
  }
}

export interface CourseRevenueStatistics {
  id: number
  name: string
  price: string
  price_sale: string
  slug: string
  thumbnail: string
  total_student: number
  name_category: string
  slug_category: string
  icon_category: null
  total_revenue: string
  avg_progress: string | null
  avg_rating: string
}

export interface IFollowStatistics {
  month: number
  count: number
}

export interface IRatingStatistics {
  rating: number
  count: number
  label: string
  percentage: number
}
