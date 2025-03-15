import z from 'zod'

export const bankInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  bin: z.string({
    message: 'Vui lòng chọn ngân hàng',
  }),
  acq_id: z.string().optional(),
  short_name: z.string(),
  logo: z.string(),
  logo_rounded: z.string(),
  account_no: z
    .string()
    .trim()
    .min(8, 'Số tài khoản không hợp lệ')
    .max(16, 'Số tài khoản không hợp lệ')
    .regex(/^[0-9]+$/, 'Số tài khoản không hợp lệ'),
  account_name: z
    .string()
    .trim()
    .min(3, 'Tên tài khoản không hợp lệ')
    .regex(/^(?:[A-Z]+(?: [A-Z]+)*)$/, 'Tên tài khoản không hợp lệ'),
  is_default: z.boolean(),
})

export type BankInfo = z.infer<typeof bankInfoSchema>
