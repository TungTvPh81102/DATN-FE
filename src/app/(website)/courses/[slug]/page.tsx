import CourseDetailView from '@/sections/courses/view/course-detail-view'
import { Metadata } from 'next'

interface Props {
  params: {
    slug: string
  }
}

export const metadata: Metadata = {
  title: 'Chi tiết khóa học',
  description:
    'Khám phá chi tiết khóa học, bao gồm nội dung chương trình, giảng viên, lịch học và các thông tin quan trọng khác. Đăng ký ngay để nâng cao kỹ năng và bắt đầu hành trình học tập của bạn.',
}

const CourseDetailPage = ({ params }: Props) => {
  const { slug } = params

  return <CourseDetailView slug={slug} />
}

export default CourseDetailPage
