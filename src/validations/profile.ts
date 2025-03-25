import { z } from 'zod'

export const updateProfile = z.object({
  name: z
    .string()
    .trim()
    .min(5, 'Tên của bạn tối thiếu 5 ký tự!')
    .max(30, 'Tên của bạn không được vượt quá 30 ký tự!')
    .optional(),
  phone: z
    .string()
    .trim()
    .min(10, 'Số điện thoại tối thiểu 10 số!')
    .max(15, 'Số diện thoại không được vượt quá 15 số')
    .optional(),
  address: z.string().min(1, 'Nhập địa chỉ của bạn'),
  about_me: z.string().optional(),
  avatar: z
    .any()
    .refine((file) => file instanceof File || file === undefined, {
      message: 'Avatar phải là một file ảnh!',
    })
    .optional(),
})

export const profileBioSchema = z.object({
  github: z
    .string()
    .trim()
    .refine((val) => val === '' || /^https?:\/\/.+\..+$/.test(val), {
      message: 'URL không hợp lệ',
    })
    .optional(),
  website: z
    .string()
    .trim()
    .refine((val) => val === '' || /^https?:\/\/.+\..+$/.test(val), {
      message: 'URL không hợp lệ',
    })
    .optional(),
  youtube: z
    .string()
    .trim()
    .refine((val) => val === '' || /^https?:\/\/.+\..+$/.test(val), {
      message: 'URL không hợp lệ',
    })
    .optional(),
  facebook: z
    .string()
    .trim()
    .refine((val) => val === '' || /^https?:\/\/.+\..+$/.test(val), {
      message: 'URL không hợp lệ',
    })
    .optional(),
  twitter: z
    .string()
    .trim()
    .refine((val) => val === '' || /^https?:\/\/.+\..+$/.test(val), {
      message: 'URL không hợp lệ',
    })
    .optional(),
  linkedin: z
    .string()
    .trim()
    .refine((val) => val === '' || /^https?:\/\/.+\..+$/.test(val), {
      message: 'URL không hợp lệ',
    })
    .optional(),
  instagram: z
    .string()
    .trim()
    .refine((val) => val === '' || /^https?:\/\/.+\..+$/.test(val), {
      message: 'URL không hợp lệ',
    })
    .optional(),
})

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
]
export const certificatesProfileSchema = z.object({
  certificates: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          'File size must be less than 5MB'
        )
        .refine(
          (file) => ACCEPTED_FILE_TYPES.includes(file.type),
          'Only JPG, JPEG, PNG, WEBP and PDF files are accepted'
        )
    )
    .optional(),
  existingCertificates: z.array(z.string()).optional(),
})

export const careerProfileSchema = z.object({
  careers: z.object({
    institution_name: z
      .string()
      .min(2, 'School name must be at least 2 characters'),
    major: z.string().min(2, 'Major must be at least 2 characters'),
    start_date: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
    end_date: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
    description: z
      .string()
      .max(1000, 'Description must not exceed 1000 characters')
      .optional(),
    degree: z.string().min(2, 'Degree must be at least 2 characters'),
  }),
})
export type UpdateCareerProfilePayload = z.infer<typeof careerProfileSchema>

export type UpdateProfilePayload = z.infer<typeof updateProfile>
export type ProfileBioFormValues = z.infer<typeof profileBioSchema>
export type UpdateCertificatesProfilePayload = z.infer<
  typeof certificatesProfileSchema
>
