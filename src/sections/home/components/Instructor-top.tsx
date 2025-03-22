'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useGetTopInstructors } from '@/hooks/instructor/get-all/useGetAllInstructor'

const instructorsData = [
  {
    name: 'Theresa Webb',
    image: '/assets/images/instructors/instructors-01.jpg',
    students: 345,
    courses: 34,
    description: 'Professional Web Developer',
    rating: 4.9,
  },
  {
    name: 'Ronald Richards',
    image: '/assets/images/instructors/instructors-02.jpg',
    students: 345,
    courses: 34,
    description: 'Professional Web Developer',
    rating: 4.9,
  },
  {
    name: 'Savannah Nguyen',
    image: '/assets/images/instructors/instructors-03.jpg',
    students: 345,
    courses: 34,
    description: 'Professional Web Developer',
    rating: 4.9,
  },
  {
    name: 'Kristin Watson',
    image: '/assets/images/instructors/instructors-04.jpg',
    students: 345,
    courses: 34,
    description: 'Professional Web Developer',
    rating: 4.9,
  },
  {
    name: 'Cameron Williamson',
    image: '/assets/images/instructors/instructors-03.jpg',
    students: 345,
    courses: 34,
    description: 'Professional Web Developer',
    rating: 4.9,
  },
  {
    name: 'Theresa Webb',
    image: '/assets/images/instructors/instructors-01.jpg',
    students: 345,
    courses: 34,
    description: 'Professional Web Developer',
    rating: 4.9,
  },
  {
    name: 'Ronald Richards',
    image: '/assets/images/instructors/instructors-02.jpg',
    students: 345,
    courses: 34,
    description: 'Professional Web Developer',
    rating: 4.9,
  },
  {
    name: 'Savannah Nguyen',
    image: '/assets/images/instructors/instructors-03.jpg',
    students: 345,
    courses: 34,
    description: 'Professional Web Developer',
    rating: 4.9,
  },
  {
    name: 'Kristin Watson',
    image: '/assets/images/instructors/instructors-04.jpg',
    students: 345,
    courses: 34,
    description: 'Professional Web Developer',
    rating: 4.9,
  },
  {
    name: 'Cameron Williamson',
    image: '/assets/images/instructors/instructors-03.jpg',
    students: 345,
    courses: 34,
    description: 'Professional Web Developer',
    rating: 4.9,
  },
]

const InstructorTop = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  const { data, isLoading } = useGetTopInstructors()

  console.log('isLoading', isLoading)
  console.log('data', data)

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
              {instructorsData.map((instructor, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <div className="instructors-item hover-img style-column">
                    <div className="image-wrap">
                      <Image
                        width={260}
                        height={260}
                        data-src={instructor.image}
                        src={instructor.image}
                        alt={instructor.name}
                      />
                    </div>

                    <div className="entry-content">
                      <ul className="entry-meta">
                        <li>
                          <i className="flaticon-user" />
                          {instructor.students} Students
                        </li>

                        <li>
                          <i className="flaticon-play" />
                          {instructor.courses} Courses
                        </li>
                      </ul>

                      <h6 className="entry-title">
                        <Link href="#">{instructor.name}</Link>
                      </h6>

                      <p className="short-description">
                        {instructor.description}
                      </p>

                      <div className="ratings">
                        <div className="number">{instructor.rating}</div>
                        <i className="icon-star-1" />
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

export default InstructorTop
