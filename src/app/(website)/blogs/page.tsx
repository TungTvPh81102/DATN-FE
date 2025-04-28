import React from 'react'
import { Metadata } from 'next'

import { BlogListView } from '@/sections/blogs/view'

export const metadata: Metadata = {
  title: 'Danh sách bài viết',
  description:
    'Khám phá danh sách các bài viết trên blog của chúng tôi. Cập nhật những kiến thức mới nhất, mẹo học tập và các xu hướng trong ngành từ các chuyên gia, giúp bạn nâng cao kỹ năng và hiểu biết.',
}

const BlogListPage = () => {
  return <BlogListView />
}

export default BlogListPage
