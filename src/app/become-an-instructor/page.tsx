import { Metadata } from 'next'

import BecomeAnInstructor from '@/sections/become-an-instructor/views/become-an-instructor'

export const metadata: Metadata = {
  title: 'Trở thành giảng viên',
  description:
    'Gia nhập cộng đồng giảng viên của CourseMely và chia sẻ kiến thức với hàng nghìn học viên. Trở thành giảng viên của chúng tôi để giảng dạy các khóa học chất lượng và phát triển sự nghiệp giáo dục của bạn.',
}

const page = () => {
  return <BecomeAnInstructor />
}

export default page
