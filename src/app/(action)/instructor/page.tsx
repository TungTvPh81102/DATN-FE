import StatisticsView from '@/sections/instructor/view/statistics-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thống kê khóa học & doanh thu',
  description:
    'Theo dõi và phân tích hiệu quả các khóa học: thống kê số lượng học viên, doanh thu từ các khóa học và đánh giá tổng quan về hiệu suất kinh doanh.',
}

const page = () => {
  return <StatisticsView />
}

export default page
