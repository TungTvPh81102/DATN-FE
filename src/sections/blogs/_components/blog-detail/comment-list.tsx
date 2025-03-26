import React, { useState } from 'react'
import { Loader2, MessageSquare } from 'lucide-react'
import { useGetBlogComments } from '@/hooks/comment-blog/useCommentBlog'
import { useAuthStore } from '@/stores/useAuthStore'
import CommentItem from '@/sections/blogs/_components/blog-detail/_components/comment-item'
import CommentForm from '@/sections/blogs/_components/blog-detail/_components/comment-form'

const INITIAL_COMMENT_LIMIT = 2

const BlogDetaiCommentsList = ({ postId }: { postId: string }) => {
  const { data: comments, isLoading, refetch } = useGetBlogComments(postId)
  const { user } = useAuthStore()
  const currentUserId = user?.id
  const [showAllComments, setShowAllComments] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const sortedComments = comments?.data?.length
    ? [...comments.data].sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    : []

  const displayedComments = showAllComments
    ? sortedComments
    : sortedComments?.slice(0, INITIAL_COMMENT_LIMIT)

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-6 text-gray-600" />
          <h3 className="text-2xl font-semibold text-gray-900">Bình luận</h3>
        </div>
      </div>

      <div className="mb-8">
        <CommentForm postId={postId} onSuccess={refetch} />
      </div>

      <div className="space-y-8">
        {sortedComments?.length > 0 ? (
          <>
            {displayedComments.map((comment: any) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onReplySuccess={refetch}
                postId={postId}
              />
            ))}
            {sortedComments.length > INITIAL_COMMENT_LIMIT &&
              !showAllComments && (
                <button
                  onClick={() => setShowAllComments(true)}
                  className="w-full rounded-xl bg-gray-50 py-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Xem thêm {sortedComments.length - INITIAL_COMMENT_LIMIT} bình
                  luận
                </button>
              )}
          </>
        ) : (
          <div className="rounded-xl bg-gray-50 py-12 text-center">
            <MessageSquare className="mx-auto mb-4 size-12 text-gray-400" />
            <p className="text-gray-600">Bài viết này chưa có bình luận!</p>
            <p className="mt-2 text-sm text-gray-500">
              Hãy là người đầu tiên bình luận
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogDetaiCommentsList
