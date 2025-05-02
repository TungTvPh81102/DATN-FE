import LuckyWheelView from '@/sections/lucky-wheel/lucky-wheel-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vòng quay may mắn - Nhận quà hấp dẫn cùng CourseMely',
  description:
    'Tham gia vòng quay may mắn trên CourseMely để nhận các phần thưởng hấp dẫn như mã giảm giá, khóa học miễn phí và nhiều ưu đãi bất ngờ khác. Quay ngay để thử vận may của bạn!',
}

const page = () => {
  return (
    <div>
      <LuckyWheelView />
    </div>
  )
}
export default page
