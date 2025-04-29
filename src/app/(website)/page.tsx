import { HomeView } from '@/sections/home/view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CourseMely - Nền tảng học trực tuyến chất lượng',
  description:
    'Chào mừng đến với CourseMely, nền tảng học trực tuyến giúp bạn nâng cao kỹ năng và phát triển sự nghiệp. Khám phá các khóa học đa dạng, từ kỹ năng mềm đến chuyên môn, với giảng viên hàng đầu và phương pháp học tập hiệu quả.',
}

const Home = () => {
  return <HomeView />
}
export default Home
