'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical, SquarePen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
import { formatDate, formatNumber } from '@/lib/common'
import { dateRangeFilterFn } from '@/lib/data-table'
import { IPost, PostStatusMap } from '@/types'

export function getColumns(): ColumnDef<IPost>[] {
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
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bài viết" />
      ),
      cell: ({ row }) => {
        const post = row.original
        return (
          <div className="flex min-w-80 items-center gap-4">
            <Image
              alt={post.title}
              className="size-16 rounded-lg object-cover"
              height={128}
              width={128}
              src={post?.thumbnail ?? ''}
            />
            <div className="flex-1 space-y-1">
              <h3 className="line-clamp-2 font-semibold">{post.title}</h3>
              <h4 className="text-xs text-muted-foreground">
                {post.category.name}
              </h4>
            </div>
          </div>
        )
      },
      enableHiding: false,
      meta: {
        label: 'Bài viết',
      },
    },
    {
      accessorKey: 'category.name',
      enableHiding: false,
      meta: {
        label: 'Danh mục',
        className: 'hidden',
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
      accessorKey: 'view',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lượt xem" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {formatNumber(row.original.view ?? 0)}
        </div>
      ),
      sortingFn: 'basic',
      filterFn: 'inNumberRange',
      meta: {
        label: 'Lượt xem',
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const post = PostStatusMap[row.original.status]
        return (
          post && (
            <Badge className="shrink-0 whitespace-nowrap" variant={post.badge}>
              {post.label}
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
                <Link href={`/instructor/posts/update/${course.slug}`}>
                  <SquarePen /> Sửa
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
