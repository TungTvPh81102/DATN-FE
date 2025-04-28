import React from 'react'

import LiveListView from '@/sections/live/view/live-list-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh sách phát trực tiếp',
  description:
    'Khám phá danh sách các buổi phát trực tiếp sắp tới và đã diễn ra. Tham gia các buổi học, hội thảo, và sự kiện trực tuyến với giảng viên và chuyên gia trong ngành.',
}

const Page = () => {
  return <LiveListView />
}

export default Page
