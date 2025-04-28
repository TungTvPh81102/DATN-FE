import { WalletView } from '@/sections/wallet/view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ví của bạn',
  description:
    'Quản lý ví của bạn: theo dõi số dư, lịch sử giao dịch và nạp/rút tiền cho các giao dịch liên quan đến khóa học và gói thành viên.',
}

const page = () => {
  return <WalletView />
}

export default page
