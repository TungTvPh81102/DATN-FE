import React from 'react'
import ProtectedRoute from '@/components/shared/protected-route'
import { Role } from '@/constants/role'
import LiveStreamingLayout from '@/components/layouts/LiveStreamingLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live Streaming - Phát trực tiếp khóa học',
  description:
    'Phát trực tiếp khóa học của bạn và theo dõi số liệu thống kê chất lượng luồng, tương tác học viên theo thời gian thực.',
  robots: {
    index: true,
    follow: true,
  },
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute roles={[Role.INSTRUCTOR]}>
      <LiveStreamingLayout>{children}</LiveStreamingLayout>
    </ProtectedRoute>
  )
}

export default Layout
