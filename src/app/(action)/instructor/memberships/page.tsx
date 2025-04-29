import Container from '@/components/shared/container'
import { Metadata } from 'next'
import { MembershipsTable } from './_components/memberships-table'

export const metadata: Metadata = {
  title: 'Quản lý gói thành viên',
  description:
    'Giảng viên hoặc admin quản lý các gói thành viên: tạo, chỉnh sửa, xóa và theo dõi quyền truy cập của học viên vào các khóa học và tài nguyên đặc biệt.',
}

const page = () => {
  return (
    <Container>
      <h1 className="text-2xl font-medium">Quản lý gói thành viên</h1>

      <MembershipsTable />
    </Container>
  )
}

export default page
