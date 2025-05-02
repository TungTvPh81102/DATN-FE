import ProtectedRoute from '@/components/shared/protected-route'
import { Role } from '@/constants/role'
import DraftCourseView from '@/sections/draft-course/views'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Xem trước khóa học bản nháp',
  description:
    'Xem trước nội dung khóa học đang soạn thảo, bao gồm chương trình học, mô tả khóa học, video và tài nguyên đính kèm. Hoàn thiện khóa học trước khi xuất bản trên CourseMely.',
}

const page = ({ params }: { params: { slug: string } }) => {
  return (
    <ProtectedRoute roles={[Role.INSTRUCTOR, Role.SUPER_ADMIN, Role.ADMIN]}>
      <DraftCourseView slug={params.slug} />
    </ProtectedRoute>
  )
}
export default page
