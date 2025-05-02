import React, { useState } from 'react'
import ReportCommentDialog from '@/sections/learning-path/_components/comment/report-comment-dialog'

interface ReportButtonProps {
  lessonId: number
  commentId: string
}

const ReportButton: React.FC<ReportButtonProps> = ({ lessonId, commentId }) => {
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
        lessonId={lessonId}
        commentId={commentId}
      />
    </>
  )
}

export default ReportButton
