'use client'

import type { DataTableRowAction } from '@/types/data-table.ts'
import type { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical, Eye, SquarePen, Trash2 } from 'lucide-react'
import * as React from 'react'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import CourseStatusBadge from '@/components/shared/course-status-badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency, formatDate } from '@/lib/common'
import { dateRangeFilterFn } from '@/lib/data-table'
import { ICourse } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<ICourse> | null>
  >
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<ICourse>[] {
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
            <div className="flex-1 space-y-1">
              <h3 className="line-clamp-2 font-semibold">{course.name}</h3>
              <h4 className="text-xs text-muted-foreground">
                {course.category?.name}
              </h4>
            </div>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
      meta: {
        label: 'Khóa học',
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tạo" />
      ),
      cell: ({ getValue }) => {
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {formatDate(getValue() as Date, {
                dateStyle: 'medium',
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(getValue() as Date, {
                timeStyle: 'short',
                hour12: true,
              })}
            </div>
          </div>
        )
      },
      sortingFn: 'datetime',
      filterFn: dateRangeFilterFn,
      meta: {
        label: 'Ngày tạo',
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giá bán" />
      ),
      cell: ({ row }) => {
        const isFree = row.original.is_free
        const price = Number(row.getValue('price')) || 0

        return (
          <div className="font-medium">
            {isFree || price === 0 ? 'Miễn phí' : formatCurrency(price)}
          </div>
        )
      },
      sortingFn: 'alphanumeric',
      filterFn: 'inNumberRange',
      meta: {
        label: 'Giá bán',
      },
    },
    {
      accessorKey: 'total_student',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Học viên" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('total_student') || 0}</div>
      ),
      sortingFn: 'basic',
      filterFn: 'inNumberRange',
      meta: {
        label: 'Học viên',
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        return <CourseStatusBadge status={row.original.status} />
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
      meta: {
        label: 'Trạng thái',
      },
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const course = row.original
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
              <DropdownMenuItem asChild>
                <Link href={`/instructor/courses/${course.slug}`}>
                  <Eye /> Xem
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/instructor/courses/update/${course.slug}`}>
                  <SquarePen /> Sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onSelect={() => setRowAction({ row, type: 'delete' })}
              >
                <Trash2 /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
    },
  ]
}
