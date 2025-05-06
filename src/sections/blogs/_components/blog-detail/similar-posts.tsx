import Link from 'next/link'
import { useGetBlogsOfCategory } from '@/hooks/blog/useBlog'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface BlogDetailSimilarPostsProps {
  categorySlug: string
  currentPostId: string
}

const BlogDetailSimilarPosts = ({
  categorySlug,
  currentPostId,
}: BlogDetailSimilarPostsProps) => {
  const { data: categoryBlogs, isLoading } = useGetBlogsOfCategory(categorySlug)

  console.log(categoryBlogs)

  const relatedPosts =
    categoryBlogs?.data
      ?.filter((post: any) => post.id !== currentPostId)
      ?.slice(0, 4) || []

  if (relatedPosts.length === 0) {
    return null
  }

  if (isLoading) {
    return (
      <div className="mt-8">
        <Loader2 className="mx-auto size-8 animate-spin" />
      </div>
    )
  }
  return (
    <div className="tf-container">
      <div className="row">
        <div className="col-12">
          <div className="heading-section">
            <h2 className="fw-7 wow fadeInUp">Bài viết tương tự</h2>
            <div className="flex flex-wrap items-center justify-between gap-[10px]">
              <div className="sub fs-15 wow fadeInUp">
                Những bài viết hay sẽ mở mang tri thức của bạn.
              </div>
              <Link
                href="/blogs"
                className="tf-btn-arrow wow fadeInUp"
                data-wow-delay="0.1s"
              >
                Xem tất cả bài viết <i className="icon-arrow-top-right"></i>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPosts.map((post: any, index: any) => (
              <div key={post.id} className="swiper-slide">
                <div
                  className="blog-article-item hover-img wow fadeInUp"
                  data-wow-delay={`${index * 0.1}s`}
                >
                  <div className="article-thumb image-wrap relative h-[200px]">
                    <Image
                      fill
                      className="object-cover"
                      src={post?.thumbnail || '/placeholder-image.jpg'}
                      alt={post.title}
                    />
                  </div>
                  <div className="article-content">
                    <div className="article-label">
                      <Link
                        href={`/blogs/category/${post.category?.slug}`}
                        className=""
                      >
                        {post.category?.name}
                      </Link>
                    </div>
                    <h5 className="fw-5">
                      <Link href={`/blogs/${post.slug}`}>
                        {post.title.length > 35
                          ? post.title.slice(0, 35) + '...'
                          : post.title}
                      </Link>
                    </h5>
                    <div className="meta">
                      <div className="meta-item">
                        <i className="flaticon-calendar"></i>
                        <p>{post.published_at}</p>
                      </div>
                      <div className="meta-item">
                        <i className="flaticon-message"></i>
                        <p>{post.comment_count || 0}</p>
                      </div>
                      <Link
                        href={`/profile/${post.user?.id}`}
                        className="meta-item"
                      >
                        <i className="flaticon-user-1"></i>
                        <p>{post.users?.name}</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailSimilarPosts
