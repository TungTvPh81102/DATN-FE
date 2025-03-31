import { z } from 'zod'

export const createNoteSchema = z.object({
  lesson_id: z.number(),
  time: z.number().int(),
  content: z.string().trim().min(1, 'Vui lòng nhập nội dung'),
})

export const updateNoteSchema = z.object({
  lesson_id: z.number(),
  content: z.string().trim().min(1, 'Vui lòng nhập nội dung'),
})

export type CreateNotePayload = z.infer<typeof createNoteSchema>
export type UpdateNotePayload = z.infer<typeof updateNoteSchema>
