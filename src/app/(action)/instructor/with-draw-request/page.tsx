import WithDrawRequestView from '@/sections/instructor/view/with-draw-request-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh sách yêu cầu rút tiền',
  description:
    'Xem và quản lý các yêu cầu rút tiền từ ví: duyệt, từ chối và theo dõi trạng thái các giao dịch rút tiền của học viên hoặc giảng viên.',
}

const Page = () => {
  return <WithDrawRequestView />
}

export default Page
