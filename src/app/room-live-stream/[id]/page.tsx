'use client'

import { LivestreamLayout } from '@/app/room-live-stream/_components/livestream-layout'

interface Props {
  params: {
    id: string
  }
}

const Page = ({ params }: Props) => {
  const { id } = params
  return <LivestreamLayout id={id} />
}

export default Page
