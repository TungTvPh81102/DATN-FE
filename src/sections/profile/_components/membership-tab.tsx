import { IMembership } from '@/types'
import { MemberShipItem } from '@/sections/profile/_components/member-ship-item'
import { Award, Clock, CreditCard } from 'lucide-react'
import { useState } from 'react'
import DialogPaymentMemberShip from '@/sections/profile/_components/dialog-payment-member-ship'

type Props = {
  data: IMembership[]
}

export const MembershipTab = ({ data }: Props) => {
  const [selectedMembership, setSelectedMembership] =
    useState<IMembership | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenPayment = (membership: IMembership) => {
    setSelectedMembership(membership)
    setIsDialogOpen(true)
  }
  if (data?.length === 0)
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-3">
            <CreditCard className="size-10 text-gray-500" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-800">
            Danh sách Membership trống!
          </h3>
          <p className="mb-4 text-gray-500">
            Hiện tại chưa có gói Membership nào được tạo.
          </p>
          <button className="rounded-lg bg-[#E27447] px-5 py-2 font-medium text-white transition">
            Tạo gói membership mới
          </button>
        </div>
      </div>
    )

  const sortedData = [...data].sort(
    (a, b) => a.duration_months - b.duration_months
  )

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">Gói Membership</h3>
          <p>
            Tính năng này cho phép các bạn đăng ký các gói từ 3 tháng, 6 tháng
            và 1 năm. Khi các bạn đăng ký các gói này thì có thể học toàn bộ
            khóa học trong thời hạn mà các bạn chọn. Sau khi thanh toán xong thì
            các bạn có thể vào khu vực học tập để có thể truy cập các khóa học.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sortedData.map((membership) => (
            <div
              key={membership.id}
              onClick={() => handleOpenPayment(membership)}
            >
              <MemberShipItem membership={membership} key={membership?.id} />
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-gray-50 p-4">
          <h4 className="mb-3 font-bold text-gray-700">
            Về các gói Membership
          </h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                <span className="font-medium">Gói ngắn hạn (1-3 tháng)</span>
              </div>
              <p className="text-xs text-gray-600">
                Phù hợp cho người muốn dùng thử, không cần cam kết dài hạn.
              </p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <CreditCard size={18} className="text-green-500" />
                <span className="font-medium">Gói trung hạn (3-6 tháng)</span>
              </div>
              <p className="text-xs text-gray-600">
                Cân bằng giữa chi phí và thời gian cam kết, tiết kiệm hơn gói
                ngắn hạn.
              </p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Award size={18} className="text-orange-500" />
                <span className="font-medium">Gói dài hạn (6-12 tháng)</span>
              </div>
              <p className="text-xs text-gray-600">
                Giá tốt nhất, phù hợp cho người dùng lâu dài, cam kết sử dụng
                thường xuyên.
              </p>
            </div>
          </div>
        </div>
      </div>
      {selectedMembership && (
        <DialogPaymentMemberShip
          membership={selectedMembership}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  )
}
