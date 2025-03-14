interface BlogDetailPostProps {
  initialBlogDetail: any
}

const BlogDetailPost = ({ initialBlogDetail }: BlogDetailPostProps) => {
  console.log('initialBlogDetail', initialBlogDetail)
  return (
    <div className="blog-single-content">
      <div className="meta wow fadeInUp">
        <div className="meta-item">
          <i className="flaticon-calendar"></i>
          <p>{initialBlogDetail?.published_at}</p>
        </div>
        <div className="meta-item">
          <i className="flaticon-message"></i>
          <p>14</p>
        </div>
        <a href="#" className="meta-item">
          <i className="flaticon-user-1"></i>
          <p>{initialBlogDetail.user.name}</p>
        </a>
      </div>
      <h2 className="fw-7 wow fadeInUp">{initialBlogDetail.title}</h2>
      <div className="title text-22 fw-5 wow fadeInUp">Giới thiệu</div>
      <p className="fs-15">
        <div
          className="text-justify leading-loose"
          dangerouslySetInnerHTML={{ __html: initialBlogDetail?.description }}
        />
      </p>
      <p className="fs-15 mt-3">
        <div
          className="text-justify leading-loose"
          dangerouslySetInnerHTML={{ __html: initialBlogDetail?.content }}
        />
      </p>
      <div className="blockquote">
        <div className="desc fs-15">
          Professional Web Developer Lorem ipsum dolor sit amet. Qui incidunt
          dolores non similique ducimus et debitis molestiae. Et autem quia eum
          reprehenderit voluptates est reprehenderit illo est enim perferendis
          est neque sunt.
        </div>
        <div className="name">{initialBlogDetail.user.name}</div>
      </div>
    </div>
  )
}

export default BlogDetailPost
