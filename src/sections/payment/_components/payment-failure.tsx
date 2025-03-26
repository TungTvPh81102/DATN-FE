import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Home,
  RefreshCcw,
  XCircle,
} from 'lucide-react'

import PaymentSupport from '@/sections/payment/_components/payment-support'

interface Props {
  error: any
}

const PaymentFailureView = ({ error }: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-red-50 to-orange-50 p-4">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eac922347aa1')] bg-cover bg-center opacity-5" />

      <div className="relative z-10 w-full max-w-xl space-y-6">
        <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
          <div className="animate-gradient relative overflow-hidden bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 p-6 text-white">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="animate-[pulse_5s_ease-in-out_infinite] rounded-xl bg-white/20 p-3 shadow-lg">
                  <XCircle
                    className="size-8 animate-[spin_4s_linear_infinite]"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Thanh toán thất bại
                  </h2>
                  <p className="mt-1 text-sm text-red-50">
                    Giao dịch của bạn chưa thể hoàn tất
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className="mt-0.5 size-5 shrink-0 text-red-500"
                  strokeWidth={1.5}
                />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-red-900">
                    Chi tiết lỗi
                  </h3>
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-2 text-xs text-red-700">
                      <span className="text-red-600">Mã lỗi:</span>
                      <code className="rounded-md bg-red-100 px-2 py-0.5 font-mono text-red-900">
                        {error}
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Link
                href="/checkout"
                className="animate-gradient group mb-2 inline-block w-full rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-white focus:text-white"
              >
                <span className="flex items-center justify-center gap-2">
                  <RefreshCcw
                    className="size-4 transition-transform duration-500 group-hover:rotate-180"
                    strokeWidth={1.5}
                  />
                  <span>Thử lại thanh toán</span>
                  <ArrowRight
                    className="size-4 -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    strokeWidth={1.5}
                  />
                </span>
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
export default PaymentFailureView
