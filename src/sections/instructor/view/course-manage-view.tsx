import Container from '@/components/shared/container'
import CoursesTable from '../components/course-management/courses-table'

const CourseManageView = () => {
  return (
    <Container>
      <h1 className="text-2xl font-medium">Quản lý khóa học</h1>

      <CoursesTable />
    </Container>
  )
}

export default CourseManageView
