import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCreateWishList } from '@/hooks/wish-list/useWishList'
import { formatCurrency, formatDuration } from '@/lib/common'
import { ICourse } from '@/types'
import { CreateWishListPayload } from '@/validations/wish-list'
import Image from 'next/image'
import Link from 'next/link'
import Swal from 'sweetalert2'
import SwiperCore from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { CourseItemSkeleton } from '@/components/common/CourseItemSkeleton'
import { BadgePercent, Sparkles, Tag } from 'lucide-react'

SwiperCore.use([Navigation, Pagination, Autoplay])

interface CourseListProps {
  className?: string
  title: string
  description?: string
  categories: Array<{
    id: number
    name: string
    courses: ICourse[]
  }>
  isLoading?: boolean
}

const CourseListCategory = ({
  title,
  description,
  categories,
  isLoading,
}: CourseListProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const [preloadedData, setPreloadedData] = useState<Array<boolean>>(
    categories.map((_, index) => index === 0)
  )
  const { mutate: createWishList, isPending: isWishListPending } =
    useCreateWishList()

  const handleTabHover = (index: number) => {
    if (!preloadedData[index]) {
      const newPreloadedData = [...preloadedData]
      newPreloadedData[index] = true
      setPreloadedData(newPreloadedData)
    }
  }

  useEffect(() => {
    const nextTabIndex = activeTab + 1 < categories.length ? activeTab + 1 : 0
    if (!preloadedData[nextTabIndex]) {
      const newPreloadedData = [...preloadedData]
      newPreloadedData[nextTabIndex] = true
      setPreloadedData(newPreloadedData)
    }
  }, [activeTab, categories.length, preloadedData])

  const handleAddToWishList = (values: CreateWishListPayload) => {
    if (isWishListPending) return
    Swal.fire({
      title: 'Thêm khóa học vào danh sách yêu thích?',
      text: 'Bạn có chắc chắn muốn thêm khóa học này vào danh sách yêu thích?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        createWishList(values)
      }
    })
  }

  return (
    <section className="section-course mt-14 pt-0">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section">
              <h2 className="fw-7 wow fadeInUp" data-wow-delay="0s">
                {title ?? ''}
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-[10px]">
                <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.2s">
                  {description ?? ''}
                </div>
                <Link
                  href="/courses"
                  className="tf-btn-arrow wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  Xem thêm <i className="icon-arrow-top-right" />
                </Link>
              </div>
            </div>

            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-4 border-b border-gray-200">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className={`text-size cursor-pointer whitespace-nowrap p-1 font-medium transition-colors duration-200 ${
                      activeTab === index
                        ? 'border-b-2 border-orange-500 text-orange-600'
                        : 'text-gray-600 hover:text-orange-500'
                    }`}
                    onClick={() => setActiveTab(index)}
                    onMouseEnter={() => handleTabHover(index)}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                  <CourseItemSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className={`transition-all duration-300 ${
                      activeTab === index
                        ? 'visible block h-auto opacity-100'
                        : 'invisible absolute h-0 overflow-hidden opacity-0'
                    }`}
                    style={{
                      position: activeTab === index ? 'relative' : 'absolute',
                    }}
                  >
                    <Swiper
                      spaceBetween={30}
                      slidesPerView={5}
                      autoplay={{ delay: 5000 }}
                      pagination={{ clickable: true }}
                      className="swiper-container slider-courses-5 wow fadeInUp"
                      modules={[Navigation, Pagination, Scrollbar, A11y]}
                      breakpoints={{
                        0: {
                          slidesPerView: 2,
                          spaceBetween: 12,
                        },
                        768: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        },
                        1024: {
                          slidesPerView: 4,
                          spaceBetween: 30,
                        },
                      }}
                      onSwiper={(swiper) => {
                        setTimeout(() => {
                          swiper.update()
                        }, 0)
                      }}
                    >
                      {category.courses.map((course: any) => (
                        <SwiperSlide key={course.id}>
                          <div className="course-item hover-img title-small">
                            <div className="features image-wrap">
                              <div style={{ width: '330px', height: '175px' }}>
                                <Image
                                  width={256}
                                  height={187}
                                  className="lazyload"
                                  src={course.thumbnail ?? ''}
                                  alt={course.name}
                                />
                              </div>
                              <div className="box-tags">
                                {course.is_free ? (
                                  <Link
                                    href="#"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-all hover:from-emerald-100 hover:to-emerald-200 hover:shadow-md"
                                  >
                                    <Tag size={14} />
                                    Miễn phí
                                  </Link>
                                ) : course.price_sale > 0 ? (
                                  <Link
                                    href="#"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-50 to-rose-100 px-3 py-1.5 text-sm font-medium text-rose-700 transition-all hover:from-rose-100 hover:to-rose-200 hover:shadow-md"
                                  >
                                    <BadgePercent size={14} />
                                    Đang giảm giá
                                  </Link>
                                ) : (
                                  <Link
                                    href="#"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 hover:bg-amber-200"
                                  >
                                    <Sparkles size={14} />
                                    Nổi bật
                                  </Link>
                                )}
                              </div>
                              <div
                                onClick={() =>
                                  handleAddToWishList({ course_id: course.id })
                                }
                                className="box-wishlist tf-action-btns"
                              >
                                <i className="flaticon-heart" />
                              </div>
                            </div>

                            <div className="content">
                              <div className="meta !gap-0 md:gap-4">
                                <div className="meta-item !pr-2 md:pr-[10px]">
                                  <i className="flaticon-calendar" />
                                  <p>{course?.total_lesson} Bài học</p>
                                </div>

                                <div className="meta-item pl-2 md:pl-[10px]">
                                  <i className="flaticon-clock" />
                                  <p>
                                    {formatDuration(course?.total_duration) ||
                                      '0 giờ'}
                                  </p>
                                </div>
                              </div>

                              <h6 className="fw-5 line-clamp-2">
                                <Link
                                  style={{
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                  href={`/courses/${course.slug}`}
                                >
                                  {course.name}
                                </Link>
                              </h6>

                              <div className="ratings pb-30">
                                {(course?.avg_rating ?? 0) > 0 ? (
                                  <>
                                    <div className="stars flex items-center">
                                      {Array.from({ length: 5 }, (_, index) => (
                                        <i
                                          key={index}
                                          className={`icon-star-1 ${
                                            index <
                                            Math.round(
                                              Number(course?.avg_rating ?? 0)
                                            )
                                              ? 'text-yellow-500'
                                              : 'text-gray-300'
                                          }`}
                                        ></i>
                                      ))}
                                    </div>
                                    <div className="total text-sm text-gray-500">
                                      ({course?.total_rating} lượt đánh giá)
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    Chưa có lượt đánh giá
                                  </div>
                                )}
                              </div>
                              <Link
                                href={`/profile/${course.creator_code}`}
                                className="author flex items-center gap-2"
                              >
                                <Avatar className="size-5">
                                  <AvatarImage
                                    src={course.creator_avatar}
                                    alt={course.creator_name}
                                  />
                                  <AvatarFallback>
                                    {course.creator_name}
                                  </AvatarFallback>
                                </Avatar>
                                {course.creator_name}
                              </Link>

                              <div className="bottom">
                                <div className="h6 price fw-5">
                                  {course.is_free ? (
                                    <span className="text-primary">
                                      Miễn phí
                                    </span>
                                  ) : course.price_sale > 0 ? (
                                    <>
                                      <span className="text-lg font-bold text-primary">
                                        {formatCurrency(course.price_sale)}
                                      </span>
                                      <span className="ml-2 text-gray-500 line-through">
                                        {formatCurrency(course.price)}
                                      </span>
                                    </>
                                  ) : (
                                    <span>{formatCurrency(course.price)}</span>
                                  )}
                                </div>

                                <Link
                                  href={`/courses/${course?.slug}`}
                                  className="tf-btn-arrow"
                                >
                                  <span className="fw-5 fs-15">Xem ngay</span>
                                  <i className="icon-arrow-top-right" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseListCategory
