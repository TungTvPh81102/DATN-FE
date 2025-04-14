'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

import CertificatePage from '@/app/(website)/my-courses/certificate/page'
import CouponPage from '@/app/(website)/my-courses/coupons/page'
import AllCoursesPage from '@/app/(website)/my-courses/page'
import WishlistPage from '@/app/(website)/my-courses/wishlist/page'
import MembershipPage from '@/app/(website)/my-courses/membership/page'
import MyCourseHistoryPage from '@/app/(website)/my-courses/history/page'

type TabType =
  | 'all'
  | 'wishlist'
  | 'certificate'
  | 'coupon'
  | 'membership'
  | 'courses-history'

export default function MyCoursesLayout() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialTab = searchParams.get('tab') || 'all'
  const [activeTab, setActiveTab] = useState<TabType>(initialTab as TabType)

  useEffect(() => {
    router.push(`/my-courses?tab=${activeTab}`, { scroll: false })
  }, [activeTab, router])

  const handleTabChange = (
    tab:
      | 'all'
      | 'wishlist'
      | 'certificate'
      | 'coupon'
      | 'membership'
      | 'courses-history'
  ) => {
    setActiveTab(tab)
    router.push(`/my-courses?tab=${tab}`)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllCoursesPage />
      case 'wishlist':
        return <WishlistPage />
      case 'certificate':
        return <CertificatePage />
      case 'coupon':
        return <CouponPage />
      case 'membership':
        return <MembershipPage />
      case 'courses-history':
        return <MyCourseHistoryPage />
      default:
        return <AllCoursesPage />
    }
  }

  return (
    <>
      <div
        style={{
          backgroundColor: '#FFEFEA',
          padding: '20px 0',
        }}
      >
        <div className="tf-container">
          <h2 className="fw-7">Học tập của tôi</h2>
          <p className="mt-2 text-gray-600">
            Quản lý tất cả các khóa học và hoạt động học tập của bạn
          </p>
        </div>
        <div className="tf-container mt-4">
          <div className="flex gap-6">
            {[
              { id: 'all', label: 'Tất cả các khoá học' },
              { id: 'wishlist', label: 'Danh sách khoá học yêu thích' },
              { id: 'certificate', label: 'Chứng chỉ đã nhận' },
              { id: 'coupon', label: 'Mã giảm giá của tôi' },
              { id: 'membership', label: 'Hội viên' },
              { id: 'courses-history', label: 'Khóa học gần đây' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`relative py-2 text-[16px] transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'font-semibold text-black'
                    : 'text-gray-500'
                }`}
                onClick={() => handleTabChange(tab.id as any)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-black"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="tf-container mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
