import { AnswerType } from '@/types'
import { z } from 'zod'

export const createLessonSchema = z.object({
  chapter_id: z.number().int(),
  title: z
    .string()
    .trim()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  type: z.enum(['video', 'document', 'quiz', 'coding']),
})

export const updateTitleLessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
})

export const lessonVideoSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
      .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
    content: z.string().min(1, 'Nội dung là bắt buộc'),
    is_free_preview: z
      .union([z.boolean(), z.number()])
      .transform((val) => Boolean(val))
      .optional(),
    isEdit: z.boolean().optional(),
  })
  .superRefine((data) => {
    if (data.isEdit && data.is_free_preview !== undefined) {
      return
    }
  })

export const lessonDocumentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
      .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
    file_type: z.enum(['upload', 'url']),
    document_file: z
      .instanceof(File, {
        message: 'Tập tin không hợp lệ',
      })
      .refine((file) => {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]
        return allowedTypes.includes(file.type)
      }, 'Chỉ chấp nhận định dạng PDF, DOC, DOCX')
      .refine(
        (file) => file.size <= 10 * 1024 * 1024,
        'Tài liệu phải nhỏ hơn 10MB'
      )
      .optional(),
    document_url: z.string().trim().url('URL tài liệu không hợp lệ').optional(),
    content: z.string().trim().min(1, 'Nội dung là bắt buộc'),
    isEdit: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isEdit) {
      if (!data.file_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['file_type'],
          message: 'Vui lòng chọn loại tài liệu',
          fatal: true,
        })

        return z.NEVER
      }

      if (data.file_type === 'upload' && !data.document_file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['document_file'],
          message: 'Bạn phải tải lên một tập tin',
          fatal: true,
        })

        return z.NEVER
      }

      if (data.file_type === 'url' && !data.document_url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['document_url'],
          message: 'URL tài liệu là bắt buộc khi chọn URL',
        })
      }
    }
  })

export const lessonQuizSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  content: z
    .string()
    .trim()
    .min(1, 'Nội dung là bắt buộc')
    .max(255, 'Nội dung không được vượt quá 255 ký tự'),
})

export const lessonCodingSchema = z.object({
  title: z
    .string()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  language: z.enum(['javascript', 'python', 'java', 'php', 'typescript'], {
    message: 'Vui lòng chọn một ngôn ngữ lập trình',
  }),
})

// const optionSchema = z.object({
//   answer: z
//     .string()
//     .nonempty('Đáp án không được để trống')
//     .max(255, 'Đáp án không được quá 255 ký tự'),
//   is_correct: z.boolean(),
// })
//
// const questionSchema = z
//   .object({
//     question: z
//       .string()
//       .min(1, 'Câu hỏi là bắt buộc')
//       .max(255, 'Câu hỏi không được quá 255 ký tự'),
//     description: z.string().optional(),
//     answer_type: z.enum(['single_choice', 'multiple_choice'], {
//       required_error: 'Loại câu trả lời là bắt buộc',
//       invalid_type_error: 'Loại câu trả lời không hợp lệ',
//     }),
//     options: z
//       .array(optionSchema)
//       .min(2, 'Câu trả lời phải có ít nhất 2 đáp án'),
//     image: z
//       .any()
//       .refine((file) => file instanceof File, 'File không hợp lệ')
//       .refine((file) => file.size <= 2 * 1024 * 1024, 'File phải nhỏ hơn 2MB')
//       .refine(
//         (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
//         'Chỉ chấp nhận định dạng JPG, PNG, WEBP'
//       )
//       .optional(),
//   })
//   .superRefine((question, ctx) => {
//     if (question.options.some((opt) => !opt.answer)) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Tất cả đáp án phải có nội dung',
//         path: ['options'],
//       })
//     }
//
//     const correctAnswers = question.options.filter(
//       (opt) => opt.is_correct
//     ).length
//
//     if (question.answer_type === 'single_choice' && correctAnswers !== 1) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Vui lòng chọn một đáp án đúng',
//         path: ['options'],
//       })
//     }
//
//     if (question.answer_type === 'multiple_choice' && correctAnswers < 1) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Câu hỏi phải có ít nhất một đáp án đúng',
//         path: ['options'],
//       })
//     }
//   })
//
// export const storeQuestionSchema = z.object({
//   questions: z.array(questionSchema).min(1, 'Phải có ít nhất một câu hỏi'),
// })

export const storeQuestionSchema = z
  .object({
    question: z.string().nonempty('Câu hỏi không được để trống'),
    description: z.string().nullish(),
    answer_type: z.enum(Object.values(AnswerType) as [`${AnswerType}`]),
    options: z
      .array(
        z.object({
          answer: z
            .string()
            .min(1, 'Đáp án không được để trống')
            .max(255, 'Đáp án quá dài'),
          is_correct: z.number().int().min(0).max(1),
        })
      )
      .min(2, 'Phải có ít nhất 2 đáp án')
      .refine(
        (options) => options.some((option) => option.is_correct),
        'Phải có ít nhất một đáp án đúng'
      ),
    image: z.union([z.instanceof(File), z.string()]).nullish(),
  })
  .superRefine((question, ctx) => {
    const correctAnswers = question.options.filter(
      (opt) => opt.is_correct
    ).length

    if (
      question.answer_type === AnswerType.SINGLE_CHOICE &&
      correctAnswers !== 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng chọn một đáp án đúng',
        path: ['options'],
      })
    }

    if (
      question.answer_type === AnswerType.MULTIPLE_CHOICE &&
      correctAnswers < 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Câu hỏi phải có ít nhất một đáp án đúng',
        path: ['options'],
      })
    }
  })

export type CreateLessonPayload = z.infer<typeof createLessonSchema>
export type UpdateTitleLessonPayload = z.infer<typeof updateTitleLessonSchema>
export type LessonVideoPayload = z.infer<typeof lessonVideoSchema>
export type LessonDocumentPayload = z.infer<typeof lessonDocumentSchema>
export type LessonQuizPayload = z.infer<typeof lessonQuizSchema>
export type LessonCodingPayload = z.infer<typeof lessonCodingSchema>
export type StoreQuestionPayload = z.infer<typeof storeQuestionSchema>
