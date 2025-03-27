import React from 'react'

import LearningPathView from '@/sections/learning-path/view/learning-path-view'

type Props = {
  params: { courseSlug: string; lessonId: string }
}

const LearningPage = ({ params }: Props) => {
  const { courseSlug, lessonId } = params

  return <LearningPathView courseSlug={courseSlug} lessonId={+lessonId} />
}

export default LearningPage
