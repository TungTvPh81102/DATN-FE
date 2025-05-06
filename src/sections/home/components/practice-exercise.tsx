import Link from 'next/link'
import { useGetPracticeExercises } from '@/hooks/course/useCourse'
import { useCreateWishList } from '@/hooks/wish-list/useWishList'
import { CreateWishListPayload } from '@/validations/wish-list'
import Swal from 'sweetalert2'
import { CourseItemSkeleton } from '@/components/common/CourseItemSkeleton'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper/modules'
import Image from 'next/image'
import { formatCurrency } from '@/lib/common'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CourseItemRating } from '@/components/common/CourseItemRating'
import SwiperCore from 'swiper'
import { useRouter } from 'next/navigation'
import { updateCourseFilters } from '@/lib/utils'
import { BadgePercent, Tag } from 'lucide-react'
import React from 'react'

SwiperCore.use([Navigation, Pagination, Autoplay])

type Props = {
  title: string
  description: string
}

export const PracticeExercise = ({ title, description }: Props) => {
  const { data, isLoading } = useGetPracticeExercises()
  const { mutate: createWishList, isPending: isWishListPending } =
    useCreateWishList()

  const router = useRouter()

  const handleUpdateFilter = () => {
    updateCourseFilters('features', ['quiz'])

    router.push('/courses')
  }

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
                {title}
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-[10px]">
                <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.1s">
                  {description}
                </div>
                <Link
                  href="/courses"
                  className="tf-btn-arrow wow fadeInUp"
                  data-wow-delay="0.2s"
                  onClick={(e) => {
                    e.preventDefault()
                    handleUpdateFilter()
                  }}
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
                {data?.data?.map((course) => (
                  <SwiperSlide key={course?.id}>
                    <div className="course-item hover-img title-small">
                      <div className="features image-wrap">
                        <div style={{ width: '330px', height: '175px' }}>
                          <Image
                            width={256}
                            height={187}
                            className="lazyload"
                            src={course?.thumbnail ?? ''}
                            alt={course?.name}
                          />
                        </div>

                        <div className="box-tags">
                          {course?.is_free ? (
                            <Link
                              href="#"
                              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-all hover:from-emerald-100 hover:to-emerald-200 hover:shadow-md"
                            >
                              <Tag size={14} />
                              Miễn phí
                            </Link>
                          ) : +course.price_sale > 0 ? (
                            <Link
                              href="#"
                              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-50 to-rose-100 px-3 py-1.5 text-sm font-medium text-rose-700 transition-all hover:from-rose-100 hover:to-rose-200 hover:shadow-md"
                            >
                              <BadgePercent size={14} />
                              Đang giảm giá
                            </Link>
                          ) : null}
                        </div>
                        <div
                          onClick={() =>
                            handleAddToWishList({ course_id: course?.id })
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
                            <p>{course.lessons_count} Bài học</p>
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

                        <CourseItemRating
                          count={course?.ratings?.count ?? 0}
                          average={course?.ratings?.average ?? 0}
                        />

                        <Link
                          href={`/profile/${course.user.code}`}
                          className="author flex items-center gap-2"
                        >
                          <Avatar className="size-5">
                            <AvatarImage
                              src={course?.user?.avatar ?? ''}
                              alt={course?.user?.name}
                            />
                            <AvatarFallback>
                              {course?.user?.name}
                            </AvatarFallback>
                          </Avatar>
                          {course?.user?.name}
                        </Link>

                        <div className="bottom">
                          <div className="h6 price fw-5">
                            {course.is_free ? (
                              <span className="text-primary">Miễn phí</span>
                            ) : +course.price_sale > 0 ? (
                              <>
                                <span className="text-lg font-bold text-primary">
                                  {formatCurrency(course.price_sale)}
                                </span>
                                <span className="ml-2 text-gray-500 line-through">
                                  {formatCurrency(course?.price ?? 0)}
                                </span>
                              </>
                            ) : (
                              <span>{formatCurrency(course?.price ?? 0)}</span>
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
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
