import CouponUpdateView from '@/sections/instructor/components/coupon/coupon-update-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cập nhật mã giảm giá',
  description:
    'Giảng viên hoặc admin cập nhật thông tin mã giảm giá, bao gồm điều chỉnh giá trị, thời gian áp dụng và các điều kiện sử dụng cho các khóa học.',
}

type Props = {
  params: { id: string }
}

const Page = ({ params }: Props) => {
  const { id } = params
  return <CouponUpdateView id={id} />
}

export default Page
