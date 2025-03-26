import { z } from 'zod'
import { formatCurrency } from '@/lib/common'

// Utility function to normalize Vietnamese strings
const removeVietnameseDiacritics = (str: string): string => {
  const vietnamese = [
    'á',
    'à',
    'ả',
    'ã',
    'ạ',
    'ă',
    'ắ',
    'ằ',
    'ẳ',
    'ẵ',
    'ặ',
    'â',
    'ấ',
    'ầ',
    'ẩ',
    'ẫ',
    'ậ',
    'é',
    'è',
    'ẻ',
    'ẽ',
    'ẹ',
    'ê',
    'ế',
    'ề',
    'ể',
    'ễ',
    'ệ',
    'í',
    'ì',
    'ỉ',
    'ĩ',
    'ị',
    'ó',
    'ò',
    'ỏ',
    'õ',
    'ọ',
    'ô',
    'ố',
    'ồ',
    'ổ',
    'ỗ',
    'ộ',
    'ơ',
    'ớ',
    'ờ',
    'ở',
    'ỡ',
    'ợ',
    'ú',
    'ù',
    'ủ',
    'ũ',
    'ụ',
    'ư',
    'ứ',
    'ừ',
    'ử',
    'ữ',
    'ự',
    'ý',
    'ỳ',
    'ỷ',
    'ỹ',
    'ỵ',
    'đ',
  ]

  const english = [
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'i',
    'i',
    'i',
    'i',
    'i',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'u',
    'u',
    'u',
    'u',
    'u',
    'u',
    'u',
    'u',
    'u',
    'u',
    'u',
    'y',
    'y',
    'y',
    'y',
    'y',
    'd',
  ]

  return str
    .toLowerCase()
    .replace(/ /g, '')
    .replace(
      new RegExp(vietnamese.join('|'), 'g'),
      (match) => english[vietnamese.indexOf(match)]
    )
}

const baseSchema = z.object({
  account_no: z
    .string()
    .min(1, 'Vui lòng nhập số tài khoản')
    .regex(/^\d+$/, 'Số tài khoản không hợp lệ'),
  account_name: z
    .string()
    .min(5, 'Tên tài khoản phải dài ít nhất 5 ký tự')
    .max(50, 'Tên tài khoản không được vượt quá 50 ký tự'),
  acq_id: z
    .string()
    .min(1, 'Vui lòng chọn ngân hàng')
    .regex(/^\d+$/, 'Vui lòng chọn ngân hàng'),
  bank: z.string().min(1, 'Vui lòng chọn ngân hàng'),
  bank_name: z.string().min(1, 'Vui lòng chọn ngân hàng'),
  amount: z.number().min(50000, 'Số tiền rút tối thiểu là 50,000 VNĐ'),
  add_info: z.string().min(1, 'Vui lòng nhập thông tin'),
})

export const WithdrawalRequestSchema = (walletBalance: number) =>
  baseSchema
    .extend({
      amount: baseSchema.shape.amount.max(
        walletBalance,
        `Số tiền rút vượt quá số dư khả dụng (${formatCurrency(walletBalance)})`
      ),
    })
    .superRefine((data, ctx) => {
      const normalizedAccountName = removeVietnameseDiacritics(
        data.account_name
      ).toUpperCase()

      if (!/^[A-Z]+$/.test(normalizedAccountName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['account_name'],
          message:
            'Tên tài khoản chỉ được chứa chữ cái in hoa (không dấu), không chứa khoảng trắng hay ký tự đặc biệt',
        })
      }
    })

export type WithDrawalRequestPayload = z.infer<
  ReturnType<typeof WithdrawalRequestSchema>
>
