import LearnerManageView from '@/sections/instructor/view/learner-manage-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý học viên',
  description:
    'Quản lý danh sách học viên: theo dõi tiến độ học tập, điểm số, phản hồi, và hỗ trợ học viên trong suốt quá trình học.',
}

const Page = () => {
  return <LearnerManageView />
}

export default Page
