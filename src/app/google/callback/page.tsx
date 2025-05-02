import { GoogleCallback } from './_components/google-callback'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng nhập Google – Đang xử lý...',
  description:
    'CourseMely đang xử lý thông tin đăng nhập từ Google. Vui lòng chờ trong giây lát để hoàn tất quá trình xác thực và chuyển hướng bạn đến trang học tập.',
}

const Page = () => {
  return <GoogleCallback />
}

export default Page
