'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { LiveSession, LiveStatusMap } from '@/types/Live'
import { useRouter } from 'next/navigation'

export function getColumns(
  router: ReturnType<typeof useRouter>
): ColumnDef<LiveSession>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Chọn hàng"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên sự kiện" />
      ),
      cell: ({ row }) => (
        <div
          className="flex cursor-pointer items-center gap-4 hover:opacity-80"
          onClick={() => router.push(`/live-streaming/${row.original.code}`)}
        >
          <Avatar className="size-16 rounded-md shadow-sm">
            <AvatarImage
              src={row.original.thumbnail}
              alt={row.original.title}
              className="rounded-md object-cover"
            />
            <AvatarFallback className="rounded-md">
              {row.original.title.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.original.title}</div>
        </div>
      ),
      enableHiding: false,
      meta: {
        label: 'Tên sự kiện',
      },
    },
    {
      accessorKey: 'starts_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày lên lịch" />
      ),
      cell: ({ row }) => {
        const date = row.original.starts_at
        return date ? (
          <div className="flex flex-col">
            <span>{format(date, 'dd/MM/yyyy')}</span>
            <span className="text-xs text-muted-foreground">
              {format(date, 'HH:mm')}
            </span>
          </div>
        ) : (
          <span className="italic text-muted-foreground">Chưa lên lịch</span>
        )
      },
      sortingFn: (rowA, rowB) => {
        const dateA = rowA.original.starts_at ?? new Date(0)
        const dateB = rowB.original.starts_at ?? new Date(0)
        return dateA.getTime() - dateB.getTime()
      },
      meta: {
        label: 'Ngày lên lịch',
      },
    },
    {
      accessorKey: 'visibility',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Chế độ hiển thị" />
      ),
      cell: ({ row }) => {
        const visibility = row.original.visibility
        const visibilityConfig = {
          public: {
            className: 'border-green-500 bg-green-50 text-green-700',
            dotClassName: 'bg-green-500',
            label: 'Công khai',
          },
          private: {
            className: 'border-red-500 bg-red-50 text-red-700',
            dotClassName: 'bg-red-500',
            label: 'Riêng tư',
          },
        }

        const config = visibilityConfig[visibility]

        return (
          <Badge variant="outline" className={`${config.className}`}>
            <div
              className={`mr-2 size-2 rounded-full ${config.dotClassName}`}
            ></div>
            <span>{config.label}</span>
          </Badge>
        )
      },
      meta: {
        label: 'Chế độ hiển thị',
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        if (!row.original.status) return null

        const liveStatus = LiveStatusMap[row.original.status]
        return (
          <Badge
            variant={liveStatus.badge}
            className="shrink-0 whitespace-nowrap"
          >
            {liveStatus.label}
          </Badge>
        )
      },
      meta: {
        label: 'Trạng thái',
      },
    },
  ]
}
