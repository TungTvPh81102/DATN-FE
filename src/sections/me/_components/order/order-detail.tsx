import React from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  Receipt,
  Sparkles,
  User,
  Wallet,
} from 'lucide-react'

import { formatCurrency, formatDate } from '@/lib/common'

interface OrderDetailProps {
  getOrderByIdData: any
  onBack: () => void
}

const OrderDetailView = ({ getOrderByIdData, onBack }: OrderDetailProps) => {
  const orderData = getOrderByIdData?.data
  const isCourseOrder = orderData?.invoice_type === 'course'
  const isMembershipOrder = orderData?.invoice_type === 'membership'

  return (
    <div className="m-2 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="animate-slide-up mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="rounded-full bg-white p-1.5 text-gray-600 transition-all hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Chi tiết đơn hàng
            </h1>
          </div>
          {/*<div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-1.5 text-orange-700 shadow-sm">*/}
          {/*  <CheckCircle className="size-4" />*/}
          {/*  <span className="text-sm font-medium">{orderData?.status}</span>*/}
          {/*</div>*/}
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-1.5 text-green-700 shadow-sm">
            <CheckCircle className="size-4" />
            <span className="text-sm font-medium">{orderData?.status}</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="animate-slide-up animation-delay-100 overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="border-b bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Receipt className="size-4 text-white" />
                  <h2 className="text-base font-semibold text-white">
                    Thông tin đơn hàng
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-50 to-amber-100 p-4 transition-all hover:shadow-md">
                      <div className="relative z-10">
                        <div className="mb-3 inline-flex rounded-full bg-white/80 p-2 text-orange-600 shadow-sm backdrop-blur-sm">
                          <FileText className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-orange-900/60">
                            Mã đơn hàng
                          </p>
                          <p className="mt-1 text-sm font-semibold text-orange-900">
                            {orderData?.code}
                          </p>
                        </div>
                      </div>
                      <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4">
                        <FileText className="size-16 text-orange-400/20" />
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 p-4 transition-all hover:shadow-md">
                      <div className="relative z-10">
                        <div className="mb-3 inline-flex rounded-full bg-white/80 p-2 text-amber-600 shadow-sm backdrop-blur-sm">
                          <Clock className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-900/60">
                            Thời gian mua
                          </p>
                          <p className="mt-1 text-sm font-semibold text-amber-900">
                            {formatDate(orderData?.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4">
                        <Clock className="size-16 text-amber-400/20" />
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-50 to-amber-100 p-4 transition-all hover:shadow-md">
                      <div className="relative z-10">
                        <div className="mb-3 inline-flex rounded-full bg-white/80 p-2 text-orange-600 shadow-sm backdrop-blur-sm">
                          <CreditCard className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-orange-900/60">
                            Loại đơn hàng
                          </p>
                          <p className="mt-1 text-sm font-semibold text-orange-900">
                            {isCourseOrder ? 'Khóa học' : 'Gói thành viên'}
                          </p>
                        </div>
                      </div>
                      <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4">
                        <CreditCard className="size-16 text-orange-400/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-slide-up animation-delay-200 overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="border-b bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-white" />
                  <h2 className="text-base font-semibold text-white">
                    {isCourseOrder
                      ? 'Thông tin khóa học'
                      : 'Thông tin gói thành viên'}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 p-6">
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="inline-flex rounded-full bg-white/80 p-2 text-orange-600 shadow-sm backdrop-blur-sm">
                            <BookOpen className="size-4" />
                          </div>
                          <h3 className="text-base font-semibold text-orange-900">
                            {isCourseOrder
                              ? orderData?.course?.name
                              : orderData?.membership_plan?.name}
                          </h3>
                        </div>
                        {isCourseOrder && (
                          <div className="flex items-center gap-2 text-orange-900/70">
                            <div className="inline-flex rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm">
                              <User className="size-4" />
                            </div>
                            <span className="text-sm font-medium">
                              Giảng viên: {orderData?.course?.instructor?.name}
                            </span>
                          </div>
                        )}
                        {isMembershipOrder && (
                          <div className="flex items-center gap-2 text-orange-900/70">
                            <div className="inline-flex rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm">
                              <User className="size-4" />
                            </div>
                            <span className="text-sm font-medium">
                              Giảng viên:{' '}
                              {orderData?.membership_plan?.instructor?.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-orange-600 shadow-sm backdrop-blur-sm">
                        <BadgeCheck className="size-4" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4">
                    <GraduationCap className="size-32 text-orange-400/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="animate-slide-up animation-delay-300 sticky top-6 rounded-xl border bg-white shadow-sm">
              <div className="border-b bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Wallet className="size-4 text-white" />
                  <h2 className="text-base font-semibold text-white">
                    Chi tiết thanh toán
                  </h2>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-gray-600">Giá gốc</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(orderData?.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                  <div className="flex items-center gap-1.5 text-orange-600">
                    <Sparkles className="size-4" />
                    <span className="text-sm">Mã giảm giá: </span>
                  </div>
                  <span className="text-sm font-medium text-orange-600">
                    {orderData?.coupon_code || 'Không có mã giảm giá'}
                  </span>
                </div>
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-gray-600">Giảm giá</span>
                  <span className="text-sm font-medium text-orange-600">
                    - {formatCurrency(orderData?.coupon_discount || 0)}
                  </span>
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-orange-900">
                        Tổng thanh toán
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        {formatCurrency(orderData?.final_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailView
