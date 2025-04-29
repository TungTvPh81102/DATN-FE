import React from 'react'
import StreamingView from '@/sections/instructor/components/live/streaming-view'

interface Props {
  params: {
    code: string
  }
}

const Page = ({ params }: Props) => {
  const { code } = params

  return <StreamingView code={code} />
}

export default Page
