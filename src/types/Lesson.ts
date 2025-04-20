export interface MoveLessonPayload {
  slug: string
  sourceChapterId: number
  targetChapterId: number
  lessonIds: number[]
  preserveOrder: boolean
}
