import React from 'react'

interface BlogDetailPostProps {
  initialBlogDetail?: any
}

const BlogDetailSharePost = ({ initialBlogDetail }: BlogDetailPostProps) => {
  return (
    <div className="bottom flex flex-wrap items-center justify-between gap-[20px]">
      <div className="share gap-[20px]p flex items-center">
        <h6 className="fw-5 mr-2">Chia sẻ bài viết </h6>
        <ul className="tf-social-icon flex items-center gap-[10px]">
          <li>
            <a href="#">
              <i className="flaticon-facebook-1"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="icon-twitter"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="flaticon-instagram"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="flaticon-linkedin-1"></i>
            </a>
          </li>
        </ul>
      </div>
      <ul className="tags-list">
        {initialBlogDetail?.tags.map((tag: any, index: number) => (
          <li key={index}>{tag.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogDetailSharePost
