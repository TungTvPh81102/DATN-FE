import React, { useState } from 'react'
import { Award, Check, Clock, CreditCard, Loader2, Zap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { IMembership } from '@/types'
import { paymentMethods } from '@/constants/payment-method'
import Image from 'next/image'
import { formatCurrency, formatNumber } from '@/lib/common'
import { Separator } from '@/components/ui/separator'
import { toast } from 'react-toastify'
import { useCreatePayment } from '@/hooks/payment/usePayment'

type PaymentDialogProps = {
  membership: IMembership
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const getPlanType = (months: number) => {
  if (months <= 3)
    return {
      name: 'Cơ bản',
      icon: <Clock size={22} />,
      color: 'from-blue-500 to-cyan-500',
    }
  if (months <= 6)
    return {
      name: 'Tiêu chuẩn',
      icon: <CreditCard size={22} />,
      color: 'from-green-500 to-teal-500',
    }
  return {
    name: 'Premium',
    icon: <Award size={22} />,
    color: 'from-orange-500 to-red-500',
  }
}

const DialogPaymentMemberShip = ({
  membership,
  isOpen,
  onOpenChange,
}: PaymentDialogProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [finalPrice] = useState(membership?.price ?? 0)

  const { mutate: createPayment, isPending: isPendingCreatePayment } =
    useCreatePayment()

  const isFree = Number(membership?.price) === 0
  const originalPrice = membership?.price ?? 0
  const planType = getPlanType(membership?.duration_months)
  const allBenefits = membership?.benefits || []

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      toast.warning('Vui lòng chọn phương thức thanh toán!')
      return
    }

    switch (selectedPaymentMethod) {
      case 'momo':
      case 'vnpay':
        const paymentData = {
          amount: finalPrice,
          item_id: `${membership.id}`,
          payment_type: 'membership',
          original_amount: finalPrice,
          payment_method: selectedPaymentMethod,
        }

        createPayment(paymentData, {
          onSuccess: (res: any) => {
            window.location.replace(res.data)
          },
          onError: (res: any) => {
            toast.warning(res.message)
          },
        })
        break

      case 'credit-card':
        alert('Phương thức thanh toán thẻ tín dụng đang được phát triển')
        break

      default:
        alert('Phương thức thanh toán không hợp lệ')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-4xl">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:w-1/2">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">
                Thông tin gói hội viên
              </DialogTitle>
              <DialogDescription>
                Xác nhận thông tin gói bạn muốn đăng ký
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex size-14 items-center justify-center rounded-full bg-gradient-to-r ${planType.color} text-white shadow-lg`}
                >
                  {isFree ? <Zap size={24} /> : planType.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{membership?.name}</h3>
                  <p className="text-sm text-gray-600">{planType.name}</p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-md">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span
                      className={`bg-gradient-to-r ${planType.color} bg-clip-text text-4xl font-extrabold text-transparent`}
                    >
                      {formatCurrency(membership?.price)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      /{membership?.duration_months} tháng
                    </span>
                  </div>
                </div>
              </div>

              {membership?.description && (
                <p className="rounded-lg bg-white/50 p-4 text-sm italic text-gray-600 shadow-sm">
                  {membership?.description}
                </p>
              )}

              <div className="rounded-xl bg-white p-5 shadow-md">
                <h4 className="mb-4 font-bold text-gray-800">
                  Lợi ích khi đăng ký:
                </h4>
                <ul className="space-y-3">
                  {allBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <div
                          className={`flex size-6 items-center justify-center rounded-full bg-gradient-to-r ${planType.color} text-white shadow-sm`}
                        >
                          <Check size={14} />
                        </div>
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-6 md:w-1/2 md:border-l md:border-t-0">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">
                Thông tin thanh toán
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-5 shadow-sm">
                <Label htmlFor="price" className="text-lg font-medium">
                  Tổng thanh toán
                </Label>
                <div className="mt-2 text-3xl font-bold text-gray-900">
                  {formatNumber(Number(originalPrice))} VND
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Thanh toán một lần cho {membership?.duration_months} tháng sử
                  dụng
                </p>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  Phương thức thanh toán
                </Label>
                <div className="mt-3 grid grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary shadow'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex h-full flex-col items-center justify-center">
                        <Image
                          src={method.icon}
                          alt={method.name}
                          width={50}
                          height={50}
                          className="mx-auto mb-2"
                        />
                        <p className="text-center text-sm font-medium text-gray-700">
                          {method.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  disabled={isPendingCreatePayment}
                  onClick={handlePayment}
                  className={`w-full bg-gradient-to-r py-4 font-bold text-white ${planType.color} rounded-lg shadow-md transition-all hover:opacity-90`}
                >
                  {isPendingCreatePayment ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" />
                      <span> Loading...</span>
                    </div>
                  ) : (
                    `Thanh toán ${formatCurrency(membership?.price)}`
                  )}
                </button>

                <p className="mt-4 text-center text-sm text-gray-500">
                  Bằng cách nhấn <span className="font-bold">Thanh toán</span>,
                  bạn xác nhận đã đọc, hiểu rõ và đồng ý với các điều khoản sử
                  dụng, chính sách bảo mật và điều kiện thanh toán của chúng
                  tôi. Sau khi thanh toán thành công, bạn sẽ nhận được email xác
                  nhận và tài khoản của bạn sẽ được nâng cấp lên gói hội viên đã
                  chọn trong vòng 24 giờ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogPaymentMemberShip
