import Image from 'next/image'
import Link from 'next/link'

import BlogListPagination from '@/sections/blogs/_components/blog-list/pagination'
import { formatDate } from '@/lib/common'

interface BlogListItemProps {
  initialBlogs: any
  isLoading?: boolean
}

const BlogSkeleton = () => {
  return (
    <div className="blog-article-item style-row hover-img">
      <div className="article-thumb image-wrap h-64 w-full shrink-0 bg-gray-200 md:w-96"></div>
      <div className="article-content w-full">
        <div className="article-label h-6 w-24 rounded bg-gray-200"></div>
        <div className="mt-4 h-8 w-3/4 rounded bg-gray-200"></div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200"></div>
          <div className="h-4 w-4/6 rounded bg-gray-200"></div>
        </div>
        <div className="meta mt-6 flex">
          <div className="meta-item mr-6 flex items-center">
            <div className="mr-2 size-4 rounded-full bg-gray-200"></div>
            <div className="h-4 w-20 rounded bg-gray-200"></div>
          </div>
          <div className="meta-item mr-6 flex items-center">
            <div className="mr-2 size-4 rounded-full bg-gray-200"></div>
            <div className="h-4 w-8 rounded bg-gray-200"></div>
          </div>
          <div className="meta-item flex items-center">
            <div className="mr-2 size-4 rounded-full bg-gray-200"></div>
            <div className="h-4 w-16 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="mt-6 h-10 w-28 rounded bg-gray-200"></div>
      </div>
    </div>
  )
}

const BlogListItem = ({ initialBlogs, isLoading }: BlogListItemProps) => {
  const posts = initialBlogs?.data

  return (
    <>
      <div className="wrap-blog-list">
        {isLoading ? (
          <>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </>
        ) : (
          posts?.map((blog: any) => (
            <div
              key={blog.id}
              className="blog-article-item style-row hover-img fadeInUp"
            >
              <div className="article-thumb image-wrap">
                <Image
                  className="lazyload object-fit-cover"
                  src={blog.thumbnail}
                  alt=""
                  width={500}
                  height={250}
                />
              </div>
              <div className="article-content">
                <div className="article-label">{blog.category.name}</div>
                <h3 className="fw-5">
                  <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                </h3>
                <p
                  className="text-justify leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      blog.description.length > 260
                        ? blog.description.substring(0, 260) + '...'
                        : blog.description,
                  }}
                />
                <div className="meta">
                  <div className="meta-item">
                    <i className="flaticon-calendar"></i>
                    <p>{formatDate(blog.created_at)}</p>
                  </div>
                  <div className="meta-item">
                    <i className="flaticon-message"></i>
                    <p>14</p>
                  </div>
                  <a href="#" className="meta-item">
                    <i className="flaticon-user-1"></i>
                    <p>{blog.user.name}</p>
                  </a>
                </div>
                <Link href={`/blogs/${blog.slug}`} className="tf-btn-arrow">
                  Đọc thêm <i className="icon-arrow-top-right"></i>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      <BlogListPagination />
    </>
  )
}

export default BlogListItem
