import { Metadata } from 'next'

import Container from '@/components/shared/container'
import { PracticalCoursesTable } from './_components/practical-courses-table'

export const metadata: Metadata = {
  title: 'Quản lý khóa học thực hành',
}
const page = () => {
  return (
    <Container>
      <h1 className="text-2xl font-medium">Quản lý khóa học thực hành</h1>

      <PracticalCoursesTable />
    </Container>
  )
}
export default page
