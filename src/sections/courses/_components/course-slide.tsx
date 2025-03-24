'use client'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import Image from 'next/image'
import { formatCurrency } from '@/lib/common'
import { ICourse } from '@/types'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

type Props = {
  courses: ICourse[]
}

const CourseSlide = ({ courses }: Props) => {
  return (
    <Swiper
      spaceBetween={25}
      slidesPerView={3}
      loop={true}
      pagination={{
        clickable: true,
      }}
    >
      {courses.map((course) => (
        <SwiperSlide key={course?.code}>
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
                {course?.is_free ? (
                  <Link href="#" className="item free best-seller">
                    Miễn phí
                  </Link>
                ) : course?.price_sale && course.price_sale > 0 ? (
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
                  <p>{course?.total_lesson} Lessons</p>
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
                {Number(course?.total_rating ?? 0) > 0 ? (
                  <>
                    <div className="stars flex items-center">
                      {Array.from({ length: 5 }, (_, index) => (
                        <i
                          key={index}
                          className={`icon-star-1 ${
                            index < Math.round(Number(course?.avg_rating ?? 0))
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
              <div className="author">
                <Link
                  href={`/profile/${course?.code_instructor}`}
                  className="author flex items-center gap-2"
                >
                  <Avatar className="size-5">
                    <AvatarImage
                      src={course?.avatar_instructor ?? ''}
                      alt={course?.avatar_instructor ?? ''}
                    />
                    <AvatarFallback>{course?.name_instructor}</AvatarFallback>
                  </Avatar>
                  {course?.name_instructor}
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
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
export default CourseSlide
