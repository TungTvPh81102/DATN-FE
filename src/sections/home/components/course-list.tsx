'use client'

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

SwiperCore.use([Navigation, Pagination, Autoplay])

interface CourseListProps {
  className?: string
  title: string
  description?: string
  courses: ICourse[]
  isLoading?: boolean
}

const CourseList = ({
  title,
  description,
  courses,
  isLoading,
}: CourseListProps) => {
  const { mutate: createWishList, isPending: isWishListPending } =
    useCreateWishList()

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

  const CourseItemSkeleton = () => (
    <div className="course-item hover-img title-small">
      <div className="features image-wrap">
        <div className="h-44 w-full rounded-t-lg bg-gray-300"></div>

        <div className="box-tags">
          <div className="item h-6 w-20 bg-gray-300"></div>
        </div>

        <div className="box-wishlist tf-action-btns size-8 rounded-full bg-gray-300"></div>
      </div>

      <div className="content">
        <div className="meta !gap-0 md:gap-4">
          <div className="meta-item flex items-center !pr-2 md:pr-[10px]">
            <div className="mr-2 size-4 rounded-full bg-gray-300"></div>
            <div className="h-4 w-16 rounded bg-gray-300"></div>
          </div>

          <div className="meta-item flex items-center pl-2 md:pl-[10px]">
            <div className="mr-2 size-4 rounded-full bg-gray-300"></div>
            <div className="h-4 w-16 rounded bg-gray-300"></div>
          </div>
        </div>

        <div className="my-2 h-6">
          <div className="h-5 w-full rounded bg-gray-300"></div>
        </div>

        <div className="ratings pb-30 flex items-center">
          <div className="mr-2 h-5 w-8 rounded bg-gray-300"></div>
          <div className="stars flex items-center">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="mx-0.5 size-4 rounded-full bg-gray-300"
              ></div>
            ))}
          </div>
          <div className="ml-2 h-4 w-10 rounded bg-gray-300"></div>
        </div>

        <div className="author flex items-center gap-2">
          <div className="size-5 rounded-full bg-gray-300"></div>
          <div className="h-4 w-24 rounded bg-gray-300"></div>
        </div>

        <div className="bottom mt-4 flex items-center justify-between">
          <div className="h6 price fw-5">
            <div className="h-5 w-16 rounded bg-gray-300"></div>
          </div>

          <div className="tf-btn-arrow">
            <div className="h-8 w-24 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  )

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

            {isLoading ? (
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                  <CourseItemSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : (
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
              >
                {courses.map((course: any) => (
                  <SwiperSlide key={course.id}>
                    <div className="course-item hover-img title-small">
                      <div className="features image-wrap">
                        <Image
                          width={256}
                          height={187}
                          className="lazyload"
                          src={course.thumbnail ?? ''}
                          alt={course.name}
                        />

                        <div className="box-tags">
                          {course.is_free ? (
                            <Link href="#" className="item free best-seller">
                              Miễn phí
                            </Link>
                          ) : course.price_sale > 0 ? (
                            <Link href="#" className="item sale best-seller">
                              Đang giảm giá
                            </Link>
                          ) : (
                            <Link href="#" className="item best-seller">
                              Best Seller
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
                            <p>{course.lessons_count} Lessons</p>
                          </div>

                          <div className="meta-item pl-2 md:pl-[10px]">
                            <i className="flaticon-clock" />
                            <p>{formatDuration(course.total_video_duration)}</p>
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
                          {course.ratings?.count > 0 ? (
                            <>
                              <div className="number text-lg font-bold text-gray-800">
                                {course.ratings.average || '0.0'}
                              </div>
                              <div className="stars flex items-center">
                                {[...Array(5)].map((_, index) => (
                                  <i
                                    key={index}
                                    className={`icon-star-1 ${
                                      index < Math.round(course.ratings.average)
                                        ? 'text-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="total text-sm text-gray-500">
                                ({course.ratings.count})
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Chưa có lượt đánh giá
                            </div>
                          )}
                        </div>

                        <Link
                          href="#"
                          className="author flex items-center gap-2"
                        >
                          <Avatar className="size-5">
                            <AvatarImage
                              src={course.user.avatar}
                              alt={course.user.name}
                            />
                            <AvatarFallback>{course.user.name}</AvatarFallback>
                          </Avatar>
                          {course.user.name}
                        </Link>

                        <div className="bottom">
                          <div className="h6 price fw-5">
                            {course.is_free ? (
                              <span className="text-primary">Miễn phí</span>
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
                            href={`courses/${course?.slug}`}
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
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseList
