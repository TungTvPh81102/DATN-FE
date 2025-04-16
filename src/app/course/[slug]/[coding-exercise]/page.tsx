import { redirect } from 'next/navigation'

import CourseCodingView from '@/sections/instructor/components/coding-exercise/course-coding-view'

interface Props {
  params: {
    slug: string
    coding: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
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
