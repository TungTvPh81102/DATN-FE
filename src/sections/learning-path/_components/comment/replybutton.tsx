import React, { useState } from 'react'
import ReportCommentDialog from '@/sections/learning-path/_components/comment/report-comment-dialog'

interface ReportButtonProps {
  chapterId: string
  lessonId: number
  commentId: string
}

const ReportButton: React.FC<ReportButtonProps> = ({
  chapterId,
  lessonId,
  commentId,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="text-sm font-medium text-gray-500 transition-colors hover:text-red-600"
      >
        Báo cáo
      </button>

      <ReportCommentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        chapterId={chapterId}
        lessonId={lessonId}
        commentId={commentId}
      />
    </>
  )
}

export default ReportButton
