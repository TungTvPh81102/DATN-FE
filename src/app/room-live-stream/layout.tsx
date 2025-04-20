import React from 'react'
import { LivestreamLayout } from '@/app/room-live-stream/_components/livestream-layout'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <LivestreamLayout>{children}</LivestreamLayout>
}

export default Layout
