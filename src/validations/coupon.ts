import { z } from 'zod'

export const couponSchema = z
  .object({
    code: z
      .string()
      .nonempty('Mã giảm giá là bắt buộc.')
      .max(255, 'Mã giảm giá không được vượt quá 255 ký tự.'),
    name: z
      .string()
      .nonempty('Tên là bắt buộc.')
      .max(255, 'Tên không được vượt quá 255 ký tự.'),
    discount_type: z.enum(['percentage', 'fixed'], {
      errorMap: () => ({
        message: "Loại giảm giá phải là 'percentage' hoặc 'fixed'.",
      }),
    }),
    discount_value: z.coerce
      .number({
        invalid_type_error: 'Giá trị giảm giá phải là một số hợp lệ.',
      })
      .int()
      .min(1, 'Vui lòng nhập giá trị giảm.'),
    discount_max_value: z.coerce
      .number({
        invalid_type_error: 'Giá trị giảm tối đa phải là một số hợp lệ.',
      })
      .int()
      .min(0, 'Vui lòng nhập giá trị giảm tối đa')
      .optional(),
    start_date: z
      .string()
      .nullable()
      .optional()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: 'Ngày bắt đầu phải là một ngày hợp lệ.',
      }),
    expire_date: z
      .string()
      .nullable()
      .optional()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: 'Ngày hết hạn phải là một ngày hợp lệ.',
      }),
    description: z.string().optional().nullable(),
    max_usage: z.coerce
      .number()
      .int()
      .min(1, 'Số lần sử dụng tối đa phải lớn hơn hoặc bằng 1.')
      .optional(),
    status: z
      .enum(['0', '1'], {
        errorMap: () => ({
          message:
            "Trạng thái phải là '0' (Không hoạt động) hoặc '1' (Hoạt động).",
        }),
      })
      .optional(),
    user_ids: z
      .array(z.number().positive('ID người dùng phải là số nguyên dương.'))
      .optional()
      .nullable(),
    course_ids: z
      .array(z.number().positive('ID khoá học phải là số nguyên dương.'))
      .optional()
      .nullable(),
    specific_course: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.discount_type === 'fixed') {
      if (data.discount_value < 10000 || data.discount_value > 1000000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['discount_value'],
          message: 'Giá trị giảm cố định phải từ 10,000 VND đến 1,000,000 VND.',
        })
      }

      if (data.discount_max_value !== undefined) {
        data.discount_max_value = undefined
      }
    } else if (data.discount_type === 'percentage') {
      if (data.discount_value < 10 || data.discount_value > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['discount_value'],
          message: 'Giá trị giảm theo % phải từ 10% đến 100%.',
        })
      }

      if (
        data.discount_max_value === null ||
        data.discount_max_value === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['discount_max_value'],
          message:
            "Giá trị giảm tối đa là bắt buộc khi loại giảm giá là 'percentage'.",
        })
      }
    }

    if (data.expire_date && data.start_date) {
      const start = Date.parse(data.start_date as string)
      const expire = Date.parse(data.expire_date as string)

      if (expire <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expire_date'],
          message: 'Ngày hết hạn phải lớn hơn ngày bắt đầu.',
        })
      }
    }
  })

export type CouponPayload = z.infer<typeof couponSchema>
