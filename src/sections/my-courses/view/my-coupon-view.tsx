'use client'

import React, { useEffect, useState } from 'react'
import { Loader2, Gift, Clock, Tag, Ticket } from 'lucide-react'

import { formatCurrency, formatPercentage } from '@/lib/common'
import { useGetCouponUser } from '@/hooks/user/useUser'
import Link from 'next/link'

const MyCouponView = () => {
  const [coupon, setMyCoupon] = useState<any[]>([])
  const PRIMARY_COLOR = '#E27447'

  const { data: couponData, isLoading } = useGetCouponUser()

  useEffect(() => {
    if (!isLoading && couponData) {
      setMyCoupon(couponData?.data)
    }
  }, [couponData, isLoading])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2
            className="size-10 animate-spin"
            style={{ color: PRIMARY_COLOR }}
          />
          <p className="text-sm" style={{ color: PRIMARY_COLOR }}>
            Đang tải...
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className="section-inner py-6">
      <div className="mb-8">
        <h2
          className="text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: PRIMARY_COLOR }}
        >
          Mã giảm giá của tôi
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Quản lý và sử dụng các mã giảm giá hiện có của bạn.
        </p>
      </div>

      {coupon.length === 0 ? (
        <div
          className="flex h-[30vh] flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center"
          style={{
            borderColor: `${PRIMARY_COLOR}30`,
            backgroundColor: `${PRIMARY_COLOR}05`,
          }}
        >
          <Gift className="mb-4 size-12" style={{ color: PRIMARY_COLOR }} />
          <h3
            className="mb-2 text-lg font-medium"
            style={{ color: PRIMARY_COLOR }}
          >
            Chưa có mã giảm giá
          </h3>
          <p className="text-sm text-gray-600">
            Bạn chưa có mã giảm giá nào. Hãy tiếp tục mua khóa học để nhận được
            các ưu đãi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {coupon.map((coupon) => (
            <div
              key={coupon.coupon.id}
              className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md"
              style={{ borderColor: `${PRIMARY_COLOR}20` }}
            >
              <div
                className="absolute -right-12 -top-12 size-24 rotate-45 opacity-20"
                style={{
                  background: `linear-gradient(to bottom right, ${PRIMARY_COLOR}, ${PRIMARY_COLOR}DD)`,
                }}
              ></div>

              <div className="absolute -left-1 top-4">
                <div className="flex items-center">
                  <div
                    className="h-6 w-2 rounded-r"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                  ></div>
                  <div
                    className="ml-1 flex h-8 items-center rounded-r px-3"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                  >
                    <Ticket className="mr-1 size-3 text-white" />
                    <span className="text-xs font-medium text-white">
                      {coupon.coupon.discount_type === 'percentage'
                        ? 'GIẢM %'
                        : 'GIẢM GIÁ'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2 p-6 pt-12">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="size-4" style={{ color: PRIMARY_COLOR }} />
                    <h4
                      className="font-mono text-base font-medium"
                      style={{ color: PRIMARY_COLOR }}
                    >
                      {coupon.coupon.code}
                    </h4>
                  </div>
                  {coupon.coupon.discount_type === 'percentage' ? (
                    <span
                      className="rounded-full px-3 py-1 text-sm font-bold text-white"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                      {formatPercentage(coupon.coupon.discount_value)}
                    </span>
                  ) : (
                    <span
                      className="rounded-full px-3 py-1 text-sm font-bold text-white"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                      {formatCurrency(coupon.coupon.discount_value)}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock
                      className="size-4"
                      style={{ color: `${PRIMARY_COLOR}90` }}
                    />
                    <span>Hết hạn:</span>
                    <span
                      className={`font-medium ${coupon.expired_at ? 'text-gray-900' : 'italic text-gray-500'}`}
                    >
                      {coupon.expired_at || 'Không giới hạn'}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="border-t px-6 py-4"
                style={{
                  borderColor: `${PRIMARY_COLOR}15`,
                  backgroundColor: `${PRIMARY_COLOR}08`,
                }}
              >
                <Link href="/courses" className="w-full">
                  <button
                    className="w-full rounded-md py-2 text-sm font-medium text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                  >
                    Sử dụng ngay
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default MyCouponView
