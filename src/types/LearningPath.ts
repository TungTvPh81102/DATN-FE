import { CodeSubmissionPayLoad } from '@/validations/code-submission'
import { QuizSubmissionPayload } from '@/validations/quiz-submission'
import {
  ILesson,
  ILessonProcess,
  Lessonable,
  LessonType,
  Level,
} from './Course'

export interface GetLessonsResponse {
  course_name: string
  course_status: string
  total_lesson: number
  chapter_lessons: LearningPathChapterLesson[]
  is_practical_course: 0 | 1
  level: `${Level}`
}

export interface LearningPathChapterLesson {
  chapter_id: number
  chapter_title: string
  total_chapter_duration: number
  total_lessons: number
  lessons: LearningPathLesson[]
}

export interface LearningPathLesson {
  id: number
  title: string
  type: LessonType
  is_completed: boolean
  is_unlocked: boolean
  order: number
  lessonable: Lessonable
  total_questions?: number
}

export interface GetLessonDetailResponse {
  lesson: ILesson
  next_lesson: ILesson | null
  previous_lesson: ILesson | null
  lesson_process: ILessonProcess
}

export interface CompleteLessonPayload
  extends Partial<CodeSubmissionPayLoad>,
    Partial<QuizSubmissionPayload> {
  current_time?: number
}

export interface UpdateLastTimePayload {
  lesson_id: number
  last_time_video: number
}

export interface LessonAccessResponse {
  can_access: boolean
  next_valid_lesson_id?: number
  next_valid_lesson_title?: string
  last_completed_lesson_index?: number
}
