import { cn } from '@/lib/utils'

import {
  Banner,
  BecomeInstructorBanner,
  CourseList,
  PostList,
} from '@/sections/home/components'
import InstructorTop from '@/sections/home/components/instructor-top'

import '@/styles/custom-swiper-pagination.css'

const HomeView = () => {
  return (
    <div>
      <Banner />
      <div className="main-content pb-63">
        <CourseList
          title="Khoá học đang giảm giá"
          description="Hãy bắt đầu hành trình học tập của bạn cùng chúng tôi ngay bây giờ."
        />

        <CourseList
          title="Khoá học miễn phí"
          description="Hãy bắt đầu hành trình học tập của bạn cùng chúng tôi ngay bây giờ."
          className={cn(
            'bg-[url(https://s3-alpha-sig.figma.com/img/dc1f/d94d/f6062d52cb24787dd4070f8f28665f00?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=msXWjHCzmyRLCRoMTIKW7oM533gYO7PoBUSAyzxWA-rWbiHdWdQ3UQEpWeCEfK-LpPfzoHuC0T2EQxWeRhLynYBABBRzTB2O3d-YgIiBSivaicFtCFu67IGcuBy-PkKehS8N7Ban0N~cpmYaogTCg4kI7ZM4sfn1hoqIoCZ7ocN3d8yQejR8Z8yKOzvRuxCZ5ImeDoPWX8ziaG-eCr1PLnCl1XPU81slZ~jkN8n7Hc2Eqj~lPO~o0NQswf3vXx0-Cr6DNgHMv~TumtAF46eM4mE2hqP1dY7klGy7NxSuwDMT-GPqoS33LJLeKNXKpqwXnbhEIVaC13t2Iz2wzIagiQ__)]',
            'bg-cover bg-top'
          )}
        />

        <InstructorTop
          title="Giảng viên hàng đầu"
          description="Hãy bắt đầu hành trình học tập của bạn cùng chúng tôi ngay bây giờ."
        />

        <BecomeInstructorBanner />

        <PostList
          title={'Bài viết nổi bật'}
          description={'Hãy bắt đầu khám phá bản tin của chúng tôi.'}
        />
      </div>
    </div>
  )
}
export default HomeView
