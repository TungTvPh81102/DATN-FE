import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'
import CommentForm from './comment-form'
import { useDeleteCommentBlog } from '@/hooks/comment-blog/useCommentBlog'

interface CommentItemProps {
  comment: any
  currentUserId?: number
  onReplySuccess?: () => void
}

const CommentItem = ({
  comment,
  currentUserId,
  onReplySuccess,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const deleteComment = useDeleteCommentBlog(comment.id.toString())

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      await deleteComment.mutateAsync()
    }
  }

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: vi,
  })

  return (
    <div className="mb-6 w-full">
      <div className="flex items-start gap-4">
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className="size-10 rounded-full"
        />
        <div className="flex-1">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex w-full items-center justify-between">
              <span className="font-semibold">{comment.user.name}</span>
              <span className="text-sm text-gray-500">{timeAgo}</span>
            </div>
            <p className="text-gray-800">{comment.content}</p>
          </div>

          <div className="mt-2 flex gap-4">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-sm text-gray-700 hover:text-blue-800"
            >
              Phản hồi
            </button>
            {comment.replies_count > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {showReplies
                  ? 'Ẩn phản hồi'
                  : `Xem ${comment.replies_count} phản hồi`}
              </button>
            )}
            {currentUserId && currentUserId === comment.user.id && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>

          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                commentId={comment.id.toString()}
                isReply={true}
                onSuccess={() => {
                  setShowReplyForm(false)
                  if (onReplySuccess) onReplySuccess()
                }}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {showReplies && comment.replies && (
            <div className="ml-8 mt-4">
              {comment.replies.map((reply: any) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onReplySuccess={onReplySuccess}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentItem
