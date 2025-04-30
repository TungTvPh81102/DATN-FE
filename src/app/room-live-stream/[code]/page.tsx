'use client'

import { LivestreamDetails } from '@/sections/livestream/views/livestream-details'

interface Props {
  params: {
    code: string
  }
}

const Page = ({ params }: Props) => {
  const { code } = params
  return <LivestreamDetails code={code} />
}

export default Page
