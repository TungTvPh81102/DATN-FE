import React, { useEffect, useState } from 'react'
import { Award, Loader } from 'lucide-react'
import { PurchasedMemberships } from '@/sections/me/_components/membership/purchased-memberships'
import { useGetMemberships } from '@/hooks/order/useOrder'
import { IPurchasedMembership } from '@/types/Common'

const Membership = () => {
  const [purchasedMemberships, setPurchasedMemberships] = useState<
    IPurchasedMembership[]
  >([])

  const { data, isLoading } = useGetMemberships()

  useEffect(() => {
    if (data && data.data) {
      setPurchasedMemberships(data.data)
    }
  }, [data])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-orange-100">
            <Award size={20} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Membership của tôi
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <div className="flex flex-col items-center gap-2">
            <Loader className="size-8 animate-spin text-orange-500" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : (
        <>
          <PurchasedMemberships data={purchasedMemberships} />

          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Các câu hỏi thường gặp
            </h3>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-800">
                  Làm thế nào để gia hạn Membership?
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Bạn có thể gia hạn Membership bằng cách đăng ký một gói mới
                  trước khi gói hiện tại hết hạn. Hệ thống sẽ tự động cộng thêm
                  thời gian vào gói hiện tại của bạn.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-800">
                  Tôi có thể hủy Membership không?
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Membership không thể hủy sau khi đã đăng ký. Tuy nhiên, bạn có
                  thể liên hệ với đội ngũ hỗ trợ để được giải đáp thắc mắc hoặc
                  được hướng dẫn trong trường hợp đặc biệt.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-800">
                  Tôi có thể nâng cấp lên gói cao hơn không?
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Có, bạn có thể nâng cấp lên gói cao hơn bất kỳ lúc nào. Phí
                  nâng cấp sẽ được tính dựa trên thời gian còn lại của gói hiện
                  tại và giá trị của gói mới.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Membership
