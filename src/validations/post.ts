import { z } from 'zod'

export const createPostSchema = z.object({
  category_id: z.coerce
    .number({
      message: 'Vui lòng chọn danh mục',
    })
    .int(),
  title: z
    .string()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  description: z.string(),
  content: z.string(),
  thumbnail: z
    .instanceof(File, { message: 'Vui lòng chọn một tệp ảnh hợp lệ' })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'Ảnh không được lớn hơn 5MB',
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      { message: 'Chỉ chấp nhận định dạng ảnh JPG, PNG, hoặc WEBP' }
    ),
  tags: z.array(z.string()).optional(),
  published_at: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.string().optional()
  ),
})

export const updatePostSchema = z.object({
  category_id: z.coerce
    .number({
      message: 'Vui lòng chọn danh mục',
    })
    .int(),
  title: z
    .string()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  description: z.string().optional(),
  content: z.string().optional(),
  thumbnail: z
    .instanceof(File, { message: 'Vui lòng chọn một tệp ảnh hợp lệ' })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'Ảnh không được lớn hơn 5MB',
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      { message: 'Chỉ chấp nhận định dạng ảnh JPG, PNG, hoặc WEBP' }
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  published_at: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.string().optional()
  ),
  status: z.enum(['draft', 'pending', 'published', 'private']).optional(),
})

export type CreatePostPayload = z.infer<typeof createPostSchema>
export type UpdatePostPayload = z.infer<typeof updatePostSchema>
