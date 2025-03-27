import { Metadata } from 'next'
import CourseUpdateView from './_components/course-update-view'

export const metadata: Metadata = {
  title: 'Cập nhật khóa học',
}

type Props = {
  params: { slug: string }
}

const CourseUpdatePage = ({ params }: Props) => {
  const { slug } = params
  return <CourseUpdateView slug={slug} />
}

export default CourseUpdatePage
