import React, { useState } from 'react'

import { LessonType } from '@/types'

import AddCodingDialog from './coding/add-coding-dialog'
import LessonDocument from './lesson-document'
import LessonQuiz from './lesson-quiz'
import LessonVideo from './lesson-video'

type Props = {
  chapterId?: string
  type: LessonType
  onHide: () => void
}

const CreateLesson = ({ chapterId, onHide, type }: Props) => {
  const [isCodingDialogOpen, setIsCodingDialogOpen] = useState(true)

  return (
    <>
      {type === 'coding' ? (
        <AddCodingDialog
          chapterId={chapterId as string}
          open={isCodingDialogOpen}
          onOpenChange={(open) => {
            setIsCodingDialogOpen(open)
            if (!open) onHide()
          }}
        />
      ) : (
        <div className="flex h-full flex-col justify-between space-y-4 rounded-lg border p-4">
          {(() => {
            switch (type) {
              case 'video':
                return <LessonVideo onHide={onHide} chapterId={chapterId} />
              case 'document':
                return <LessonDocument onHide={onHide} chapterId={chapterId} />
              case 'quiz':
                return <LessonQuiz onHide={onHide} chapterId={chapterId} />
              default:
                return 'Thêm bài giảng'
            }
          })()}
        </div>
      )}
    </>
  )
}

export default CreateLesson
