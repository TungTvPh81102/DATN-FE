'use client'

import { LivestreamLayout } from '@/app/room-live-stream/_components/livestream-layout'

interface Props {
  params: {
    stream_key: string
  }
}

const Page = ({ params }: Props) => {
  const { stream_key } = params
  return <LivestreamLayout stream_key={stream_key} />
}

export default Page
