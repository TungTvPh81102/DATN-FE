'use client'

import { UserProfile } from '@/sections/profile/_components/user-profile'
import { FollowButton } from '@/sections/profile/_components/follow-button'
import { UserAbout } from '@/sections/profile/_components/user-about'
import { CourseItem } from '@/sections/profile/_components/course-item'
import { BookText, CreditCard, Loader2 } from 'lucide-react'
import {
  useGetInstructorCourses,
  useGetInstructorProfile,
} from '@/hooks/instructor/profile/useGetProfile'
import { useEffect, useState } from 'react'
import ModalLoading from '@/components/common/ModalLoading'
import { CoursePagination } from '@/components/common/CoursePagination'
import { useGetMembershipPlans } from '@/hooks/instructor/membership/useGetMembershipPlans'
import { MembershipTab } from '@/sections/profile/_components/membership-tab'

type Props = {
  code: string
}

type TabType = 'courses' | 'membership'

export const ProfileView = ({ code }: Props) => {
  const [page, setPage] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<TabType>('courses')

  const {
    data: instructorProfileData,
    isLoading: instructorProfileDataLoading,
    error,
  } = useGetInstructorProfile(code)
  const { data: instructorCourseData, isLoading: instructorCourseDataLoading } =
    useGetInstructorCourses(code, page)
  const { data: membershipData, isLoading: membershipDataLoading } =
    useGetMembershipPlans(code)

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

  if (instructorProfileDataLoading || membershipDataLoading)
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
    <div className="mx-auto mb-16 mt-9 grid w-[90%] grid-cols-12 gap-8">
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
            <span>Membership ({membershipData?.data?.length})</span>
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
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Danh sách khoá học của:{' '}
                    {instructorProfileData?.instructor?.name ?? ''}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Dưới đây là tất cả các khóa học được giảng dạy bởi giảng
                    viên. Mỗi khóa học được thiết kế chi tiết với nội dung
                    chuyên sâu, giúp học viên có thể nắm vững kiến thức và áp
                    dụng thực tế một cách hiệu quả.
                  </p>
                </div>
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
          <MembershipTab data={membershipData?.data ?? []} />
        )}
      </div>
    </div>
  )
}
