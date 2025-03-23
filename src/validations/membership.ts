import { z } from 'zod'

export const membershipSchema = z.object({
  code: z.string(),
  name: z
    .string()
    .trim()
    .min(3, 'Tên gói phải có ít nhất 3 ký tự')
    .max(255, 'Tên gói không được vượt quá 255 ký tự'),
  description: z.string().trim().optional(),
  price: z
    .number({
      message: 'Giá không được để trống',
    })
    .positive('Giá phải lớn hơn 0'),
  duration_months: z.number().int().positive(),
  benefits: z
    .array(
      z.object({
        value: z
          .string({
            message: 'Quyền lợi không được để trống',
          })
          .trim()
          .min(3, 'Tối thiểu 3 ký tự')
          .max(255, 'Tối đa 255 ký tự'),
      })
    )
    .min(4, 'Vui lòng thêm ít nhất 4 quyền lợi')
    .max(10, 'Tối đa 10 quyền lợi'),
  course_ids: z
    .array(z.number())
    .min(5, 'Gói thành viên phải có ít nhất 5 khoá học'),
})

export type MembershipPayload = z.infer<typeof membershipSchema>
