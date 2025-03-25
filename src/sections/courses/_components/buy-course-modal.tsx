import React, { useState } from 'react'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { Loader2, Tag, Check, X } from 'lucide-react'
import { toast } from 'react-toastify'

import {
  formatCurrency,
  formatDuration,
  formatNumber,
  formatPercentage,
} from '@/lib/common'
import { useApplyCoupon } from '@/hooks/transation/useTransation'
import { useGetCouponUser } from '@/hooks/user/useUser'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCreatePayment } from '@/hooks/payment/usePayment'
import { paymentMethods } from '@/constants/payment-method'

interface BuyCourseModalProps {
  course: {
    id: string
    thumbnail: string
    name: string
    price: number
    price_sale: number
    chapters_count: string
    lessons_count: string
    total_video_duration: number
    user: {
      id: string
      name: string
      avatar: string
      created_at: string
    }
  }
  isOpen: boolean
  onClose: () => void
}

const BuyCourseModal = ({ course, isOpen, onClose }: BuyCourseModalProps) => {
  const [discountCode, setDiscountCode] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [finalPrice, setFinalPrice] = useState(
    course?.price_sale > 0 ? course?.price_sale : course?.price
  )
  const [isCouponApplied, setIsCouponApplied] = useState(false)
  const [hasDiscountCode, setHasDiscountCode] = useState(false)
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)

  const originalPrice =
    course?.price_sale > 0 ? course?.price_sale : course?.price

  const { data: couponData, isLoading } = useGetCouponUser()
  const { mutate: createPayment, isPending: isPendingCreatePayment } =
    useCreatePayment()
  const { mutate: applyCoupon, isPending: isPendingApplyCoupon } =
    useApplyCoupon()

  const resetPrice = () => {
    setFinalPrice(originalPrice)
    setDiscountAmount(0)
  }

  const handleApplyDiscount = () => {
    if (!discountCode) {
      toast.warning('Vui lòng nhập mã giảm giá để áp dụng!')
      return
    }

    setIsCouponApplied(false)
    resetPrice()

    applyCoupon(
      {
        code: discountCode,
        amount: originalPrice,
        course_id: course.id,
      },
      {
        onSuccess: (res: any) => {
          const { discount_amount, final_amount } = res.data
          setDiscountAmount(discount_amount)
          setFinalPrice(final_amount)
          const appliedCoupon = couponData?.data?.find(
            (coupon: any) => coupon.coupon.code === discountCode
          )
          setSelectedCoupon(appliedCoupon)
          setDiscountCode('')
          toast.success(res.message)
          setIsCouponApplied(true)
        },
        onError: (error: any) => {
          const errorMessage =
            error.message || 'Không thể áp dụng mã giảm giá. Vui lòng thử lại!'
          toast.error(errorMessage)
          setIsCouponApplied(false)
        },
      }
    )
  }

  const handleCouponSelection = (coupon: any) => {
    setDiscountCode(coupon.coupon.code)
    setIsCouponApplied(false)
    setHasDiscountCode(true)
    resetPrice()
    setSelectedCoupon(null)
    setIsCouponModalOpen(false)
  }

  const handleDiscountCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(e.target.value)
    setIsCouponApplied(false)
    setHasDiscountCode(!!e.target.value)
    resetPrice()
    setSelectedCoupon(null)
  }

  const handleOpenCouponModal = () => {
    if (isCouponApplied) {
      resetPrice()
      setIsCouponApplied(false)
      setSelectedCoupon(null)
    }
    setIsCouponModalOpen(true)
  }

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null)
    setIsCouponApplied(false)
    resetPrice()
    setDiscountAmount(0)
    setDiscountCode('')
    toast.info('Đã xóa mã giảm giá')
  }

  const handlePayment = (e: any) => {
    e.preventDefault()

    if (!selectedPaymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán')
      return
    }

    switch (selectedPaymentMethod) {
      case 'momo':
      case 'vnpay':
        const paymentData = {
          amount: finalPrice,
          item_id: `${course.id}`,
          payment_type: 'course',
          coupon_code: selectedCoupon ? selectedCoupon.coupon.code : '',
          original_amount:
            course.price_sale > 0 ? course.price_sale : course.price,
          is_discount_applied: isCouponApplied,
          payment_method: selectedPaymentMethod,
        }

        createPayment(paymentData, {
          onSuccess: (res: any) => {
            window.location.href = res.data
          },
          onError: (res: any) => {
            onClose()
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-4xl"
          onOpenAutoFocus={(e) => {
            e.preventDefault()
          }}
        >
          <div className="grid grid-cols-2 gap-8">
            <div>
              <DialogHeader>
                <DialogTitle>Thông tin khoá học</DialogTitle>
                <DialogDescription>Xác nhận mua khoá học</DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <Image
                  src={course.thumbnail}
                  alt={course.name}
                  width={400}
                  height={225}
                  className="h-[200px] rounded-lg object-cover"
                />
                <p className="mt-4 text-xl font-semibold">{course.name}</p>
                <ul className="my-2">
                  <li className="flex items-center gap-2">
                    <i className="flaticon-play-1" />
                    <p>{formatDuration(course?.total_video_duration ?? 0)}</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="flaticon-document" />
                    <p>{course?.lessons_count} bài học</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="icon-extremely" />
                    <p>Truy cập chọn đời</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="flaticon-medal" />
                    <p>Cấp chứng chỉ khi hoàn thành</p>
                  </li>
                </ul>
                <div className="mt-2 flex items-center space-x-2">
                  <Image
                    width={30}
                    height={30}
                    src={course.user.avatar}
                    alt={course.user.name}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <span className="text-sm text-gray-600">
                      By {course.user.name}
                    </span>
                    <span className="block text-xs text-gray-400">
                      Tham gia{' '}
                      {format(parseISO(course.user.created_at), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <DialogHeader>
                <DialogTitle>Thông tin thanh toán</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="price">Số tiền gốc</Label>
                  <Input
                    id="price"
                    value={`${formatNumber(originalPrice)} VND`}
                    readOnly
                    className="mt-1"
                  />
                </div>

                {isCouponApplied && selectedCoupon && (
                  <div className="rounded-md border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="size-4 text-green-600" />
                        <span className="font-medium text-green-700">
                          Mã giảm giá đang áp dụng
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="size-7 rounded-full p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                    <div className="mt-2 rounded-md bg-white p-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {selectedCoupon.coupon.code}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedCoupon.coupon.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {selectedCoupon.coupon.discount_type ===
                            'percentage'
                              ? `${formatPercentage(selectedCoupon.coupon.discount_value)}`
                              : `- ${formatCurrency(selectedCoupon.coupon.discount_value)} `}
                          </p>
                          <p className="text-xs text-gray-500">
                            Tiết kiệm: {formatNumber(discountAmount)} VND
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isCouponApplied && (
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="discount">Mã giảm giá</Label>
                      <Badge
                        className="cursor-pointer"
                        onClick={handleOpenCouponModal}
                      >
                        Chọn mã
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="discount"
                        placeholder="Nhập mã giảm giá"
                        value={discountCode}
                        onChange={handleDiscountCodeInput}
                        className="mt-1 flex-1"
                      />
                      <Button
                        disabled={!discountCode || isPendingApplyCoupon}
                        onClick={handleApplyDiscount}
                        className="mt-1"
                      >
                        {isPendingApplyCoupon ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin" /> Loading...
                          </div>
                        ) : (
                          'Áp dụng'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Giá gốc:</span>
                    <span>{formatNumber(originalPrice)} VND</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="text-red-500">
                        -{formatNumber(discountAmount)} VND
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t pt-2 text-lg font-semibold">
                    <span>Tổng thanh toán:</span>
                    <span className="text-green-600">
                      {formatNumber(finalPrice)} VND
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Phương thức thanh toán</Label>
                  <div className="mt-2 grid grid-cols-3 gap-4">
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
                            width={80}
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
              </div>

              <Button
                disabled={
                  (hasDiscountCode && !isCouponApplied) ||
                  isPendingCreatePayment
                }
                onClick={handlePayment}
                className="mt-6 w-full"
              >
                {isPendingCreatePayment ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Loading...
                  </div>
                ) : (
                  'Thanh toán'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isCouponModalOpen}
        onOpenChange={(open) => {
          if (!open && isCouponApplied && selectedCoupon) {
            setIsCouponModalOpen(false)
          } else {
            setIsCouponModalOpen(open)
            if (!open) {
              if (!isCouponApplied) {
                resetPrice()
              }
            }
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chọn mã giảm giá</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-2 size-6 animate-spin" />
              <span>Đang tải mã giảm giá...</span>
            </div>
          ) : couponData?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Tag className="mb-4 size-12 text-gray-400" strokeWidth={1.5} />
              <h3 className="mb-2 text-lg font-medium text-gray-700">
                Chưa có mã giảm giá
              </h3>
              <p className="max-w-md text-gray-500">
                Bạn chưa có mã giảm giá nào. Vui lòng theo dõi các chương trình
                khuyến mãi để nhận mã giảm giá mới.
              </p>
              <div
                className="mt-6 cursor-pointer rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                onClick={() => setIsCouponModalOpen(false)}
              >
                Đóng
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {couponData?.data?.map((coupon: any) => {
                const isDisabled =
                  coupon.coupon.specific_course === 1 &&
                  !coupon.coupon.coupon_courses.some(
                    (courseItem: any) => courseItem.id === course.id
                  )

                const isSelected =
                  selectedCoupon &&
                  selectedCoupon.coupon.code === coupon.coupon.code

                return (
                  <div
                    key={coupon.id}
                    className={`rounded-lg border p-4 ${
                      isDisabled
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer transition-all hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      if (!isDisabled) handleCouponSelection(coupon)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className="mb-2 bg-orange-100 text-orange-600 hover:bg-blue-100">
                          {coupon.coupon.code}
                        </Badge>
                        <p className="font-medium">{coupon.coupon.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-orange-600">
                          {coupon.coupon.discount_type === 'percentage'
                            ? `${formatPercentage(coupon.coupon.discount_value)}`
                            : `- ${formatCurrency(coupon.coupon.discount_value)} `}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-2 flex items-center text-green-600">
                        <Check className="mr-1 size-4" />
                        <p className="text-sm font-medium">
                          Mã đang được áp dụng
                        </p>
                      </div>
                    )}

                    {isDisabled && (
                      <p className="mt-2 text-sm text-red-500">
                        Mã này không áp dụng cho khoá học này
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BuyCourseModal
