import TransactionManageCourseView from '@/sections/instructor/view/transaction-manage-course-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Khóa học đã bán',
  description:
    'Xem danh sách các khóa học đã được bán: theo dõi doanh thu, số lượng học viên đăng ký và quản lý các khóa học đã hoàn tất giao dịch.',
}

const TransactionPage = () => {
  return <TransactionManageCourseView />
}

export default TransactionPage
