import React from 'react'
import Link from 'next/link'

import { ICourseDataResponse, ICourseFilter } from '@/types'
import { formatCurrency } from '@/lib/common'

import { SortByDropdown } from '@/sections/courses/_components/sort-by-dropdown'
import { CoursePagination } from '@/components/common/CoursePagination'

type Props = {
  dataFilters: ICourseFilter
  coursesData: ICourseDataResponse
  setDataFilters: React.Dispatch<React.SetStateAction<ICourseFilter>>
}

const CourseListItem = ({
  coursesData,
  dataFilters,
  setDataFilters,
}: Props) => {
  const handlePageChange = (pageUrl?: string | null) => {
    if (!pageUrl) return

    const url = new URL(pageUrl)
    const page = Number(url.searchParams.get('page'))

    if (page) {
      setDataFilters((prev) => {
        const updatedFilters = {
          ...prev,
          page,
        }

        localStorage.setItem('courseFilters', JSON.stringify(updatedFilters))

        return updatedFilters
      })
    }
  }

  return (
    <div className="wrap-courses style-left">
      <div className="sort-by-wrap mb-[30px]">
        <div className="sort-wrap">
          <p className="text text-1 wow fadeInUp grow">
            Hiển thị {coursesData?.from}-{coursesData?.to} trong{'  '}
            {coursesData?.total} khoá học
          </p>
          <SortByDropdown
            dataFilters={dataFilters}
            setDataFilters={setDataFilters}
          />
        </div>
      </div>
      <div className="grid-list-items-3">
        {coursesData?.data?.map((course, index) => (
          <div key={index} className="course-item hover-img h240 wow fadeInUp">
            <div className="features image-wrap">
              <img
                className="lazyload"
                data-src={
                  course?.thumbnail ?? '/assets/images/courses/courses-01.jpg'
                }
                src={
                  course?.thumbnail ?? '/assets/images/courses/courses-01.jpg'
                }
                alt={course?.name}
              />
              <div className="box-wishlist tf-action-btns">
                <i className="flaticon-heart" />
              </div>
            </div>
            <div className="content">
              <div className="meta">
                <div className="meta-item">
                  <i className="flaticon-calendar" />
                  <p>{course?.lessons_count ?? 0} bài học</p>
                </div>
                <div className="meta-item">
                  <i className="flaticon-user" />
                  <p>{course?.total_student ?? 0} học viên</p>
                </div>
                <div className="meta-item">
                  <i className="flaticon-clock" />
                  <p>9 giờ học</p>
                </div>
              </div>
              <Link
                style={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                href={`/courses/${course?.slug}`}
              >
                {course?.name}
              </Link>
              <div className="ratings pb-30">
                {course?.total_rating ? (
                  <>
                    <div className="stars flex items-center">
                      {Array.from({ length: 5 }, (_, index) => (
                        <i
                          key={index}
                          className={`icon-star-1 ${
                            index <
                            Math.round(Number(course?.total_rating ?? 0))
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        ></i>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="mb-2 text-sm text-gray-500">
                    Chưa có lượt đánh giá
                  </div>
                )}
              </div>
              <div className="author">
                By:{' '}
                <Link href={`/profile/${course?.user.code}`} className="author">
                  {course?.user?.name}
                </Link>
              </div>
              <div className="bottom">
                <div className="h6 price fw-5">
                  {course?.is_free === 1 ? (
                    <span>Miễn phí</span>
                  ) : course?.price_sale && Number(course.price_sale) > 0 ? (
                    <div>
                      <span>{formatCurrency(Number(course.price_sale))}</span>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatCurrency(Number(course?.price ?? 0))}
                      </span>
                    </div>
                  ) : (
                    <span>{formatCurrency(Number(course?.price ?? 0))}</span>
                  )}
                </div>
                <Link
                  href={`/courses/${course?.slug}`}
                  className="tf-btn-arrow"
                >
                  <span className="fw-5 fs-15">Đăng ký</span>
                  <i className="icon-arrow-top-right" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CoursePagination
        data={coursesData}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}

export default CourseListItem
