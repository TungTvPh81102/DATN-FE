import { Metadata } from 'next'

import SigninView from '@/sections/signin/view/signin-view'

export const metadata: Metadata = {
  title: 'Đăng nhập để tiếp tục hành trình học tập của bạn',
  description:
    'Đăng nhập vào tài khoản của bạn để tiếp tục hành trình học tập, theo dõi tiến độ, tham gia các khóa học mới và khám phá các cơ hội học tập tuyệt vời.',
}

const page = () => {
  return <SigninView />
}

export default page
