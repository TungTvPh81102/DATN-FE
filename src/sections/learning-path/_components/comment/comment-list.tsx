import React from 'react'
import { Loader2, MessageCircleMore } from 'lucide-react'
import { useGetLessonComments } from '@/hooks/comment-lesson/useComment'
import { CommentItem } from '@/sections/learning-path/_components/comment/comment-item'

export const CommentList = ({
  lessonId,
  user,
}: {
  lessonId: string
  user: any
}) => {
  const { data: lessonCommentData, isLoading: isLoadingLessonCommentData } =
    useGetLessonComments(lessonId)

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <span className="font-medium text-gray-700">
          {lessonCommentData?.data?.length || 0} bình luận
        </span>
        <span className="text-sm text-gray-500">
          Nếu thấy bình luận spam, các bạn bấm report giúp admin nhé
        </span>
      </div>

      {isLoadingLessonCommentData ? (
        <div className="mt-8 flex flex-col items-center justify-center py-10">
          <Loader2 className="size-10 animate-spin text-orange-600" />
          <p className="mt-4 text-gray-500">Đang tải bình luận...</p>
        </div>
      ) : (
        <>
          {Array.isArray(lessonCommentData?.data) &&
          lessonCommentData.data.length > 0 ? (
            lessonCommentData.data.map((comment: any, index: number) => (
              <CommentItem
                key={comment?.id || index.toString()}
                comment={comment}
                user={user}
                lessonId={lessonId}
              />
            ))
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center py-10 text-center">
              <MessageCircleMore className="size-16 text-gray-300" />
              <p className="mt-4 text-gray-500">Chưa có bình luận nào.</p>
              <p className="text-sm text-gray-400">
                Hãy là người đầu tiên bình luận!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
