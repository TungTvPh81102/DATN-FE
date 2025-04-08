import { z } from 'zod'

export const registerInstructorSchema = z.object({
  qa_systems: z
    .object({
      question: z.string().min(1),
      options: z.string().array().nonempty(),
      selected_options: z
        .number()
        .array()
        .min(1, { message: 'Vui lòng chọn câu trả lời' }),
    })
    .array(),
  certificates: z.array(
    z.object({
      file: z
        .instanceof(File, { message: 'Vui lòng tải lên tệp hợp lệ' })
        .optional(),
    })
  ),
  identity_verification: z
    .instanceof(File, { message: 'Vui lòng chụp ảnh xác minh danh tính' })
    .refine((file) => file && file.size <= 5000000, {
      message: 'Kích thước ảnh không được vượt quá 5MB',
    })
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file?.type),
      {
        message: 'Chỉ chấp nhận định dạng JPG, JPEG hoặc PNG',
      }
    ),
  confirmation: z.literal(true, {
    errorMap: () => ({ message: 'Bạn phải xác nhận cam kết này' }),
  }),
})

export type RegisterInstructorPayload = z.infer<typeof registerInstructorSchema>
