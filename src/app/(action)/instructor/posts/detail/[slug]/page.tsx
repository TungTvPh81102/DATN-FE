import { Metadata } from 'next'
import PostDetailView from '@/sections/instructor/view/post-detail'

export const metadata: Metadata = {
  title: 'Bài viết chi tiết',
  description:
    'Xem chi tiết bài viết: các thông tin, hướng dẫn, và kiến thức bổ ích từ giảng viên, giúp học viên nắm bắt và hiểu rõ hơn về nội dung khóa học.',
}

type Props = {
  params: { slug: string }
}

const PostUpdatePage = ({ params }: Props) => {
  const { slug } = params
  return (
    <div>
      <PostDetailView slug={slug} />
    </div>
  )
}

export default PostUpdatePage
