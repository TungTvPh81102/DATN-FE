'use client'

import { LivestreamDetails } from '@/sections/livestream/views/livestream-details'

interface Props {
  params: {
    stream_key: string
  }
}

const Page = ({ params }: Props) => {
  const { stream_key } = params
  return <LivestreamDetails stream_key={stream_key} />
}

export default Page
