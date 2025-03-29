import { Metadata } from 'next'
import PostDetailView from '@/sections/instructor/view/post-detail'

export const metadata: Metadata = {
  title: 'bài viết chi tiết',
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
