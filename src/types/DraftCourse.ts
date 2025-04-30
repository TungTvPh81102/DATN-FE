import { LessonType } from './Course'

export interface DraftCourse {
  title: string
  status: string
  chapters: DraftChapter[]
}

export interface DraftChapter {
  title: string
  total_duration: number
  total_lessons: number
  lessons: DraftLesson[]
}

export interface DraftLesson {
  title: string
  updated_at: Date
  type: LessonType
  student_code?: string
  hints?: string[]
  instruct?: null
  language?: string
  mux_playback_id?: string
  duration?: number
  content?: string
  file_type?: string
  file_path?: string
  questions?: DraftQuestion[]
}

export interface DraftQuestion {
  answer_type: string
  question: string
  answers: DraftAnswer[]
}

export interface DraftAnswer {
  answer: string
  is_correct: boolean
}
