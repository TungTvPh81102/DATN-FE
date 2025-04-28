import { AboutUsView } from '@/sections/about-us/view/about-us-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Về chúng tôi',
}

const AboutPage = () => {
  return <AboutUsView />
}

export default AboutPage
