'use client'

import { DataTable } from '@/components/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableFilterField } from '@/types/data-table'
import { useMemo } from 'react'
import { LiveSession, LiveStatusMap } from '@/types/Live'
import { getColumns } from '@/app/live-streaming/components/manage-schedule-columns'
import DialogScheduleLivestream from '@/sections/instructor/components/live/dialog-schedule-livestream'
import { useGetLiveSchedules } from '@/hooks/live/useLive'
import { useRouter } from 'next/navigation'

const filterFields: DataTableFilterField<LiveSession>[] = [
  {
    id: 'title',
    label: 'Tên sự kiện',
    placeholder: 'Tên sự kiện...',
  },
  {
    id: 'status',
    label: 'Trạng thái',
    options: Object.entries(LiveStatusMap).map(([key, value]) => ({
      label: value.label,
      value: key,
    })),
  },
]

export const ManageScheduleTable = () => {
  const router = useRouter()
  const { data, isLoading } = useGetLiveSchedules()

  const columns = useMemo(() => getColumns(router), [router])

  const { table } = useDataTable({
    data,
    columns,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      columnPinning: { right: ['actions'] },
    },
  })

  return !isLoading ? (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <DialogScheduleLivestream />
        </DataTableToolbar>
      </DataTable>
    </>
  ) : (
    <DataTableSkeleton
      columnCount={5}
      searchableColumnCount={1}
      filterableColumnCount={1}
      cellWidths={['2.5rem', '12rem', '12rem', '12rem', '12rem']}
    />
  )
}
