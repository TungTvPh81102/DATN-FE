import PostAddView from '@/sections/instructor/view/post-add-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tạo bài viết',
  description:
    'Giảng viên hoặc admin tạo và đăng bài viết mới: chia sẻ kiến thức, thông báo khóa học, và cập nhật thông tin cho học viên.',
}

const PostPage = () => {
  return <PostAddView />
}

export default PostPage
