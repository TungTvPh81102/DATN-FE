import { Metadata } from 'next'

import CourseDetailView from './_components/course-detail'

export const metadata: Metadata = {
  title: 'Chi tiết khóa học',
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
