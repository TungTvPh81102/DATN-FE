import { IUser } from '@/types/User'

import { BadgeProps } from '@/components/ui/badge'

import { ICategory } from './Category'
import { IQuiz } from './Quiz'
import { IInstructorProfile } from '@/types/Instructor'
import { IUserRating } from '@/types/Misc'

export enum CourseStatus {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Reject = 'rejected',
  ModifyRequest = 'modify_request',
}

export const CourseStatusMap: Record<
  CourseStatus,
  { label: string; badge: BadgeProps['variant'] }
> = {
  [CourseStatus.Draft]: { label: 'Bản nháp', badge: 'secondary' },
  [CourseStatus.Pending]: { label: 'Chờ duyệt', badge: 'info' },
  [CourseStatus.Approved]: { label: 'Đã duyệt', badge: 'success' },
  [CourseStatus.Reject]: { label: 'Từ chối', badge: 'error' },
  [CourseStatus.ModifyRequest]: { label: 'Sửa đổi', badge: 'warning' },
}

export interface ICourse {
  id?: number
  user_id?: number
  category_id?: number
  category?: ICategory
  code: string
  name: string
  slug: string
  thumbnail: string
  intro?: string | null
  price?: number | null
  price_sale?: number | null
  description?: string | null
  content?: string | null
  level?: string | null
  duration?: number | string | null
  total_student?: number
  total_lesson?: number
  total_duration?: string
  requirements?: string | string[]
  benefits?: string | string[]
  qa?: { question: string; answer: string }[]
  is_popular?: 0 | 1
  status: CourseStatus
  chapters?: IChapter[]
  lessons_count?: number
  chapters_count?: number
  ratings_count?: number
  avg_rating?: string
  total_rating?: string
  accepted?: Date | null
  user: IUser
  name_instructor: string
  code_instructor: string
  avatar_instructor: string
  deleted_at?: Date | null
  created_at?: Date | null
  updated_at?: Date | null
  is_free?: 0 | 1
  total_video_duration?: number
  is_enrolled?: boolean
  is_practical_course?: boolean
}

export interface CoursePreview {
  id: number
  code: string
  name: string
  thumbnail: string
  total_student: number
  price: number
  created_at: Date
}

export interface IChapter {
  id?: number
  courseId?: number
  title: string
  order?: number | null
  lessons?: ILesson[]
  lessons_count?: number
  total_video_duration?: number
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface ILesson {
  id?: number
  slug?: string
  chapter_id?: number
  title: string
  duration?: number | null
  content: string
  playbackId?: string | null
  is_free_preview?: 0 | 1
  order?: number | null
  type: LessonType
  lessonable_id?: number
  lessonable?: Lessonable
  created_at: string
  updated_at: string
  chapter?: IChapter
}

export interface Lessonable {
  id: number
  title: string
  created_at: Date
  updated_at: Date

  // Quiz
  questions?: IQuiz[]

  // Video
  type?: string
  url?: string
  asset_id?: string
  mux_playback_id?: string
  duration?: number

  // Document
  content?: string
  file_path?: string
  file_type?: string

  // Coding
  language?: string
  hints?: string[]
  instruct?: string
  sample_code?: string
  result_code?: string
  solution_code?: string
}

export type LessonType = 'video' | 'quiz' | 'document' | 'coding'

export interface ILessonProcess {
  id: number
  user_id: number
  lesson_id: number
  is_completed: number
  last_time_video: number
  created_at: Date
  updated_at: Date
}

export interface ICourseUser {
  id?: number
  userId?: number
  courseId?: number
  progressPercent: number
  enrolledAt?: Date | null
  completedAt?: Date | null
  createdAt?: Date | null
  updatedAt?: Date | null
}

export type SortType = 'price_asc' | 'price_desc'
export type LevelType = 'beginner' | 'intermediate' | 'advanced'
export type FeatureType = 'document' | 'video' | 'quiz' | 'coding'
export type PriceType = 'free' | 'price' | 'price_sale'

export interface ICourseFilter {
  categories?: string[]
  instructors?: string[]
  levels?: Array<LevelType>
  features?: Array<FeatureType>
  price?: PriceType
  rating?: number
  page?: number
  sort_by?: SortType
}

export interface ILinkPagination {
  url?: string | null
  label: string
  active: boolean
}

export interface ICourseDataResponse {
  current_page: number
  data: ICourse[]
  first_page_url: string
  last_page_url: string
  from: number
  to: number
  last_page: number
  links: ILinkPagination[]
  next_page_url?: string | null
  prev_page_url?: string | null
  path: string
  per_page: number
  total: number
}

export interface ICourseRelatedResponse {
  current_course: ICourse
  related_courses: ICourse[]
}

export interface ICourseOtherResponse {
  message?: string
  get_other_courses: ICourse[]
  profile_instructor: IInstructorProfile
}

export interface ICourseRatingsResponse {
  message: string
  data: {
    ratings: IUserRating[]
    total_ratings: number
    average_rating: number
  }
}

export interface IPracticeExerciseRating {
  count: number
  average: number
}

export interface IPracticeExercise extends ICourse {
  ratings: IPracticeExerciseRating
}

export interface IPracticeExerciseResponse {
  message: string
  data: IPracticeExercise[]
}
