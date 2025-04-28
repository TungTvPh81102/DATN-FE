import CouponCreateView from '@/sections/instructor/components/coupon/coupon-create-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tạo mã giảm giá',
  description:
    'Giảng viên hoặc admin tạo và quản lý mã giảm giá cho khóa học, giúp học viên nhận ưu đãi hấp dẫn khi đăng ký khóa học.',
}

const Page = () => {
  return <CouponCreateView />
}

export default Page
