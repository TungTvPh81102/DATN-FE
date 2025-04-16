'use client'
import { useGetRecentCourse } from '@/hooks/user/useUser'
import { Gift, Loader2, PlayCircle, Search } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const MyCourseHistoryView = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const { data: RecentCourseData, isLoading: isLoadingRecentCourse } =
    useGetRecentCourse()

  if (isLoadingRecentCourse) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2
            className="size-10 animate-spin"
            style={{ color: '#E27447' }}
          />
          <p className="text-sm" style={{ color: '#E27447' }}>
            Đang tải...
          </p>
        </div>
      </div>
    )
  }
  if (
    !RecentCourseData?.data?.courses ||
    RecentCourseData.data.courses.length === 0
  ) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <Gift className="size-16 text-gray-400" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Chưa có khóa học nào gần đây
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Bạn chưa tham gia khóa học nào gần đây.
          </p>
        </div>
        <Link href="/courses">
          <Button variant="default" className="gap-2">
            <Gift className="size-4" />
            Khám phá khóa học
          </Button>
        </Link>
      </div>
    )
  }

  const filteredCourses = RecentCourseData?.data.courses.filter((course: any) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil((filteredCourses?.length || 0) / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCourses = filteredCourses?.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <div>
      <section className="wg-table mt-10">
        <div className="row justify-center">
          <div className="col-xl-10 col-sm-12">
            <div className="mb-8">
              <h2
                className="text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: '#E27447' }}
              >
                Lịch sử học tập
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Danh sách lịch sử học tập gần đây của bạn.
              </p>
            </div>
            <div>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="wg-box">
                <div
                  className="table-order"
                  style={{
                    maxWidth: '1060px',
                    width: '100%',
                    margin: '0 auto',
                  }}
                >
                  <div className="head">
                    <div className="item">
                      <div className="fs-15 fw-5">#</div>
                    </div>
                    <div className="item">
                      <div className="fs-15 fw-5">Khóa học</div>
                    </div>
                    <div className="item">
                      <div className="fs-15 fw-5">Ảnh</div>
                    </div>
                    <div className="item">
                      <div className="fs-15 fw-5">Tiến độ</div>
                    </div>
                    <div className="item">
                      <div className="fs-15 fw-5">Bài học</div>
                    </div>
                    <div className="item">
                      <div className="fs-15 fw-5">Hành động</div>
                    </div>
                  </div>
                  <ul>
                    {paginatedCourses && paginatedCourses.length > 0 ? (
                      paginatedCourses.map((course: any, index: any) => (
                        <li key={course.id}>
                          <div className="order-item item border-bottom">
                            <div>
                              <p className="fs-15 fw-5">{index + 1}</p>
                            </div>
                            <div>
                              <a
                                href={`/courses/${course.slug}`}
                                className="fs-15 fw-5"
                              >
                                {course.name}
                              </a>
                            </div>
                            <div>
                              <Image
                                src={course?.thumbnail}
                                alt={course?.name}
                                width={150}
                                height={150}
                              />
                            </div>
                            <div>
                              <div className="flex items-center text-xs text-gray-800">
                                <div className="h-2 w-1/2 rounded-full bg-gray-200">
                                  <div
                                    className="h-2 rounded-full bg-primary"
                                    style={{
                                      width: `${course.progress_percent}%`,
                                    }}
                                  />
                                </div>
                                <p className="fs-15 fw-5 ml-2">
                                  {course.progress_percent}%
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="fs-15 fw-5">
                                {course.completed_lessons}/
                                {course.total_lessons}
                              </p>
                            </div>
                            <div>
                              {course.progress_percent < 100 && (
                                <Link
                                  href={`/learning/${course.slug}/lesson/${course.current_lesson?.id}`}
                                >
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="gap-1.5"
                                  >
                                    <PlayCircle className="size-4" />
                                    Tiếp tục
                                  </Button>
                                </Link>
                              )}
                              {course.progress_percent === 100 && (
                                <Badge
                                  variant="outline"
                                  className="border-green-200 bg-green-50 text-green-700"
                                >
                                  Đã hoàn thành
                                </Badge>
                              )}
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>
                        <div className="border-bottom p-2">
                          <p className="fs-15 fw-5 text-center">
                            Không có kết quả phù hợp bạn muốn tìm
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>
                  {/*phan trang*/}
                  {totalPages > 0 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Trước
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`rounded-md px-4 py-2 text-sm font-medium ${
                              currentPage === page
                                ? 'bg-[#E27447] text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default MyCourseHistoryView
