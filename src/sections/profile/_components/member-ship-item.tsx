import { IMembership } from '@/types'
import { Check, Zap } from 'lucide-react'
import { formatStringToCurrency } from '@/lib/common'
import { getPlanType } from '@/components/ui/plan-type-badge'

type Props = {
  membership: IMembership
}

export const MemberShipItem = ({ membership }: Props) => {
  const isFree = Number(membership?.price) === 0

  const planType = getPlanType(membership?.duration_months)

  const monthlyCost = Number(membership?.price) / membership?.duration_months
  const baseMonthlyRate = 200000
  const savingsPercent = Math.round((1 - monthlyCost / baseMonthlyRate) * 100)

  const displayedBenefits = membership?.benefits?.slice(0, 4) || []

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg">
      {!isFree && savingsPercent > 0 && (
        <div className="absolute -right-12 top-5 rotate-45 bg-gradient-to-r from-orange-500 to-orange-400 px-12 py-1 text-xs font-semibold text-white shadow-md">
          Tiết kiệm {savingsPercent}%
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-r ${planType.color} text-white shadow-md`}
          >
            {isFree ? <Zap size={22} /> : planType.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900">{membership?.name}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-lg bg-gray-50 p-3 shadow-sm">
        <div className="flex items-baseline justify-between">
          <div>
            <span
              className={`bg-gradient-to-r ${planType.color} bg-clip-text text-2xl font-extrabold text-transparent`}
            >
              {formatStringToCurrency(membership?.price)}
            </span>
            <span className="ml-1 text-sm text-gray-500">
              /{membership?.duration_months} tháng
            </span>
          </div>
        </div>
      </div>

      {membership?.description && (
        <p className="mb-4 text-sm text-gray-600">{membership?.description}</p>
      )}

      {displayedBenefits.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-2 font-bold text-gray-700">Lợi ích khi đăng ký:</h4>
          <ul className="space-y-2">
            {displayedBenefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`flex size-5 items-center justify-center rounded-full bg-gradient-to-r ${planType.color} bg-opacity-10 text-white`}
                  >
                    <Check size={12} className="text-white" />
                  </div>
                </div>
                <span className="text-sm text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        className={`w-full rounded-lg bg-gradient-to-r ${planType.color} px-4 py-3 text-center font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg`}
      >
        {isFree ? 'Dùng thử miễn phí' : 'Đăng ký ngay'}
      </button>
    </div>
  )
}
