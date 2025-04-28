import { AboutUsView } from '@/sections/about-us/view/about-us-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description:
    'Tìm hiểu về đội ngũ, sứ mệnh và tầm nhìn của chúng tôi. Chúng tôi cam kết mang lại những khóa học chất lượng cao, giúp bạn phát triển kỹ năng và tiến bộ trong sự nghiệp.',
}

const AboutPage = () => {
  return <AboutUsView />
}

export default AboutPage
