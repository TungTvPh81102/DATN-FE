import PaymentView from '@/sections/payment/view/payment-view'

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
