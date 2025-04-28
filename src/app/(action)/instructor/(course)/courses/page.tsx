import { Metadata } from 'next'

import Container from '@/components/shared/container'
import CoursesTable from './_components/courses-table'

export const metadata: Metadata = {
  title: 'Quản lý khóa học',
  description:
    'Giảng viên quản lý các khóa học của mình: tạo mới, chỉnh sửa nội dung, cập nhật bài giảng và theo dõi tiến độ học viên.',
}

const CourseManagePage = () => {
  return (
    <Container>
      <h1 className="text-2xl font-medium">Quản lý khóa học</h1>

      <CoursesTable />
    </Container>
  )
}

export default CourseManagePage
