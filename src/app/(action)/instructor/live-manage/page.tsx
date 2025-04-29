import LiveStreamManageView from '@/sections/instructor/view/live-stream-manage-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý phát trực tiếp',
  description:
    'Giảng viên hoặc admin quản lý các buổi phát trực tiếp: tạo, chỉnh sửa, lên lịch và theo dõi hiệu quả các buổi học trực tuyến.',
}

const Page = () => {
  return <LiveStreamManageView />
}

export default Page
