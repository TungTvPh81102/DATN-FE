import React, { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'

interface BlogDetailPostProps {
  initialBlogDetail: any
  document: any
}

const BlogDetailPost = ({
  initialBlogDetail,
  document,
}: BlogDetailPostProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [contentPreview, setContentPreview] = useState('')
  const [hasMoreContent, setHasMoreContent] = useState(false)
  console.log('initialBlogDetail', initialBlogDetail)
  const PREVIEW_LENGTH = 500

  useEffect(() => {
    if (initialBlogDetail?.content) {
      const contentText = initialBlogDetail.content.replace(/<[^>]*>/g, '')

      if (contentText.length > PREVIEW_LENGTH) {
        let preview = initialBlogDetail.content.substring(
          0,
          PREVIEW_LENGTH * 1.5
        )

        const lastOpenBracket = preview.lastIndexOf('<')
        const lastCloseBracket = preview.lastIndexOf('>')

        if (lastOpenBracket > lastCloseBracket) {
          preview = preview.substring(0, lastOpenBracket)
        }

        const lastPeriod = preview.lastIndexOf('.')
        if (lastPeriod > PREVIEW_LENGTH * 0.7) {
          preview = preview.substring(0, lastPeriod + 1)
        }

        setContentPreview(preview)
        setHasMoreContent(true)
      } else {
        setContentPreview(initialBlogDetail.content)
        setHasMoreContent(false)
      }
    }
  }, [initialBlogDetail])

  return (
    <div className="blog-single-content">
      <div className="meta wow fadeInUp">
        <div className="meta-item">
          <i className="flaticon-calendar"></i>
          <p>{initialBlogDetail?.published_at}</p>
        </div>
        <div className="meta-item">
          <Eye size={21} strokeWidth={1} />
          <p>{initialBlogDetail?.views}</p>
        </div>
        <div className="meta-item">
          <i className="flaticon-message"></i>
          <p>{initialBlogDetail?.comment_count}</p>
        </div>
        <a href="#" className="meta-item">
          <i className="flaticon-user-1"></i>
          <p>{initialBlogDetail?.user?.name}</p>
        </a>
      </div>
      <h2 className="fw-7 wow fadeInUp">{initialBlogDetail?.title}</h2>
      <div className="title text-22 fw-5 wow fadeInUp">Giới thiệu</div>
      <p className="fs-15">
        <div
          className="text-justify leading-loose"
          dangerouslySetInnerHTML={{ __html: initialBlogDetail?.description }}
        />
      </p>
      <div className="content-container">
        <p className="fs-15 mt-3">
          <div
            className="text-justify leading-loose"
            dangerouslySetInnerHTML={{
              __html: isExpanded ? initialBlogDetail?.content : contentPreview,
            }}
          />
        </p>

        {hasMoreContent && !isExpanded && (
          <div className="mb-6 mt-4 text-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="read-more-btn rounded-md bg-primary px-6 py-2 text-white transition-all hover:bg-primary/90"
            >
              Xem thêm
            </button>
          </div>
        )}

        {isExpanded && (
          <div className="mb-6 mt-4 text-center">
            <button
              onClick={() => {
                setIsExpanded(false)
                window.scrollTo({
                  top:
                    document?.querySelector('.content-container')?.offsetTop ||
                    0,
                  behavior: 'smooth',
                })
              }}
              className="read-less-btn rounded-md bg-gray-200 px-6 py-2 text-gray-700 transition-all hover:bg-gray-300"
            >
              Thu gọn
            </button>
          </div>
        )}
      </div>
      <div className="blockquote">
        <div className="desc fs-15">
          Professional Web Developer Lorem ipsum dolor sit amet. Qui incidunt
          dolores non similique ducimus et debitis molestiae. Et autem quia eum
          reprehenderit voluptates est reprehenderit illo est enim perferendis
          est neque sunt.
        </div>
        <div className="name">{initialBlogDetail?.user?.name}</div>
      </div>
    </div>
  )
}

export default BlogDetailPost
