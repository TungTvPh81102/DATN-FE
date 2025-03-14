import Image from 'next/image'
import Link from 'next/link'

import BlogListPagination from '@/sections/blogs/_components/blog-list/pagination'
import { formatDate } from '@/lib/common'

interface BlogListItemProps {
  initialBlogs: any
}

const BlogListItem = ({ initialBlogs }: BlogListItemProps) => {
  const posts = initialBlogs?.data
  console.log('posts', posts)
  return (
    <>
      <div className="wrap-blog-list">
        {posts?.map((blog: any) => (
          <div
            key={blog.id}
            className="blog-article-item style-row hover-img wow fadeInUp"
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
        ))}
      </div>
      <BlogListPagination />
    </>
  )
}

export default BlogListItem
