import { LivestreamList } from '@/sections/livestream/views/livestream-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh sách Livestream - Học trực tiếp cùng giảng viên',
  description:
    'Khám phá các buổi livestream học tập trên CourseMely. Tham gia học trực tiếp với giảng viên, đặt câu hỏi, tương tác theo thời gian thực và nâng cao trải nghiệm học tập của bạn.',
}

const Page = () => {
  return <LivestreamList />
}

export default Page
