import { TermsView } from '@/sections/terms/view/terms-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description:
    'Đọc và hiểu rõ các điều khoản sử dụng dịch vụ của chúng tôi. Các quy định và cam kết liên quan đến việc sử dụng nền tảng học trực tuyến, bảo mật thông tin và quyền lợi của người dùng.',
}

const TermsPage = () => {
  return <TermsView />
}

export default TermsPage
