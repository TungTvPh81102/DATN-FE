import * as z from 'zod'

export const createLiveSessionSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
  start_time: z.string().min(1, 'Thời gian bắt đầu không được để trống'),
})

export const createLiveSessionMessageSchema = z.object({
  message: z
    .string()
    .nonempty({ message: 'Tin nhắn không được để trống' })
    .min(1, { message: 'Tin nhắn phải có ít nhất 1 ký tự' }),
})

export const liveScheduleSchema = z.object({
  title: z
    .string({ required_error: 'Tên sự kiện không được để trống' })
    .min(1, { message: 'Tên sự kiện không được để trống' })
    .max(100, { message: 'Tên sự kiện không được vượt quá 100 ký tự' }),
  description: z.string().optional(),
  starts_at: z.date({ required_error: 'Vui lòng chọn ngày giờ cho sự kiện' }),
  visibility: z.enum(['public', 'unlisted', 'private'], {
    required_error: 'Vui lòng chọn chế độ hiển thị',
    invalid_type_error: 'Chế độ hiển thị không hợp lệ',
  }),
  thumbnail: z.instanceof(File).nullable().optional(),
})

export type CreateLiveStreamPayload = z.infer<typeof createLiveSessionSchema>
export type CreateLiveSessionMessagePayload = z.infer<
  typeof createLiveSessionMessageSchema
>
export type LiveSchedulePayload = z.infer<typeof liveScheduleSchema>
