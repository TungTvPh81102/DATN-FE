import PostUpdateView from '@/sections/instructor/view/post-update-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài viết',
  description:
    'Giảng viên hoặc admin chỉnh sửa nội dung bài viết: cập nhật thông tin, thêm mới, hoặc điều chỉnh các phần cần thiết để bài viết trở nên chính xác và hữu ích cho học viên.',
}

type Props = {
  params: { slug: string }
}

const PostUpdatePage = ({ params }: Props) => {
  const { slug } = params
  return <PostUpdateView slug={slug} />
}

export default PostUpdatePage
