import React from 'react'

import LearningPathView from '@/sections/learning-path/view/learning-path-view'
import { Metadata } from 'next'

type Props = {
  params: { courseSlug: string; lessonId: string }
}

export const metadata: Metadata = {
  title: 'Học tập cùng CourseMely',
  description:
    'Tiếp tục quá trình học tập của bạn trên CourseMely với các bài giảng chất lượng, video trực quan và bài tập thực hành. Nâng cao kỹ năng và hoàn thành khóa học theo lộ trình cá nhân hóa.',
}

const LearningPage = ({ params }: Props) => {
  const { courseSlug, lessonId } = params

  return <LearningPathView courseSlug={courseSlug} lessonId={+lessonId} />
}

export default LearningPage
