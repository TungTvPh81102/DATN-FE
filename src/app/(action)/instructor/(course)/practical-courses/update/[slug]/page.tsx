import { Metadata } from 'next'
import { PracticalCourseUpdate } from './_components/practical-course-update'

export const metadata: Metadata = {
  title: 'Cập nhật bài kiểm tra',
  description:
    'Giảng viên chỉnh sửa và cập nhật nội dung bài kiểm tra cho học viên: thêm câu hỏi, thay đổi đáp án và thiết lập thời gian làm bài.',
}

type Props = {
  params: { slug: string }
}

const page = ({ params }: Props) => {
  const { slug } = params
  return <PracticalCourseUpdate slug={slug} />
}

export default page
