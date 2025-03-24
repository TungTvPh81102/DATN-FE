'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useGetTopPosts } from '@/hooks/post/useGetTopPosts'

interface PostListProps {
  className?: string
  title: string
  description?: string
}

export const fakePosts = [
  {
    imageUrl: '/assets/images/blog/blog-01.jpg',
    category: 'Development',
    title: 'The Technical Certifications That Matter Most for the Future',
    link: 'blog-single.html',
    date: '06 April 2024',
    commentsCount: 14,
    author: 'Esther Howard',
    authorLink: '#',
  },
  {
    imageUrl: '/assets/images/blog/blog-02.jpg',
    category: 'Development',
    title: 'How to Become a Web Designer: A Comprehensive Guide',
    link: 'blog-single.html',
    date: '06 April 2024',
    commentsCount: 14,
    author: 'Floyd Miles',
    authorLink: '#',
  },
  {
    imageUrl: '/assets/images/blog/blog-02.jpg',
    category: 'Development',
    title: 'How to Become a Web Designer: A Comprehensive Guide',
    link: 'blog-single.html',
    date: '06 April 2024',
    commentsCount: 14,
    author: 'Floyd Miles',
    authorLink: '#',
  },
  {
    imageUrl: '/assets/images/blog/blog-01.jpg',
    category: 'Development',
    title: 'The Technical Certifications That Matter Most for the Future',
    link: 'blog-single.html',
    date: '06 April 2024',
    commentsCount: 14,
    author: 'Esther Howard',
    authorLink: '#',
  },
  {
    imageUrl: '/assets/images/blog/blog-02.jpg',
    category: 'Development',
    title: 'How to Become a Web Designer: A Comprehensive Guide',
    link: 'blog-single.html',
    date: '06 April 2024',
    commentsCount: 14,
    author: 'Floyd Miles',
    authorLink: '#',
  },
  {
    imageUrl: '/assets/images/blog/blog-02.jpg',
    category: 'Development',
    title: 'How to Become a Web Designer: A Comprehensive Guide',
    link: 'blog-single.html',
    date: '06 April 2024',
    commentsCount: 14,
    author: 'Floyd Miles',
    authorLink: '#',
  },
  // Add more posts here
]

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
                  href="blog-grid.html"
                  className="tf-btn-arrow wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  Xem thêm <i className="icon-arrow-top-right" />
                </Link>
              </div>
            </div>

            <Swiper
              spaceBetween={28}
              slidesPerView={4}
              loop={true}
              className="swiper-container tf-sw-mobile wow fadeInUp"
              data-wow-delay="0.4s"
              modules={[Pagination]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
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
              {fakePosts.map((post, index) => (
                <SwiperSlide className="swiper-slide" key={index}>
                  <div className="blog-article-item hover-img">
                    <div className="article-thumb image-wrap">
                      <Image
                        width={329}
                        height={260}
                        className="lazyload"
                        data-src={post.imageUrl}
                        src={post.imageUrl}
                        alt={post.title}
                      />
                    </div>
                    <div className="article-content">
                      <div className="article-label">
                        <a href={post.category} className="">
                          {post.category}
                        </a>
                      </div>
                      <h5 className="fw-5">
                        <a href={post.link}>{post.title}</a>
                      </h5>
                      <div className="meta">
                        <div className="meta-item">
                          <i className="flaticon-calendar" />
                          <p>{post.date}</p>
                        </div>
                        <div className="meta-item">
                          <i className="flaticon-message" />
                          <p>{post.commentsCount}</p>
                        </div>
                        <a href={post.authorLink} className="meta-item">
                          <i className="flaticon-user-1" />
                          <p>{post.author}</p>
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
export default PostList
