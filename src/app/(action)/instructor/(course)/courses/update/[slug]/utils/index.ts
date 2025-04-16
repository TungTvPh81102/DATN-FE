import { IChapter } from '@/types'

export const hasCodingLesson = (chapters: IChapter[]) => {
  return chapters.some((chapter) =>
    chapter.lessons?.some((lesson) => lesson.type === 'coding')
  )
}
