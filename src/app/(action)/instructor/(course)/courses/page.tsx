import { Metadata } from 'next'

import Container from '@/components/shared/container'
import CoursesTable from './_components/courses-table'

export const metadata: Metadata = {
  title: 'Quản lý khóa học',
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
