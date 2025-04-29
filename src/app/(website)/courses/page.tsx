import { Metadata } from 'next'

import { CourseListView } from '@/sections/courses/view'

export const metadata: Metadata = {
  title: 'Danh sách khóa học',
  description:
    'Khám phá danh sách các khóa học đa dạng, từ kỹ năng mềm đến chuyên môn kỹ thuật. Lọc theo chủ đề, mức độ và học phí để tìm khóa học phù hợp với nhu cầu và mục tiêu học tập của bạn.',
}

const page = () => {
  return <CourseListView />
}

export default page
