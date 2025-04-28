import SettingsView from '@/sections/instructor/view/settings-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thông tin tài khoản',
  description:
    'Xem và cập nhật thông tin tài khoản cá nhân: thay đổi mật khẩu, cập nhật thông tin liên lạc và quản lý các cài đặt bảo mật.',
}

const page = ({ params }: { params: { tab: string } }) => {
  return <SettingsView tab={params.tab} />
}

export default page
