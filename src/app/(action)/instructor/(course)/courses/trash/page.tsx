import { Metadata } from 'next'

import Container from '@/components/shared/container'
import { TrashCoursesTable } from './_components/trash-courses-table'

export const metadata: Metadata = {
  title: 'Khóa học đã xóa',
  description:
    'Danh sách các khóa học đã bị xóa khỏi hệ thống. Xem chi tiết và quản lý các khóa học không còn hoạt động.',
}

const CourseTrashPage = () => {
  return (
    <Container>
      <h1 className="text-2xl font-medium">Khóa học đã xóa</h1>

      <TrashCoursesTable />
    </Container>
  )
}

export default CourseTrashPage
