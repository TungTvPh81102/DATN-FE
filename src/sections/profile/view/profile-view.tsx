'use client'

import { UserProfile } from '@/sections/profile/_components/user-profile'
import { FollowButton } from '@/sections/profile/_components/follow-button'
import { UserAbout } from '@/sections/profile/_components/user-about'
import { CourseItem } from '@/sections/profile/_components/course-item'
import { BookText, Loader2, Users, CreditCard } from 'lucide-react'
import {
  useGetInstructorCourses,
  useGetInstructorProfile,
} from '@/hooks/instructor/profile/useGetProfile'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect, useState } from 'react'
import ModalLoading from '@/components/common/ModalLoading'
import { CoursePagination } from '@/components/common/CoursePagination'

type Props = {
  code: string
}

type TabType = 'courses' | 'membership'

export const ProfileView = ({ code }: Props) => {
  const router = useRouter()
  const { user } = useAuthStore()
  const [page, setPage] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<TabType>('courses')

  if (code === user?.code) router.push('/me')

  const {
    data: instructorProfileData,
    isLoading: instructorProfileDataLoading,
    error,
  } = useGetInstructorProfile(code)
  const { data: instructorCourseData, isLoading: instructorCourseDataLoading } =
    useGetInstructorCourses(code, page)

  useEffect(() => {
    const savePage = JSON.parse(
      localStorage.getItem('instructorCoursePage') || '{}'
    )
    setPage(savePage)
  }, [])

  const handlePageChange = (pageUrl?: string | null) => {
    if (!pageUrl) return

    const url = new URL(pageUrl)
    const page = Number(url.searchParams.get('page'))

    if (page) {
      setPage(page)
      localStorage.setItem('instructorCoursePage', JSON.stringify(page))
    }
  }

  if (instructorProfileDataLoading)
    return (
      <div className="min-h-screen">
        <ModalLoading />
      </div>
    )

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center text-5xl font-bold">
        <h2>{error?.message}!</h2>
      </div>
    )

  return (
    <div className="mx-auto mb-16 mt-9 grid w-[90%] grid-cols-12 gap-16">
      <div className="col-span-3 space-y-5">
        {/* Avatar, Name and Bio */}
        <UserProfile
          name={instructorProfileData?.instructor?.name ?? ''}
          avatar={instructorProfileData?.instructor?.avatar ?? ''}
          bio={instructorProfileData?.instructor?.bio ?? []}
          aboutMe={instructorProfileData?.instructor?.about_me ?? ''}
          avgRating={instructorProfileData?.instructor?.avg_rating ?? '0'}
        />

        {/* Button Follow */}
        <FollowButton code={instructorProfileData?.instructor?.code ?? ''} />

        {/* About */}
        <UserAbout
          totalFollowers={
            instructorProfileData?.instructor?.total_followers ?? 0
          }
          totalCourses={instructorProfileData?.instructor?.total_courses ?? 0}
          timeJoined={
            instructorProfileData?.instructor?.created_at ?? new Date()
          }
          email={instructorProfileData?.instructor?.email ?? ''}
          address={instructorProfileData?.instructor?.address ?? ''}
          phone={instructorProfileData?.instructor?.phone ?? ''}
        />
      </div>

      <div className="col-span-9">
        <div className="mb-6 flex border-b">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center space-x-2 px-6 py-3 text-base font-medium transition-all duration-200 ${
              activeTab === 'courses'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookText size={18} />
            <span>
              Khóa học ({instructorProfileData?.instructor?.total_courses})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('membership')}
            className={`flex items-center space-x-2 px-6 py-3 text-base font-medium transition-all duration-200 ${
              activeTab === 'membership'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CreditCard size={18} />
            <span>Membership</span>
          </button>
        </div>

        {activeTab === 'courses' && (
          <>
            {instructorCourseDataLoading ? (
              <div className="flex size-full items-center justify-center py-16">
                <Loader2 className="mx-auto size-8 animate-spin text-orange-500" />
              </div>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-3 gap-6">
                  {instructorCourseData?.courses &&
                  instructorCourseData?.courses?.data?.length > 0 ? (
                    instructorCourseData?.courses?.data?.map((course: any) => (
                      <CourseItem course={course} key={course.id} />
                    ))
                  ) : (
                    <p className="text-xl font-bold">
                      Danh sách khóa học trống...
                    </p>
                  )}
                </div>

                {instructorCourseData?.courses && (
                  <CoursePagination
                    data={instructorCourseData.courses}
                    handlePageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'membership' && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Gói Membership
              </h3>
              <button className="rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
                Xem tất cả
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-orange-100 bg-orange-50 p-4 shadow-sm transition hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-orange-500 text-white">
                      <CreditCard size={20} />
                    </div>
                    <h4 className="font-bold text-gray-900">Premium</h4>
                  </div>
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
                    Phổ biến
                  </span>
                </div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    1.200.000₫
                  </span>
                  <span className="text-sm text-gray-500">/năm</span>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  Truy cập không giới hạn tất cả khóa học của giảng viên
                </p>
                <button className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600">
                  Đăng ký ngay
                </button>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-500 text-white">
                      <CreditCard size={20} />
                    </div>
                    <h4 className="font-bold text-gray-900">Basic</h4>
                  </div>
                </div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    150.000₫
                  </span>
                  <span className="text-sm text-gray-500">/tháng</span>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  Truy cập các khóa học cơ bản và hỗ trợ cơ bản
                </p>
                <button className="w-full rounded-lg border border-blue-500 bg-white px-4 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-50">
                  Đăng ký ngay
                </button>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-green-500 text-white">
                      <Users size={20} />
                    </div>
                    <h4 className="font-bold text-gray-900">Dùng thử</h4>
                  </div>
                  <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                    Miễn phí
                  </span>
                </div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">0₫</span>
                  <span className="text-sm text-gray-500">/7 ngày</span>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  Truy cập một số khóa học và tính năng giới hạn
                </p>
                <button className="w-full rounded-lg border border-green-500 bg-white px-4 py-2 text-sm font-medium text-green-500 transition hover:bg-green-50">
                  Dùng thử miễn phí
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
