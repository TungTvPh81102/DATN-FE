import { IUser } from '@/types/User'

import { BadgeProps } from '@/components/ui/badge'

import { ICategory } from './Category'
import { IQuiz, UserQuizSubmissionAnswer } from './Quiz'
import { IInstructorProfile } from '@/types/Instructor'
import { IUserRating } from '@/types/Misc'

export enum CourseStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECT = 'rejected',
  MODIFY_REQUEST = 'modify_request',
}

export const CourseStatusMap: Record<
  CourseStatus,
  { label: string; badge: BadgeProps['variant'] }
> = {
  [CourseStatus.DRAFT]: { label: 'Bản nháp', badge: 'secondary' },
  [CourseStatus.PENDING]: { label: 'Chờ duyệt', badge: 'info' },
  [CourseStatus.APPROVED]: { label: 'Đã duyệt', badge: 'success' },
  [CourseStatus.REJECT]: { label: 'Từ chối', badge: 'error' },
  [CourseStatus.MODIFY_REQUEST]: { label: 'Sửa đổi', badge: 'warning' },
}

export enum CourseVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum Level {
  BEGINNER = 'beginner',
  ADVANCED = 'advanced',
}

export const LevelMap: Record<Level, string> = {
  [Level.BEGINNER]: 'Cơ bản',
  [Level.ADVANCED]: 'Nâng cao',
}

export interface ICourse {
  id: number
  user_id: number
  category_id: number
  code: string
  name: string
  slug: string
  thumbnail: string
  intro: string | null
  price: string
  price_sale: string
  is_free: 0 | 1
  description: null
  level: `${Level}`
  total_student: number
  requirements: string[]
  benefits: string[]
  qa: { question: string; answer: string }[]
  is_popular: 0 | 1
  is_sequential: 0 | 1
  status: `${CourseStatus}`
  visibility: `${CourseVisibility}`
  modification_request: 0 | 1
  accepted: Date | null
  is_practical_course: 0 | 1
  views: number
  deleted_at: Date | null
  created_at: Date
  updated_at: Date
  user: IUser
  category: ICategory
  chapters: IChapter[]
  allow_coding_lesson: 0 | 1
}

export interface CourseDetail extends ICourse {
  chapters_count: number
  lessons_count: number
  is_enrolled: boolean
  total_video_duration: number
  ratings_count: number
  avg_rating: number | null
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
  id: number
  courseId?: number
  title: string
  order: number | null
  lessons: ILesson[]
  lessons_count?: number
  total_video_duration?: number
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface ILesson {
  id: number
  chapter_id: number
  title: string
  slug: string
  content: string
  is_free_preview: 0 | 1
  order: number
  type: LessonType
  lessonable_id: number
  lessonable_type: string
  is_supplement?: number
  status: string
  is_new: 0 | 1
  created_at: Date
  updated_at: Date
  chapter?: IChapter
  lessonable?: Lessonable
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
  file_type?: 'upload' | 'url'

  // Coding
  language?: string
  hints?: string[]
  instruct?: string
  student_code?: string
  test_case?: string

  user_submitted_answers?: UserQuizSubmissionAnswer[]
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
  data: CourseFiltered[]
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

export interface CourseFiltered
  extends Pick<
    ICourse,
    | 'id'
    | 'user_id'
    | 'category_id'
    | 'name'
    | 'slug'
    | 'thumbnail'
    | 'price'
    | 'price_sale'
    | 'is_free'
    | 'level'
    | 'total_student'
    | 'status'
  > {
  total_rating: null | string
  lessons_count: number
  user: Pick<IUser, 'id' | 'name' | 'code'>
}

export interface ICourseRelatedResponse {
  current_course: {
    id: number
    name: string
    category: string
  }
  related_courses: RelatedCourse[]
}

export interface RelatedCourse
  extends Pick<
    ICourse,
    | 'id'
    | 'name'
    | 'slug'
    | 'thumbnail'
    | 'level'
    | 'is_free'
    | 'price'
    | 'price_sale'
    | 'total_student'
  > {
  lessons_count: number
  total_video_duration: number
  ratings_count: number
  average_rating: number
  category: {
    id: number
    name: string
  }
  user: Pick<IUser, 'id' | 'name' | 'avatar' | 'code'>
}

export interface ICourseOtherResponse {
  message?: string
  get_other_courses: OtherCourse[]
  profile_instructor: IInstructorProfile
}

export interface OtherCourse
  extends Pick<
    ICourse,
    'code' | 'name' | 'slug' | 'price' | 'price_sale' | 'thumbnail' | 'is_free'
  > {
  name_instructor: string
  code_instructor: string
  avatar_instructor: string
  total_lesson: number
  total_duration: string
  avg_rating: string | null
  total_rating: number
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

export interface IPracticeExercise
  extends Pick<
    ICourse,
    'id' | 'name' | 'slug' | 'thumbnail' | 'is_free' | 'price' | 'price_sale'
  > {
  ratings: IPracticeExerciseRating
  lessons_count: number
  category: Pick<ICategory, 'id' | 'name' | 'slug'>
  user: Pick<IUser, 'id' | 'name' | 'avatar' | 'code'>
}

export interface IPracticeExerciseResponse {
  message: string
  data: IPracticeExercise[]
}

export interface ITrashCourse
  extends Pick<
    ICourse,
    | 'id'
    | 'category_id'
    | 'name'
    | 'slug'
    | 'thumbnail'
    | 'intro'
    | 'price'
    | 'price_sale'
    | 'total_student'
    | 'status'
    | 'is_free'
    | 'deleted_at'
    | 'created_at'
    | 'updated_at'
  > {
  category: {
    id: number
    name: string
  }
}
