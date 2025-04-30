import Container from '@/components/shared/container'
import { Metadata } from 'next'
import { CouponsTable } from './_components/coupons-table'

export const metadata: Metadata = {
  title: 'Quản lý mã giảm giá',
  description:
    'Giảng viên hoặc admin quản lý tất cả mã giảm giá: tạo mới, chỉnh sửa, xóa và theo dõi hiệu quả các chương trình giảm giá cho khóa học.',
}

const Page = () => {
  return (
    <Container>
      <h1 className="text-2xl font-medium">Quản lý mã giảm giá</h1>

      <CouponsTable />
    </Container>
  )
}

export default Page
