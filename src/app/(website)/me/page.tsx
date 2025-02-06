import React from 'react'
import { Metadata } from 'next'

import { MeView } from '@/sections/me/view'

export const metadata: Metadata = {
  title: 'Thông tin cá nhân',
}

const MePage = () => {
  return (
    <div>
      <MeView />
    </div>
  )
}

export default MePage
