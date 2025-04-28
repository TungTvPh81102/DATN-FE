import { Metadata } from 'next'

import { SignupView } from '@/sections/signup/view'

export const metadata: Metadata = {
  title: 'Đăng ký và bắt đầu học',
  description:
    'Tạo tài khoản và bắt đầu hành trình học tập của bạn ngay hôm nay. Đăng ký để truy cập các khóa học chất lượng, nâng cao kỹ năng và phát triển sự nghiệp của bạn.',
}

const Signup = () => {
  return <SignupView />
}

export default Signup
