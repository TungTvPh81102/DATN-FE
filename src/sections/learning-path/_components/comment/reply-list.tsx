import React from 'react'
import { MessageCircleX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReplyItem } from '@/sections/learning-path/_components/comment/reply-item'

interface ReplyListProps {
  replies: any[]
  commentId: string
  user: any
  lessonId: string
  visible: boolean
  onToggleVisibility: () => void
}

export const ReplyList = ({
  replies,
  commentId,
  user,
  lessonId,
  visible,
  onToggleVisibility,
}: ReplyListProps) => {
  if (!visible) {
    return (
      <button
        onClick={onToggleVisibility}
        className="mt-4 font-medium text-gray-500 hover:text-blue-600"
      >
        {`Xem thêm ${replies?.length || ''} câu trả lời`}
      </button>
    )
  }

  if (!replies || !Array.isArray(replies) || replies.length === 0) {
    return (
      <div className="ml-12 mt-2 flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
        <MessageCircleX className="size-4 text-gray-400" />
        <span>Chưa có phản hồi nào</span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto rounded-full text-xs font-medium text-blue-600 hover:bg-blue-50"
          onClick={onToggleVisibility}
        >
          Phản hồi đầu tiên
        </Button>
      </div>
    )
  }

  return (
    <div className="ml-12 mt-4 space-y-4 border-l-2 border-blue-50 pl-4">
      {replies.map((reply, index) => (
        <ReplyItem
          key={`reply-${commentId}-${index}`}
          reply={reply}
          user={user}
          lessonId={lessonId}
          commentId={commentId}
        />
      ))}
      <button
        onClick={onToggleVisibility}
        className="mt-4 font-medium text-gray-500 hover:text-blue-600"
      >
        Thu gọn
      </button>
    </div>
  )
}
