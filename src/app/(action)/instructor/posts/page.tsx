import { PostsManagement } from '@/sections/instructor/posts-management'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý bài viết',
}

const PostManagePage = () => {
  return <PostsManagement />
}

export default PostManagePage
