import { z } from 'zod'

export const lessonCommentSchema = z.object({
  chapter_id: z.string().optional(),
  lesson_id: z.string().optional(),
  content: z
    .string()
    .min(1, { message: 'Nội dung bình luận không được để trống' }),
})

export const replyLessonCommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Nội dung bình luận không được để trống' }),
})

export type LessonCommentPayload = z.infer<typeof lessonCommentSchema>
export type ReplyLessonCommentPayload = z.infer<typeof replyLessonCommentSchema>
