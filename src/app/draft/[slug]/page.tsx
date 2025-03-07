import ProtectedRoute from '@/components/shared/protected-route'
import { Role } from '@/constants/role'
import DraftCourseView from '@/sections/draft-course/views'

const page = ({ params }: { params: { slug: string } }) => {
  return (
    <ProtectedRoute roles={[Role.INSTRUCTOR]}>
      <DraftCourseView slug={params.slug} />
    </ProtectedRoute>
  )
}
export default page
