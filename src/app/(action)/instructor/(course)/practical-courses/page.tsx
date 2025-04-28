import { Metadata } from 'next'

import Container from '@/components/shared/container'
import { PracticalCoursesTable } from './_components/practical-courses-table'

export const metadata: Metadata = {
  title: 'Quản lý khóa học',
  description:
    'Giảng viên quản lý các khóa học của mình: tạo mới, chỉnh sửa nội dung, cập nhật bài giảng và theo dõi tiến độ học viên.',
}

const page = () => {
  return (
    <Container>
      <h1 className="text-2xl font-medium">Quản lý khóa học</h1>

      <PracticalCoursesTable />
    </Container>
  )
}
export default page
