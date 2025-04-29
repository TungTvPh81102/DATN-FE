import React from 'react'
import LearnerInformationView from '@/sections/instructor/view/learner-information-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thông tin học viên',
  description:
    'Xem và quản lý thông tin chi tiết của học viên: hồ sơ, tiến độ học tập, kết quả bài kiểm tra và các thông tin liên quan khác.',
}

interface Props {
  params: {
    code: string
  }
}

const Page = ({ params }: Props) => {
  const { code } = params
  return <LearnerInformationView code={code} />
}

export default Page
