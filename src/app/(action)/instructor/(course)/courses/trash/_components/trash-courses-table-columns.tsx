'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical, RefreshCcw } from 'lucide-react'
import Image from 'next/image'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/common'
import { ITrashCourse } from '@/types'
import { UseMutateFunction } from '@tanstack/react-query'

interface GetColumnsProps {
  restore: UseMutateFunction<
    { message: string; data: any },
    Error,
    number[],
    unknown
  >
  isRestoring: boolean
}

export function getColumns({
  restore,
  isRestoring,
}: GetColumnsProps): ColumnDef<ITrashCourse>[] {
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
        <DataTableColumnHeader column={column} title="Khóa học" />
      ),
      cell: ({ row }) => {
        const course = row.original
        return (
          <div className="flex min-w-80 items-center gap-4">
            <Image
              alt={course.name ?? ''}
              className="size-16 rounded-lg object-cover"
              height={128}
              width={128}
              src={course?.thumbnail ?? ''}
            />

            <h3 className="line-clamp-2 flex-1 font-semibold">{course.name}</h3>
          </div>
        )
      },
      enableHiding: false,
      meta: {
        label: 'Khóa học',
      },
    },
    {
      accessorKey: 'category.name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Danh mục" />
      ),
      meta: {
        label: 'Danh mục',
      },
    },
    {
      accessorKey: 'deleted_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày xóa" />
      ),
      cell: ({ row }) =>
        row.original.deleted_at ? formatDate(row.original.deleted_at) : '-',
      sortingFn: 'datetime',
      meta: {
        label: 'Ngày xóa',
      },
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
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
            <DropdownMenuContent align="end" className="max-w-40">
              <DropdownMenuItem
                onSelect={() =>
                  restore([row.original.id], {
                    onSuccess: () => row.toggleSelected(false),
                  })
                }
                disabled={isRestoring}
              >
                <RefreshCcw /> Khôi phục
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
    },
  ]
}
