'use client'

import Image from 'next/image'
import Link from 'next/link'
import SwiperCore from 'swiper'
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import { ICourses } from '@/types'

SwiperCore.use([Navigation, Pagination, Autoplay])

interface CourseListProps {
  className?: string
  title: string
  description?: string
  courses: ICourses[]
}

const CourseList = ({ title, description, courses }: CourseListProps) => {
  return (
    <section className="tf-spacing-6 section-course pt-0">
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
                  href="#"
                  className="tf-btn-arrow wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  Xem thêm <i className="icon-arrow-top-right" />
                </Link>
              </div>
            </div>

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
              {courses.map((course) => (
                <SwiperSlide key={course.id}>
                  <div className="course-item hover-img title-small">
                    <div className="features image-wrap">
                      <Image
                        width={256}
                        height={187}
                        className="lazyload"
                        src={course.thumbnail}
                        alt={course.name}
                      />

                      <div className="box-tags">
                        <Link href="#" className="item best-seller">
                          Best Seller
                        </Link>
                      </div>

                      <div className="box-wishlist tf-action-btns">
                        <i className="flaticon-heart" />
                      </div>
                    </div>

                    <div className="content">
                      {/* eslint-disable-next-line tailwindcss/no-unnecessary-arbitrary-value */}
                      <div className="meta !gap-[0px] md:gap-4">
                        <div className="meta-item !pr-2 md:pr-[10px]">
                          <i className="flaticon-calendar" />
                          <p>{course.lessons_count} Lessons</p>
                        </div>

                        <div className="meta-item pl-2 md:pl-[10px]">
                          <i className="flaticon-clock" />
                          <p>{course.duration}</p>
                        </div>
                      </div>

                      <h6 className="fw-5 line-clamp-2">
                        <a href="course-single-v1.html">{course.name}</a>
                      </h6>

                      <div className="ratings pb-30">
                        <div className="number">{course.rating}</div>
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`icon-star-1 ${
                              index < Math.floor(course.rating) ? 'filled' : ''
                            }`}
                          />
                        ))}

                        <div className="total">(230)</div>
                      </div>
                      <div className="author">
                        By:
                        <a href="#" className="author">
                          {course.user.name}
                        </a>
                      </div>

                      <div className="bottom">
                        <div className="h6 price fw-5">
                          {course.is_free ? 'Free' : `${course.price} VND`}
                        </div>

                        <a
                          href="course-single-v1.html"
                          className="tf-btn-arrow"
                        >
                          <span className="fw-5 fs-15">Enroll Course</span>
                          <i className="icon-arrow-top-right" />
                        </a>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseList
