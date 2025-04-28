import { Metadata } from 'next'
import CourseUpdateView from './_components/course-update-view'

export const metadata: Metadata = {
  title: 'Cập nhật khóa học',
  description:
    'Chỉnh sửa và cập nhật thông tin khóa học: tiêu đề, mô tả, nội dung bài học, giá bán và nhiều thông tin liên quan khác.',
}

type Props = {
  params: { slug: string }
}

const CourseUpdatePage = ({ params }: Props) => {
  const { slug } = params
  return <CourseUpdateView slug={slug} />
}

export default CourseUpdatePage
