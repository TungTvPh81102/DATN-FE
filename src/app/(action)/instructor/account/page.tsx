import { Metadata } from 'next'

import AccountView from '@/sections/account/view/account-view'

export const metadata: Metadata = {
  title: 'Quản lý tài khoản',
  description:
    'Giảng viên cập nhật thông tin cá nhân, quản lý hồ sơ giảng viên và cài đặt bảo mật tài khoản dễ dàng.',
}

const page = () => {
  return <AccountView />
}

export default page
