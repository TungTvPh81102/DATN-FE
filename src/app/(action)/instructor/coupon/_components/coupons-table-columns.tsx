'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical, SquarePen, Tag } from 'lucide-react'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { formatCurrency, formatDate, formatPercentage } from '@/lib/common'
import { dateRangeFilterFn } from '@/lib/data-table'
import { Coupon, DiscountType, DiscountTypeMap } from '@/types'
import Link from 'next/link'

interface Props {
  toggleStatus: ({
    id,
    action,
  }: {
    id: number
    action: 'enable' | 'disable'
  }) => void
  isTogglingStatus: boolean
}

export function getColumns({
  toggleStatus,
  isTogglingStatus,
}: Props): ColumnDef<Coupon>[] {
  return [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã" />
      ),
      cell: ({ row }) => {
        const coupon = row.original
        return (
          <div className="flex items-center space-x-2">
            <div className="text-primary/80">
              <Tag className="size-4" />
            </div>
            <p className="text-sm font-medium uppercase text-gray-900">
              {coupon.code}
            </p>
          </div>
        )
      },
      enableHiding: false,
      meta: {
        label: 'Mã',
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên mã" />
      ),
      cell: ({ row }) => {
        const coupon = row.original
        return (
          <div className="max-w-xs">
            <p className="truncate text-sm font-medium text-gray-900">
              {coupon.name}
            </p>
            {coupon.description && (
              <p className="truncate text-xs text-gray-500">
                {coupon.description}
              </p>
            )}
          </div>
        )
      },
      enableHiding: false,
      meta: {
        label: 'Mã',
      },
    },
    {
      accessorKey: 'discount_type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Loại mã" />
      ),
      cell: ({ row }) => {
        const discountType = DiscountTypeMap[row.original.discount_type]
        return (
          discountType && (
            <Badge
              className="shrink-0 whitespace-nowrap"
              variant={discountType.badge}
            >
              {discountType.label}
            </Badge>
          )
        )
      },
      meta: {
        label: 'Loại mã',
      },
    },
    {
      accessorKey: 'discount_value',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giá trị" />
      ),
      cell: ({ row }) => {
        const coupon = row.original
        return (
          <div className="font-medium">
            {coupon.discount_type === DiscountType.Fixed
              ? formatCurrency(Number(coupon.discount_value))
              : formatPercentage(Number(coupon.discount_value))}
          </div>
        )
      },
      sortingFn: 'alphanumeric',
      filterFn: 'inNumberRange',
      meta: {
        label: 'Giá trị',
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const coupon = row.original

        const handleToggle = (checked: boolean) => {
          toggleStatus({
            id: coupon.id,
            action: checked ? 'enable' : 'disable',
          })
        }

        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={coupon.status == 1}
              onCheckedChange={handleToggle}
              disabled={isTogglingStatus}
            />
            <span className="text-sm font-medium">
              {coupon.status == 1 ? (
                <span className="text-green-600">Hoạt động</span>
              ) : (
                <span className="text-gray-500">Không hoạt động</span>
              )}
            </span>
          </div>
        )
      },
      filterFn: 'weakEquals',
      meta: {
        label: 'Trạng thái',
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tạo" />
      ),
      cell: ({ row }) =>
        row.original.created_at ? formatDate(row.original.created_at) : '-',
      sortingFn: 'datetime',
      filterFn: dateRangeFilterFn,
      meta: {
        label: 'Ngày tạo',
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const coupon = row.original
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
                <Link
                  href={`/instructor/coupon/update/${coupon.id}`}
                  className="flex items-center space-x-2"
                >
                  <SquarePen className="size-4" /> <span>Chỉnh sửa</span>
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
