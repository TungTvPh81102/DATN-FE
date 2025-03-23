import React from 'react'
import { Metadata } from 'next'
import TransactionManageMembershipView from '@/sections/instructor/view/transaction-manage-membership-view'

export const metadata: Metadata = {
  title: 'Gói membership đã bán',
}

const Page = () => {
  return <TransactionManageMembershipView />
}

export default Page
