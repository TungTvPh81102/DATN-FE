import { Metadata } from 'next'
import { PracticalCourseUpdate } from './_components/practical-course-update'

export const metadata: Metadata = {
  title: 'Cập nhật bài kiểm tra',
}

type Props = {
  params: { slug: string }
}

const page = ({ params }: Props) => {
  const { slug } = params
  return <PracticalCourseUpdate slug={slug} />
}

export default page
