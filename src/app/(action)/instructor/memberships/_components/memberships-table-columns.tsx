'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Check, EllipsisVertical, SquarePen, X } from 'lucide-react'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency, formatDate } from '@/lib/common'
import { DataTableRowAction } from '@/types/data-table'
import {
  Membership,
  MembershipStatus,
  MembershipStatusMap,
} from '@/types/membership'

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Membership> | null>
  >
  toggleStatus: (code: string) => void
  sendRequest: (code: string) => void
}

export function getColumns({
  setRowAction,
  toggleStatus,
  sendRequest,
}: GetColumnsProps): ColumnDef<Membership>[] {
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
          aria-label="Select all"
          className="text-primary"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên gói" />
      ),
      enableHiding: false,
      meta: {
        label: 'Tên gói',
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giá bán" />
      ),
      cell: ({ row }) => {
        const price = Number(row.getValue('price')) || 0

        return (
          <div className="font-medium">
            {price === 0 ? 'Miễn phí' : formatCurrency(price)}
          </div>
        )
      },
      sortingFn: 'alphanumeric',
      meta: {
        label: 'Giá bán',
      },
    },
    {
      accessorKey: 'duration_months',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Thời hạn" />
      ),
      cell: ({ row }) => {
        return row.original.duration_months + ' tháng'
      },
      meta: {
        label: 'Thời hạn',
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const membership = MembershipStatusMap[row.original.status]
        return (
          membership && (
            <Badge
              className="shrink-0 whitespace-nowrap"
              variant={membership.badge}
            >
              {membership.label}
            </Badge>
          )
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
      meta: {
        label: 'Trạng thái',
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tạo" />
      ),
      cell: ({ row }) => formatDate(row.original.created_at),
      sortingFn: 'datetime',
      meta: {
        label: 'Ngày tạo',
      },
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const { code, status } = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                size="icon"
                className="rounded-full data-[state=open]:bg-muted"
              >
                <EllipsisVertical aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-w-40 *:cursor-pointer"
            >
              <DropdownMenuItem
                onSelect={() => setRowAction({ type: 'update', row })}
                disabled={status !== MembershipStatus.DRAFT}
              >
                <SquarePen /> Sửa
              </DropdownMenuItem>
              {(status === MembershipStatus.ACTIVE ||
                status === MembershipStatus.INACTIVE) && (
                <DropdownMenuItem onClick={() => toggleStatus(code)}>
                  {status === MembershipStatus.ACTIVE ? (
                    <>
                      <X />
                      Dừng hoạt động
                    </>
                  ) : (
                    <>
                      <Check /> Kích hoạt
                    </>
                  )}
                </DropdownMenuItem>
              )}

              {status === MembershipStatus.DRAFT && (
                <DropdownMenuItem onClick={() => sendRequest(code)}>
                  <Check /> Gửi yêu cầu
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
    },
  ]
}
