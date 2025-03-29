import { ICourse, ICourseDataResponse } from '@/types/Course'

export interface IInstructorProfile {
  id?: number
  user_id?: number
  code: string
  phone?: string
  address?: string | null
  experience?: string | null
  bio?: string[] | null
  avatar?: string | null
  email?: string
  name: string
  about_me?: string | null
  avg_rating?: string | null
  total_student?: string | null
  total_courses?: number | null
  total_followers?: number
  created_at: Date
  updated_at: Date
}

export interface IInstructorResponse {
  has_more: boolean
  instructors: {
    id: number
    name: string
    email: string
    code: string
    avatar?: string | null
    total_approved_courses: number
  }[]
}

export interface IInstructorEducation {
  id?: number
  instructorProfileId?: number
  institutionName?: string | null
  degree?: string | null
  major?: string | null
  startDate?: Date | null
  endDate?: Date | null
  certificates?: string[]
  qaSystems?: string[]
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface IQuestionTeacher {
  id: number
  title: string
  description: string
  question: string
  options: string[]
}

export interface IInstructorProfileResponse {
  message: string
  instructor: IInstructorProfile
}

export interface IInstructorCourseResponse {
  message: string
  courses: InstructorCourses
}

export interface InstructorCourses extends Omit<ICourseDataResponse, 'data'> {
  data: InstructorCourse[]
}

export interface InstructorCourse
  extends Pick<
    ICourse,
    | 'id'
    | 'name'
    | 'slug'
    | 'thumbnail'
    | 'price'
    | 'price_sale'
    | 'is_free'
    | 'total_student'
  > {
  avg_rating: string
  lessons_count: number
}

export interface IInstructorFollow {
  followed: boolean
}

export interface IPivot {
  membership_plan_id: number
  course_id: number
}

export interface IMembershipCourse {
  id: number
  code: string
  name: string
  slug: string
  thumbnail?: string | null
  pivots: IPivot
}

export interface IParticipatedMembership {
  id: number
  membership_plan_name: string
  student_name: string
  student_avatar?: string | null
  duration_months: number
  amount_paid: string
  invoice_code: string
  invoice_created_at: string
  status: string
}

export interface IMembership {
  id: number
  code: string
  name: string
  description?: string
  price: string
  duration_months: number
  benefits?: string[]
  status: string
  membership_course_access: IMembershipCourse[]
}

export interface IMembershipPlansResponse {
  message: string
  data: IMembership[]
}

export interface ITopInstructorResponse {
  message: string
  data: IInstructorProfile[]
}

export interface IParticipatedMembershipResponse {
  message: string
  data: IParticipatedMembership[]
}
