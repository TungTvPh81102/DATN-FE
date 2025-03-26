import TransactionManageCourseView from '@/sections/instructor/view/transaction-manage-course-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Khoá học đã bán',
}

const TransactionPage = () => {
  return <TransactionManageCourseView />
}

export default TransactionPage
