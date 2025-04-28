import { redirect } from 'next/navigation'

import CourseCodingView from '@/sections/instructor/components/coding-exercise/course-coding-view'
import { Metadata } from 'next'

interface Props {
  params: {
    slug: string
    coding: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: 'Bài học thực hành Coding',
  description:
    'Khám phá các bài học thực hành coding trên CourseMely. Luyện tập lập trình với các bài tập thực tế, giúp bạn cải thiện kỹ năng coding và giải quyết các vấn đề lập trình từ cơ bản đến nâng cao.',
}

const CourseExercisePage = ({ params, searchParams }: Props) => {
  const { slug } = params
  const codingId = searchParams?.coding as string

  if (!codingId) {
    redirect('/not-found')
  }

  return <CourseCodingView slug={slug} codingId={+codingId} />
}

export default CourseExercisePage
