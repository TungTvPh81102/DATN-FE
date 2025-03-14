import React from 'react'
import { Loader2 } from 'lucide-react'
import { useGetBlogComments } from '@/hooks/comment-blog/useCommentBlog'
import CommentForm from '@/sections/blogs/_components/blog-detail/_components/comment-form'
import CommentItem from '@/sections/blogs/_components/blog-detail/_components/comment'
import { useAuthStore } from '@/stores/useAuthStore'

const BlogDetailReviewList = ({ postId }: { postId: string }) => {
  const { data: comments, isLoading, refetch } = useGetBlogComments(postId)
  const { user } = useAuthStore()
  console.log('comments', comments)
  const currentUserId = user?.id

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="review-wrap w-full">
      <div className="review-title mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-medium">
          Bình luận {/*({comments?.data?.length || 0})*/}
        </h3>
      </div>

      <div className="mb-8">
        <CommentForm postId={postId} onSuccess={refetch} />
      </div>

      <div className="space-y-12">
        {comments?.data?.length > 0 ? (
          comments?.data?.map((comment: any) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onReplySuccess={refetch}
            />
          ))
        ) : (
          <p className="py-4 text-center text-gray-500">
            Bài viết này chưa có bình luận!
          </p>
        )}
      </div>
    </div>
  )
}

export default BlogDetailReviewList
