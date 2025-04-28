import { PostsManagement } from '@/sections/instructor/posts-management'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý bài viết',
  description:
    'Giảng viên hoặc admin quản lý tất cả bài viết: tạo mới, chỉnh sửa, xóa và theo dõi hiệu quả các bài viết, cập nhật thông tin cho học viên.',
}

const PostManagePage = () => {
  return <PostsManagement />
}

export default PostManagePage
