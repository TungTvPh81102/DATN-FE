'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useGetTopPosts } from '@/hooks/post/useGetTopPosts'
import { PostItemSkeleton } from '@/sections/home/components/top-posts-skeleton'
import { formatCreatedDatePost } from '@/lib/common'

interface PostListProps {
  className?: string
  title: string
  description?: string
}

const PostList = ({ title, description }: PostListProps) => {
  const { data, isLoading } = useGetTopPosts()

  console.log('data', data)
  console.log('isLoading', isLoading)

  return (
    <section className="section-blog pt-0">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section">
              <h2 className="fw-7 wow fadeInUp" data-wow-delay="0s">
                {title}
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-[10px]">
                <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.2s">
                  {description}
                </div>

                <Link
                  href="/blogs"
                  className="tf-btn-arrow wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  Xem thêm <i className="icon-arrow-top-right" />
                </Link>
              </div>
            </div>

            {isLoading ? (
              <Swiper
                spaceBetween={28}
                slidesPerView={3}
                loop={true}
                className="swiper-container tf-sw-mobile wow fadeInUp"
                data-wow-delay="0.4s"
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 12,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
              >
                {[...Array(3)].map((_, index) => (
                  <SwiperSlide key={index} className="swiper-slide">
                    <PostItemSkeleton />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : data?.data?.length === 0 ? (
              <p className="text-center text-gray-500">Danh sách trống</p>
            ) : (
              <Swiper
                spaceBetween={25}
                slidesPerView={3}
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
                {data?.data?.map((post) => (
                  <SwiperSlide className="swiper-slide" key={post?.id}>
                    <div className="blog-article-item hover-img">
                      <div className="article-thumb image-wrap">
                        <Image
                          width={329}
                          height={260}
                          className="lazyload"
                          data-src={post?.thumbnail ?? ''}
                          src={post?.thumbnail ?? ''}
                          alt={post?.title}
                        />
                      </div>
                      <div className="article-content">
                        <div className="article-label">
                          <a href={post?.category} className="">
                            {post?.category}
                          </a>
                        </div>
                        <h5 className="fw-5">
                          <a href="#" className="block truncate">
                            {post?.title}
                          </a>
                        </h5>
                        <div className="meta">
                          <div className="meta-item">
                            <i className="flaticon-calendar" />
                            <p>
                              {formatCreatedDatePost(
                                post?.created_at.toString()
                              )}
                            </p>
                          </div>
                          <div className="meta-item">
                            <i className="flaticon-message" />
                            <p>{post?.total_comments}</p>
                          </div>
                          <a href={post?.author} className="meta-item">
                            <i className="flaticon-user-1" />
                            <p>{post.author}</p>
                          </a>
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
export default PostList
