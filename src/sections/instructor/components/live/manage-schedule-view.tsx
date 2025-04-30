'use client'

import React from 'react'
import { ManageScheduleTable } from '@/app/live-streaming/components/manage-schedule-table'

const ManageScheduleView = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Quản lý sự kiện
        </h2>
        <p className="text-muted-foreground">
          Quản lý các sự kiện đã lên lịch và đang diễn ra
        </p>
      </div>

      <ManageScheduleTable />
    </div>
  )
}

export default ManageScheduleView
