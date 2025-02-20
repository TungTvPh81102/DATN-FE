import { z } from 'zod'

export const createCourseSchema = z.object({
  category_id: z.coerce
    .number({
      message: 'Vui lòng chọn danh mục',
    })
    .int(),
  name: z
    .string()
    .trim()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
})

export const updateCourseOverViewSchema = z
  .object({
    category_id: z.coerce
      .number({
        message: 'Vui lòng chọn danh mục',
      })
      .int(),
    name: z
      .string()
      .trim()
      .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
      .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
    description: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (val) {
            const wordCount = val.trim().split(/\s+/).length
            return wordCount >= 150
          }
          return true
        },
        {
          message: 'Mô tả phải có ít nhất 150 từ',
        }
      ),
    thumbnail: z
      .union([
        z
          .instanceof(File)
          .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'Ảnh không được lớn hơn 5MB',
          })
          .refine(
            (file) =>
              ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            { message: 'Chỉ chấp nhận định dạng ảnh JPG, PNG, hoặc WEBP' }
          ),
        z.string(),
        z.undefined(),
      ])
      .optional(),
    price: z.coerce
      .number({
        message: 'Vui lòng nhập giá khoá học',
      })
      .int()
      .min(0, 'Giá không được nhỏ hơn 0')
      .max(10000000, 'Giá không được vượt quá 10.000.000 triệu')
      .optional(),
    intro: z
      .union([
        z
          .instanceof(File)
          .refine((file) => file.size <= 50 * 1024 * 1024, {
            message: 'Video không được lớn hơn 50MB',
          })
          .refine((file) => file.type === 'video/mp4', {
            message: 'Chỉ chấp nhận định dạng video MP4',
          }),
        z.string(),
        z.undefined(),
      ])
      .optional(),
    price_sale: z.coerce
      .number({
        message: 'Vui lòng nhập giá khuyến mãi',
      })
      .int()
      .nonnegative('Giá khuyến mãi phải lớn hơn hoặc bằng 0')
      .optional(),
    is_free: z.preprocess(
      (val) => String(val),
      z.enum(['0', '1'], {
        errorMap: () => ({
          message: 'Trường này chỉ được nhận giá trị 0 hoặc 1.',
        }),
      })
    ),
    level: z.enum(['beginner', 'intermediate', 'advanced'], {
      errorMap: () => ({ message: 'Vui lòng chọn cấp độ hợp lệ' }),
    }),
    visibility: z.enum(['public', 'private'], {
      errorMap: () => ({ message: 'Vui lòng chọn trạng thái hợp lệ' }),
    }),
  })
  .superRefine((data: number | any, ctx) => {
    if (data.is_free === '0') {
      if (!data.price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['price'],
          message: 'Vui lòng nhập giá khoá học',
        })
      } else if (data.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['price'],
          message: 'Giá phải là số dương',
        })
      }

      if (data.price_sale && data.price_sale > data.price * 0.6) {
        const maxPriceSale = Math.floor(data.price * 0.6)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['price_sale'],
          message: `Giá khuyến mãi không được cao hơn 60% (${maxPriceSale}) giá gốc`,
        })
      }
    }
  })

export const updateCourseObjectiveSchema = z.object({
  benefits: z
    .array(z.string())
    .min(4, { message: 'Bạn cần ít nhất 4 lợi ích' }),
  requirements: z.array(z.string()).optional(),
  qa: z
    .array(
      z.object({
        question: z.string(),
        answers: z.string(),
      })
    )
    .optional(),
})

export const updateCodingLessonSchema = z.object({
  title: z.string().trim().min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
  language: z.string({
    message: 'Vui lòng chọn ngôn ngữ lập trình',
  }),
  hints: z
    .string()
    .trim()
    .min(3, 'Gợi ý phải có ít nhất 3 ký tự')
    .array()
    .max(10, {
      message: 'Số lượng gợi ý tối đa là 10',
    }),
  sample_code: z.string().optional(),
  result_code: z
    .string({
      required_error: 'Vui lòng nhập mã giải và chạy',
      invalid_type_error: 'Vui lòng nhập mã giải và chạy',
    })
    .trim(),
  solution_code: z
    .string({
      required_error: 'Vui lòng nhập hướng dẫn',
      invalid_type_error: 'Vui lòng nhập hướng dẫn',
    })
    .trim(),
})

export type UpdateCodingLessonPayload = z.infer<typeof updateCodingLessonSchema>

export type CreateCoursePayload = z.infer<typeof createCourseSchema>
export type UpdateCourseOverViewPayload = z.infer<
  typeof updateCourseOverViewSchema
>
export type UpdateCourseObjectivePayload = z.infer<
  typeof updateCourseObjectiveSchema
>
