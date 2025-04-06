'use client'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import { CourseItemSkeleton } from '@/components/shared/course-item-skeletion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatCurrency } from '@/lib/common'
import { RelatedCourse } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  courses: RelatedCourse[]
  isLoading?: boolean
}

const CourseSlideRelated = ({ isLoading, courses }: Props) => {
  return (
    <>
      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <CourseItemSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <Swiper
          spaceBetween={25}
          slidesPerView={4}
          loop={true}
          pagination={{
            clickable: true,
          }}
        >
          {courses.map((course) => (
            <SwiperSlide key={course?.id}>
              <div className="course-item hover-img title-small wow fadeInUp">
                <div
                  className="features image-wrap"
                  style={{ height: '150px', objectFit: 'cover' }}
                >
                  <Image
                    className="ls-is-cached lazyloaded"
                    data-src={course?.thumbnail ?? ''}
                    src={course?.thumbnail ?? ''}
                    alt={course?.thumbnail ?? ''}
                    fill
                  />
                  <div className="box-tags">
                    {course.is_free ? (
                      <Link href="#" className="item free best-seller">
                        Miễn phí
                      </Link>
                    ) : course.price_sale && +course.price_sale > 0 ? (
                      <Link href="#" className="item sale best-seller">
                        Đang giảm giá
                      </Link>
                    ) : (
                      <Link href="#" className="item best-seller">
                        Best Seller
                      </Link>
                    )}
                  </div>
                  <div className="box-wishlist tf-action-btns">
                    <i className="flaticon-heart" />
                  </div>
                </div>
                <div className="content">
                  <div className="meta">
                    <div className="meta-item">
                      <i className="flaticon-calendar" />
                      <p>{course?.lessons_count} Lessons</p>
                    </div>
                    <div className="meta-item">
                      <i className="flaticon-clock" />
                      <p>24 hours</p>
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
                      href={`/courses/${course?.slug}`}
                    >
                      {course?.name}
                    </Link>
                  </h6>
                  <div className="ratings pb-30">
                    {(course?.ratings_count ?? 0) > 0 ? (
                      <>
                        <div className="stars flex items-center">
                          {Array.from({ length: 5 }, (_, index) => (
                            <i
                              key={index}
                              className={`icon-star-1 ${
                                index <
                                Math.round(Number(course?.average_rating ?? 0))
                                  ? 'text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            ></i>
                          ))}
                        </div>
                        <div className="total text-sm text-gray-500">
                          ({course?.ratings_count} lượt đánh giá)
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Chưa có lượt đánh giá
                      </div>
                    )}
                  </div>
                  <div className="author">
                    <Link
                      href={`/profile/${course?.user.code}`}
                      className="author flex items-center gap-2"
                    >
                      <Avatar className="size-5">
                        <AvatarImage
                          src={course?.user.avatar ?? ''}
                          alt={course?.user.avatar ?? ''}
                        />
                        <AvatarFallback>{course?.user.name}</AvatarFallback>
                      </Avatar>
                      {course?.user?.name}
                    </Link>
                  </div>
                  <div className="bottom">
                    <div className="h6 price fw-5">
                      {course?.is_free === 1 ? (
                        <span>Miễn phí</span>
                      ) : course?.price_sale &&
                        Number(course.price_sale) > 0 ? (
                        <div>
                          <span>
                            {formatCurrency(Number(course.price_sale))}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {formatCurrency(Number(course?.price ?? 0))}
                          </span>
                        </div>
                      ) : (
                        <span>
                          {formatCurrency(Number(course?.price ?? 0))}
                        </span>
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
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  )
}
export default CourseSlideRelated
