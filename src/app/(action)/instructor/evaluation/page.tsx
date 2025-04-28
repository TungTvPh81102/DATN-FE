import EvaluationView from '@/sections/instructor/view/evaluation-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh sách đánh giá',
  description:
    'Xem và quản lý các đánh giá của học viên về khóa học: nhận xét, điểm số và phản hồi để cải thiện chất lượng giảng dạy.',
}

const Page = () => {
  return <EvaluationView />
}

export default Page
