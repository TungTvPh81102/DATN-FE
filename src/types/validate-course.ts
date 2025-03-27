export interface ValidateCourse {
  progress: number
  completion_status: CompletionStatus
}

export interface CompletionStatus {
  course_overview: Status
  course_objectives: Status
  course_curriculum?: Status
  practice_exercise?: Status
}

export const CompletionStatusMapping: Record<keyof CompletionStatus, string> = {
  course_overview: 'Tổng quan khóa học',
  course_objectives: 'Mục tiêu khóa học',
  course_curriculum: 'Chương trình giảng dạy',
  practice_exercise: 'Bài tập thực hành',
}

export interface Status {
  status: boolean
  errors: string[]
  pass: string[]
}
