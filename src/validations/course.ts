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
    .min(5, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  isPracticalCourse: z.boolean(),
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
      .min(5, 'Tiêu đề phải có ít nhất 3 ký tự')
      .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
    description: z
      .string()
      .trim()
      .min(100, 'Vui lòng nhập mô tả khoá học')
      .refine(
        (val) => {
          if (val) {
            const wordCount = val.trim().split(/\s+/).length
            return wordCount <= 500
          }
          return true
        },
        {
          message: 'Mô tả phải có không được vượt quá 500 từ',
        }
      ),
    thumbnail: z.union([
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
      z.null(),
    ]),
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
        z.null(),
      ])
      .optional(),
    price_sale: z.coerce
      .number({
        message: 'Vui lòng nhập giá khuyến mãi',
      })
      .int()
      .nonnegative('Giá khuyến mãi phải lớn hơn hoặc bằng 0')
      .optional(),
    is_free: z.enum(['0', '1'], {
      message: 'Giá trị không hợp lệ',
    }),
    level: z.enum(['beginner', 'intermediate', 'advanced'], {
      errorMap: () => ({ message: 'Vui lòng chọn cấp độ hợp lệ' }),
    }),
    visibility: z.enum(['public', 'private'], {
      errorMap: () => ({ message: 'Vui lòng chọn trạng thái hợp lệ' }),
    }),
    allow_coding_lesson: z.boolean(),
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
    .array(
      z.object({
        value: z
          .string({
            message: 'Lợi ích không được để trống',
          })
          .trim()
          .min(3, 'Lợi ích phải tối thiểu 3 ký tự')
          .max(255, 'Lợi ích tối đa 255 ký tự'),
      })
    )
    .min(4, 'Vui lòng thêm ít nhất 4 lợi ích')
    .max(10, 'Chỉ được phép thêm tối đa 10 lợi ích')
    .refine(
      (items) => {
        const values = items.map((item) => item.value.trim().toLowerCase())
        const uniqueValues = new Set(values.filter((v) => v !== ''))
        return uniqueValues.size === values.filter((v) => v !== '').length
      },
      {
        message: 'Các lợi ích không được trùng nhau',
      }
    ),
  requirements: z
    .array(
      z.object({
        value: z
          .string({
            message: 'Yêu cầu không được để trống',
          })
          .trim()
          .min(3, 'Yêu cầu tối thiểu 3 ký tự')
          .max(255, 'Yêu cầu tối đa 255 ký tự'),
      })
    )
    .min(4, 'Vui lòng thêm ít nhất 4 yêu cầu')
    .max(10, 'Chỉ được phép thêm tối đa 10 yêu cầu')
    .refine(
      (items) => {
        const values = items.map((item) => item.value.trim().toLowerCase())
        const uniqueValues = new Set(values.filter((v) => v !== ''))
        return uniqueValues.size === values.filter((v) => v !== '').length
      },
      {
        message: 'Các yêu cầu không được trùng nhau',
      }
    ),
  qa: z
    .array(
      z.object({
        question: z.string().min(1, 'Vui lòng nhập nội dung câu hỏi'),
        answer: z.string().min(1, 'Vui lòng nhập câu trả lời'),
      })
    )
    .max(10, 'Chỉ được phép thêm tối đa 10 câu hỏi')
    .refine(
      (items) => {
        if (!items || items.length <= 1) return true
        const questions = items.map((item) =>
          item.question.trim().toLowerCase()
        )
        const uniqueQuestions = new Set(questions.filter((q) => q !== ''))
        return uniqueQuestions.size === questions.filter((q) => q !== '').length
      },
      {
        message: 'Các câu hỏi không được trùng nhau',
      }
    )
    .optional(),
})

export const updateCodingLessonSchema = z
  .object({
    title: z.string().trim().min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
    language: z.string({
      message: 'Vui lòng chọn ngôn ngữ lập trình',
    }),
    instruct: z.string().optional(),
    content: z.string().trim().min(1, 'Vui lòng nhập nội dung bài học'),
    hints: z
      .array(
        z.object({
          hint: z.string().trim().min(3, 'Gợi ý phải có ít nhất 3 ký tự'),
        })
      )
      .max(10, {
        message: 'Số lượng gợi ý tối đa là 10',
      })
      .optional(),
    sample_code: z.string().optional(),
    // result_code: z
    //   .string({
    //     required_error: 'Vui lòng chạy mã',
    //     invalid_type_error: 'Vui lòng chạy mã',
    //   })
    //   .trim(),
    // solution_code: z
    //   .string({
    //     required_error: 'Vui lòng nhập giải pháp',
    //     invalid_type_error: 'Vui lòng nhập giải pháp',
    //   })
    //   .trim(),
    test_case: z
      .array(
        z.object({
          input: z.string().trim(),
          output: z.string().trim(),
        })
      )
      .nullish(),
    ignore_test_case: z.boolean(),

    // Check test case
    checkTestCase: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.ignore_test_case) {
      if (!data.test_case || data.test_case.length < 2) {
        ctx.addIssue({
          path: ['test_case'],
          code: z.ZodIssueCode.custom,
          message: 'Phải có ít nhất 2 test case',
          fatal: true,
        })

        return z.NEVER
      }

      if (data.checkTestCase === undefined) {
        ctx.addIssue({
          path: ['test_case'],
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng chạy kiểm tra test case',
          fatal: true,
        })

        return z.NEVER
      }

      if (data.checkTestCase === false) {
        ctx.addIssue({
          path: ['test_case'],
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng kiểm tra lại test case',
        })
      }
    }
  })

export const requestModifyContentSchema = z.object({
  reason: z.string().min(1, 'Vui lòng nhập lý do cần sửa đổi'),
})

export type UpdateCodingLessonPayload = z.infer<typeof updateCodingLessonSchema>

export type CreateCoursePayload = z.infer<typeof createCourseSchema>
export type UpdateCourseOverViewPayload = z.infer<
  typeof updateCourseOverViewSchema
>
export type UpdateCourseObjectivePayload = z.infer<
  typeof updateCourseObjectiveSchema
>
export type RequestModifyContentPayload = z.infer<
  typeof requestModifyContentSchema
>
