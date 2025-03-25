import React from 'react'
import Image from 'next/image'

interface BlogDetailPostProps {
  initialBlogDetail: any
}

const BlogDetailProfileItem = ({ initialBlogDetail }: BlogDetailPostProps) => {
  return (
    <div className="profile-item">
      <div className="image">
        <Image
          src={initialBlogDetail?.user?.avatar}
          alt={initialBlogDetail?.user?.name}
          width={30}
          height={30}
          className="object-cover"
        />
      </div>
      <div className="content">
        <h5>
          <a className="fw-5">{initialBlogDetail?.user?.name}</a>
        </h5>
        <div className="fs-15">
          {initialBlogDetail?.user?.profile?.about_me?.length > 300
            ? initialBlogDetail?.user.profile?.about_me.slice(0, 300) + '...'
            : initialBlogDetail?.user.profile?.about_me}
        </div>
      </div>
    </div>
  )
}

export default BlogDetailProfileItem
