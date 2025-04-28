import { Metadata } from 'next'

import CourseDetailView from './_components/course-detail'

export const metadata: Metadata = {
  title: 'Chi tiết khóa học',
  description:
    'Khám phá chi tiết khóa học: nội dung, giảng viên, đánh giá học viên và nhiều thông tin hữu ích khác để lựa chọn khóa học phù hợp với bạn.',
}

interface Props {
  params: {
    slug: string
  }
}

const CourseDetail = ({ params }: Props) => {
  const { slug } = params

  return <CourseDetailView slug={slug} />
}

export default CourseDetail
