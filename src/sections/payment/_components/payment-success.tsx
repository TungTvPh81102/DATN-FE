import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Gift,
  Home,
  Star,
} from 'lucide-react'

import PaymentSupport from '@/sections/payment/_components/payment-support'

const PaymentSuccessView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
      <div className="animate-slide-in w-full max-w-xl space-y-6">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow duration-500">
          <div className="animate-gradient relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-10 text-white">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eac922347aa1')] bg-cover bg-center opacity-10 mix-blend-overlay" />

            <div className="absolute left-0 top-0 size-full">
              <div className="absolute left-4 top-4 size-24 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-4 right-4 size-32 rounded-full bg-white/10 blur-2xl" />
            </div>

            <div className="relative z-10 text-center">
              <div className="mb-6 flex justify-center">
                <div className="animate-[bounce_5s_ease-in-out_infinite] rounded-full bg-white/20 p-5 shadow-lg shadow-emerald-900/20 backdrop-blur-xl">
                  <CheckCircle
                    className="animate-float size-10"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">
                Thanh toán thành công!
              </h2>
              <p className="text-base text-emerald-50">
                Cảm ơn bạn đã đăng ký khóa học
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-b from-white to-emerald-50/30 px-6 py-8">
            <div className="mb-6 space-y-2 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                Bắt đầu hành trình học tập của bạn
              </h3>
              <p className="text-sm text-slate-600">
                Khám phá ngay những kiến thức thú vị đang chờ đợi
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                <div className="rounded-full bg-emerald-100 p-2">
                  <Gift className="size-4 text-emerald-600" strokeWidth={1.5} />
                </div>
                <div className="text-xs">
                  <div className="font-medium text-emerald-900">
                    Truy cập trọn đời
                  </div>
                  <div className="text-emerald-600">
                    Không giới hạn thời gian
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                <div className="rounded-full bg-emerald-100 p-2">
                  <Star className="size-4 text-emerald-600" strokeWidth={1.5} />
                </div>
                <div className="text-xs">
                  <div className="font-medium text-emerald-900">
                    Nội dung chất lượng
                  </div>
                  <div className="text-emerald-600">Cập nhật liên tục</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/my-courses">
                <button className="group mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-200/50">
                  <BookOpen className="size-4" strokeWidth={1.5} />
                  <span className="text-base">Truy cập khóa học</span>
                  <ArrowRight
                    className="size-4 -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    strokeWidth={1.5}
                  />
                </button>
              </Link>

              <Link
                href="/"
                className="inline-block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-700 focus:text-slate-700"
              >
                <span className="flex items-center justify-center gap-2">
                  <Home className="size-4 text-slate-500" strokeWidth={1.5} />
                  <span>Quay về trang chủ</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        <PaymentSupport />
      </div>
    </div>
  )
}
export default PaymentSuccessView
