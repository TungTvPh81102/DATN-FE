'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useGetTopInstructors } from '@/hooks/instructor/get-all/useGetAllInstructor'
import { InstructorItemSkeleton } from '@/sections/home/components/top-instructor-skeleton'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'next/navigation'

const InstructorTop = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  const { user } = useAuthStore()
  const { data, isLoading } = useGetTopInstructors()

  const router = useRouter()

  const handleNavigate = (code: string) => {
    const targetPath = user?.code === code ? '/me' : `/profile/${code}`
    router.push(targetPath)
  }

  return (
    <section className="section-instructor tf-spacing-2 pt-0">
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
                >
                  Xem thêm <i className="icon-arrow-top-right" />
                </Link>
              </div>
            </div>

            {isLoading ? (
              <Swiper
                spaceBetween={25}
                slidesPerView={5}
                loop={true}
                className="swiper-container slider-courses-5 wow fadeInUp"
                data-wow-delay="0.3s"
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
                    slidesPerView: 5,
                    spaceBetween: 30,
                  },
                }}
              >
                {[...Array(5)].map((_, index) => (
                  <SwiperSlide key={index} className="swiper-slide">
                    <InstructorItemSkeleton />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : data?.data?.length === 0 ? (
              <p className="text-center text-gray-500">Danh sách trống</p>
            ) : (
              <Swiper
                spaceBetween={25}
                slidesPerView={5}
                loop={true}
                className="swiper-container slider-courses-5 wow fadeInUp"
                data-wow-delay="0.3s"
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
                    slidesPerView: 5,
                    spaceBetween: 30,
                  },
                }}
              >
                {data?.data?.map((instructor, index) => (
                  <SwiperSlide key={index} className="swiper-slide">
                    <div className="instructors-item hover-img style-column">
                      <div className="image-wrap">
                        <Link
                          href={`/profile/${instructor?.code}`}
                          onClick={(e) => {
                            e.preventDefault()
                            handleNavigate(instructor?.code)
                          }}
                        >
                          <Image
                            width={260}
                            height={260}
                            data-src={instructor?.avatar ?? ''}
                            src={instructor?.avatar ?? ''}
                            alt={instructor.name}
                          />
                        </Link>
                      </div>

                      <div className="entry-content">
                        <ul className="entry-meta">
                          <li>
                            <i className="flaticon-user" />
                            {instructor?.total_followers} Followers
                          </li>

                          <li>
                            <i className="flaticon-play" />
                            {instructor?.total_courses} Courses
                          </li>
                        </ul>

                        <h6 className="entry-title">
                          <Link
                            href={`/profile/${instructor?.code}`}
                            onClick={(e) => {
                              e.preventDefault()
                              handleNavigate(instructor?.code)
                            }}
                          >
                            {instructor?.name}
                          </Link>
                        </h6>

                        <div className="ratings">
                          <div className="number">
                            {instructor?.avg_rating ?? '0.0'}
                          </div>
                          <i className="icon-star-1" />
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

export default InstructorTop
