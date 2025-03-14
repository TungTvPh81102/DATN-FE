import React from 'react'
import Link from 'next/link'

const BlogListBanner = () => {
  return (
    <div className="page-title basic">
      <div className="tf-container full">
        <div className="row">
          <div className="col-12">
            <div className="content text-center">
              <ul className="breadcrumbs flex items-center justify-center gap-[10px]">
                <li>
                  <Link href="/" className="flex">
                    <i className="icon-home"></i>
                  </Link>
                </li>
                <li>
                  <i className="icon-arrow-right"></i>
                </li>
                <Link href="/blogs">
                  <li>Danh sách bài viết</li>
                </Link>
              </ul>
              <h2 className="fw-7">Danh sách bài biết</h2>
              <h6>
                Các khóa học của chúng tôi giúp học viên trở thành chuyên gia
                thực thụ.
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogListBanner
