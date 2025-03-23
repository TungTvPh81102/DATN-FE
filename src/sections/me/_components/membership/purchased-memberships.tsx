import { useState } from 'react'
import {
  Award,
  Calendar,
  Check,
  Clock,
  CreditCard,
  RefreshCw,
  Badge,
  ChevronDown,
} from 'lucide-react'
import { formatDate, formatStringToCurrency } from '@/lib/common'
import { IPurchasedMembership } from '@/types/Common'

interface PurchasedMembershipsProps {
  data: IPurchasedMembership[]
}

export const PurchasedMemberships = ({ data }: PurchasedMembershipsProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-4 rounded-full bg-gray-50 p-4 shadow-inner">
            <CreditCard className="size-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Bạn chưa mua gói Membership nào!
          </h3>
          <p className="mb-6 text-gray-500">
            Đăng ký ngay để trải nghiệm tất cả khóa học không giới hạn.
          </p>
          <button className="rounded-full bg-gradient-to-r from-[#E27447] to-[#F08A60] px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:from-[#d86535] hover:to-[#e77a4f] hover:shadow-xl">
            Khám phá gói membership
          </button>
        </div>
      </div>
    )
  }

  const getPlanType = (months: number) => {
    if (months === 3)
      return {
        name: 'Tiết kiệm',
        icon: <Clock size={22} className="text-blue-600" />,
        color: 'from-blue-600 to-cyan-500',
        bgColor: 'bg-blue-50/80',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-100',
      }
    if (months === 6)
      return {
        name: 'Tối ưu',
        icon: <CreditCard size={22} className="text-green-600" />,
        color: 'from-green-600 to-teal-500',
        bgColor: 'bg-green-50/80',
        textColor: 'text-green-700',
        borderColor: 'border-green-100',
      }
    return {
      name: 'Siêu lợi ích',
      icon: <Award size={22} className="text-orange-600" />,
      color: 'from-orange-600 to-red-500',
      bgColor: 'bg-orange-50/80',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-100',
    }
  }

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const sortedData = [...data].sort(
    (a, b) =>
      calculateDaysRemaining(b.end_date) - calculateDaysRemaining(a.end_date)
  )

  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Gói Membership của bạn
        </h3>
        <p className="mt-1 text-gray-600">
          Theo dõi và quản lý các gói Membership đang hoạt động.
        </p>
      </div>

      <div className="space-y-6">
        {sortedData.map((membership) => {
          const planType = getPlanType(
            membership.membership_plan.duration_months
          )
          const daysRemaining = calculateDaysRemaining(membership.end_date)
          const isExpanded = expandedId === membership.id

          const isActive = membership.status === 'active'
          const isExpiring = daysRemaining <= 7 && daysRemaining > 0
          const statusBadge = isActive
            ? isExpiring
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-700'

          return (
            <div
              key={membership.id}
              className={`overflow-hidden rounded-xl border ${planType.borderColor} bg-white shadow-md transition-all duration-300 hover:shadow-xl`}
            >
              <div
                className={`${planType.bgColor} cursor-pointer p-5`}
                onClick={() => setExpandedId(isExpanded ? null : membership.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-md">
                      {planType.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {membership.membership_plan.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge} shadow-sm`}
                        >
                          {isActive
                            ? isExpiring
                              ? 'Sắp hết hạn'
                              : 'Đang hoạt động'
                            : 'Hết hạn'}
                        </span>
                        <span className="font-medium">
                          {formatStringToCurrency(
                            membership.membership_plan.price
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col space-y-2 md:mt-0 md:text-right">
                    <div className="flex items-center gap-2 text-sm md:justify-end">
                      <Calendar size={18} className="text-gray-500" />
                      <span className="font-medium text-gray-700">
                        {formatDate(membership.start_date)} -{' '}
                        {formatDate(membership.end_date)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm md:justify-end">
                        <RefreshCw size={18} className="text-gray-500" />
                        <span
                          className={`font-semibold ${daysRemaining <= 7 && daysRemaining > 0 ? 'text-yellow-600' : daysRemaining <= 0 ? 'text-red-600' : 'text-gray-700'}`}
                        >
                          {daysRemaining > 0
                            ? `Còn ${daysRemaining} ngày`
                            : 'Đã hết hạn'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-center">
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                  <div className="mb-5">
                    <h5 className="font-semibold text-gray-800">Mô tả gói:</h5>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {membership.membership_plan.description}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-700">
                      Quyền lợi thành viên:
                    </h5>
                    <ul className="mt-3 grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                      {membership.membership_plan.benefits.map(
                        (benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-0.5 shrink-0">
                              <div
                                className={`flex size-5 items-center justify-center rounded-full bg-gradient-to-r ${planType.color} text-white`}
                              >
                                <Check size={12} className="text-white" />
                              </div>
                            </div>
                            <span className="text-sm text-gray-700">
                              {benefit}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {isActive && daysRemaining <= 30 && (
                    <div className="rounded-lg bg-yellow-50/80 p-4 shadow-inner">
                      <div className="flex items-start gap-3">
                        <Badge size={18} className="mt-0.5 text-yellow-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-yellow-800">
                            Membership sắp hết hạn
                          </p>
                          <p className="text-sm text-yellow-700">
                            Gia hạn ngay để tiếp tục hưởng quyền lợi không gián
                            đoạn.
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button className="rounded-full bg-gradient-to-r from-[#E27447] to-[#F08A60] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-[#d86535] hover:to-[#e77a4f] hover:shadow-lg">
                          Gia hạn ngay
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
