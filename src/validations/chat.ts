import { z } from 'zod'

export const createGroupChatSchema = z.object({
  name: z.string().nonempty('Vui lòng nhập tên nhóm'),
  members: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một thành viên'),
})

export const addMemberGroupChatSchema = z.object({
  members: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một thành viên'),
})

export const messageSchema = z.object({
  conversation_id: z
    .number()
    .int('conversation_id phải là số nguyên')
    .positive('conversation_id phải là số dương'),
  content: z
    .string({ invalid_type_error: 'content phải là chuỗi' })
    .max(255, 'content không được vượt quá 255 ký tự')
    .optional()
    .or(z.undefined()),
  type: z.enum(['text', 'image', 'file', 'video', 'audio'], {
    invalid_type_error:
      'type phải là một trong các giá trị: text, image, file, video, audio',
  }),
  parent_id: z.number().optional(),
  file: z
    .any()
    .refine((file) => {
      if (!file) return true
      if (file instanceof File && file.size <= 10 * 1024 * 1024) return true
      return false
    }, 'File có kích thước tối đa 10MB')
    .optional()
    .refine((files) => {
      if (files && files.length > 0) {
        const firstType = files[0].type
        return files.every((file: any) => file.type === firstType)
      }
      return true
    }, 'Chỉ được phép gửi các file cùng loại'),
})

export type CreateGroupChatPayload = z.infer<typeof createGroupChatSchema>
export type AddMemberGroupChatPayload = z.infer<typeof addMemberGroupChatSchema>
export type MessagePayload = z.infer<typeof messageSchema>
