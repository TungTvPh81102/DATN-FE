import React from 'react'
import { Metadata } from 'next'

import { MeView } from '@/sections/me/view'

export const metadata: Metadata = {
  title: 'Thông tin cá nhân',
  description:
    'Xem và cập nhật thông tin cá nhân của bạn, bao gồm tên, email, mật khẩu và các cài đặt tài khoản khác. Đảm bảo rằng các thông tin của bạn luôn chính xác và bảo mật.',
}

const page = () => {
  return <MeView />
}

export default page
