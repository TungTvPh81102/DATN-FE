import React from 'react'
import { Metadata } from 'next'
import TransactionManageMembershipView from '@/sections/instructor/view/transaction-manage-membership-view'

export const metadata: Metadata = {
  title: 'Gói membership đã bán',
  description:
    'Xem danh sách các gói membership đã được bán: theo dõi số lượng đăng ký, doanh thu và quản lý các gói thành viên đã hoàn tất giao dịch.',
}

const Page = () => {
  return <TransactionManageMembershipView />
}

export default Page
