import PaymentView from '@/sections/payment/view/payment-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thông tin thanh toán',
  description:
    'Quản lý thông tin thanh toán của bạn: cập nhật phương thức thanh toán, theo dõi lịch sử giao dịch và đảm bảo các giao dịch thanh toán được thực hiện một cách an toàn và thuận tiện.',
}

const PaymentPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) => {
  const status = searchParams.status || 'unknown'
  const error = searchParams.error || null

  return <PaymentView status={status} error={error} />
}

export default PaymentPage
