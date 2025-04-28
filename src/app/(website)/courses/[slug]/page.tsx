import CourseDetailView from '@/sections/courses/view/course-detail-view'
import { Metadata } from 'next'

interface Props {
  params: {
    slug: string
  }
}

export const metadata: Metadata = {
  title: 'Chi tiết khoá học',
}

const CourseDetailPage = ({ params }: Props) => {
  const { slug } = params

  return <CourseDetailView slug={slug} />
}

export default CourseDetailPage
