import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { MessageSquare, MoreVertical, Reply, Trash2 } from 'lucide-react'
import { useDeleteCommentBlog } from '@/hooks/comment-blog/useCommentBlog'
import Swal from 'sweetalert2'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CommentForm from '@/sections/blogs/_components/blog-detail/_components/comment-form'

const INITIAL_REPLY_LIMIT = 3

interface CommentItemProps {
  comment: any
  currentUserId?: number
  onReplySuccess?: () => void
  postId: string
  rootCommentId?: string
}

const CommentItem = ({
  comment,
  currentUserId,
  onReplySuccess,
  postId,
  rootCommentId,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [showAllReplies, setShowAllReplies] = useState(false)
  const deleteComment = useDeleteCommentBlog(comment.id.toString())

  const parentCommentId = rootCommentId || comment.id.toString()

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa bình luận này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    })

    if (result.isConfirmed) {
      await deleteComment.mutateAsync()
      Swal?.fire('Đã xóa!', 'Bình luận đã được xóa thành công.', 'success')
    }
  }

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: vi,
  })

  const sortedReplies = comment.replies?.length
    ? [...comment.replies].sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    : []

  const displayedReplies = showAllReplies
    ? sortedReplies
    : sortedReplies?.slice(0, INITIAL_REPLY_LIMIT)

  const renderCommentContent = (content: string) => {
    const regex = /(@[\w\s]+?)(?=\s[^@]|$|\s*$)/g
    const parts = content.split(regex)

    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span className="text-blue-700" key={index}>
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="group relative w-full">
      <div className="flex gap-4">
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {comment.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {comment?.user?.name}
                </span>
                <span className="text-sm text-gray-500">{timeAgo}</span>
              </div>

              {currentUserId && currentUserId === comment?.user.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="opacity-0 transition-opacity group-hover:opacity-100">
                    <MoreVertical className="size-4 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 size-4" />
                      Xóa bình luận
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-gray-800">
              {renderCommentContent(comment?.content)}
            </p>
          </div>

          <div className="mt-2 flex items-center gap-4">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
            >
              <Reply className="size-4" />
              Phản hồi
            </button>

            {comment.replies_count > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
              >
                <MessageSquare className="size-4" />
                {showReplies
                  ? 'Ẩn phản hồi'
                  : `${comment?.replies_count} phản hồi`}
              </button>
            )}
          </div>

          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                postId={postId}
                commentId={parentCommentId}
                isReply={true}
                replyToUser={comment.user}
                onSuccess={() => {
                  setShowReplyForm(false)
                  if (onReplySuccess) onReplySuccess()
                }}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {showReplies && sortedReplies.length > 0 && (
            <div className="ml-6 mt-4 space-y-4 border-l border-gray-200 pl-6">
              {displayedReplies.map((reply: any) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onReplySuccess={onReplySuccess}
                  postId={postId}
                  rootCommentId={parentCommentId}
                />
              ))}

              {sortedReplies.length > INITIAL_REPLY_LIMIT &&
                !showAllReplies && (
                  <button
                    onClick={() => setShowAllReplies(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-50 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <MessageSquare className="size-4" />
                    Xem thêm {sortedReplies.length - INITIAL_REPLY_LIMIT} phản
                    hồi
                  </button>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentItem
