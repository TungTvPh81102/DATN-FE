'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical, Eye } from 'lucide-react'

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
import Image from 'next/image'
import Link from 'next/link'
import { Learner } from '@/types/learner'

export function getColumns(): ColumnDef<Learner>[] {
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
        <DataTableColumnHeader column={column} title="Học viên" />
      ),
      cell: ({ row }) => {
        const learner = row.original
        return (
          <div className="flex min-w-80 items-center gap-4">
            <Image
              alt={learner.name ?? ''}
              className="size-10 rounded-lg object-cover"
              height={128}
              width={128}
              src={learner?.avatar ?? ''}
            />

            <h3 className="line-clamp-2 font-semibold">{learner.name}</h3>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: 'total_courses',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Khoá học đã sở hữu" />
      ),
      cell: ({ row }) => {
        const learner = row.original
        return (
          <h3 className="line-clamp-2 font-semibold">
            {learner.total_courses}
          </h3>
        )
      },
    },
    {
      accessorKey: 'enrolled_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đã tham gia" />
      ),
      cell: ({ row }) => {
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {formatDate(row.original.enrolled_at, {
                dateStyle: 'medium',
              })}
            </div>
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const learner = row.original
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/instructor/learner-manage/info/${learner.code}`}>
                  <Eye /> Xem
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
    },
  ]
}
