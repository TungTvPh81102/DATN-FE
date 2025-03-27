'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'

import { useGetLiveSessions } from '@/hooks/live/useLive'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ModalLoading from '@/components/common/ModalLoading'
import { DataTable } from '@/components/shared/data-table'
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header'
import DialogLiveStreamCreate from '@/components/live-stream/dialog-live-stream-create'

const LiveStreamManageView = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  const [dateFilters, setDateFilters] = useState<{
    fromDate: Date | null
    toDate: Date | null
  }>({
    fromDate: null,
    toDate: null,
  })

  const formattedFilters = {
    fromDate: dateFilters.fromDate
      ? format(dateFilters.fromDate, 'yyyy-MM-dd')
      : undefined,
    toDate: dateFilters.toDate
      ? format(dateFilters.toDate, 'yyyy-MM-dd')
      : undefined,
  }

  const { data: liveSessions, isLoading } = useGetLiveSessions(formattedFilters)

  const filteredData = liveSessions?.data?.filter((course: any) => {
    const searchFields = ['title', 'description']
    return searchFields.some((field) =>
      course[field]?.toLowerCase()?.includes(searchTerm.toLowerCase())
    )
  })

  const columns: ColumnDef<any[]>[] = [
    {
      header: 'STT',
      accessorFn: (_row, index) => index + 1,
      cell: ({ getValue }: any) => (
        <div className="text-sm font-medium text-gray-900">{getValue()}</div>
      ),
      size: 50,
    },
    {
      accessorKey: 'title',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Tiêu đề" />
      ),
      cell: ({ row }: any) => {
        const live = row.original
        return <p className="text-sm font-medium text-gray-900">{live.title}</p>
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }: any) => {
        const live = row.original

        const statusMap: Record<
          string,
          { variant: 'success' | 'info' | 'secondary' | 'destructive' }
        > = {
          'Đang diễn ra': { variant: 'success' },
          'Sắp diễn ra': { variant: 'info' },
          'Đã kết thúc': { variant: 'secondary' },
          'Đã huỷ': { variant: 'destructive' },
        }

        const { variant = 'default' } = statusMap[live.status] || {}

        return (
          <Badge variant={variant} className="text-sm font-semibold">
            {live.status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'start_time',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Ngày tạo phiên live" />
      ),
      cell: ({ row }: any) => {
        const live = row.original
        return <p className="text-sm text-gray-600">{live.start_time}</p>
      },
    },
    {
      accessorKey: 'end_time',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Ngày kết thúc" />
      ),
      cell: ({ row }: any) => {
        const livei = row.original
        return <>{format(new Date(livei.end_time), 'dd/MM/yyyy')}</>
      },
    },
    {
      id: 'actions',
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <Link href={`/room-live/${row.original.id}`}>
              <Button className="bg-blue-500">Phòng live</Button>
            </Link>
            <Button>
              <Eye />
            </Button>
          </div>
        )
      },
    },
  ]

  if (isLoading) return <ModalLoading />
  return (
    <div className="px-5 py-4">
      <div className="mt-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Live của tôi</h1>
          <Button onClick={() => setOpenDialog(true)}>Tạo phiên live</Button>
        </div>
        <DataTable
          columns={columns}
          data={filteredData || []}
          isLoading={isLoading}
          onSearchChange={setSearchTerm}
          enableDateFilter={true}
          onDateFilterChange={(filters) => setDateFilters(filters)}
        />
      </div>
      {openDialog && (
        <DialogLiveStreamCreate
          open={openDialog}
          onOpenChange={setOpenDialog}
        />
      )}
    </div>
  )
}

export default LiveStreamManageView
