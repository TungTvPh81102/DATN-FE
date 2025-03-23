'use client'

import type { ColumnDef } from '@tanstack/react-table'
import {
  EllipsisVertical,
  Eye,
  GripVertical,
  SquarePen,
  Trash2,
} from 'lucide-react'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SortableDragHandle } from '@/components/ui/sortable'
import { AnswerTypeMap, Question } from '@/types'
import { DataTableRowAction } from '@/types/data-table'
import Image from 'next/image'

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Question> | null>
  >
  isDraftOrRejected: boolean
  dragMode: boolean
}

export function getColumns({
  setRowAction,
  isDraftOrRejected,
  dragMode,
}: GetColumnsProps): ColumnDef<Question>[] {
  const columns: ColumnDef<Question>[] = [
    {
      accessorKey: 'question',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Câu hỏi" />
      ),
      enableHiding: false,
      meta: {
        label: 'Câu hỏi',
      },
    },
    {
      accessorKey: 'image',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hình ảnh" />
      ),
      cell: ({ row }) => {
        const image = row.original.image
        return image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_STORAGE}/${image}`}
            alt="Question"
            width={48}
            height={48}
            className="size-12 rounded-lg object-cover"
          />
        ) : (
          '-'
        )
      },
      enableSorting: false,
      meta: {
        label: 'Hình ảnh',
      },
    },
    {
      accessorKey: 'answer_type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Loại câu hỏi" />
      ),
      cell: ({ row }) => {
        const answer = AnswerTypeMap[row.original.answer_type]
        return answer ? (
          <Badge className="shrink-0 whitespace-nowrap" variant={answer.badge}>
            {answer.label}
          </Badge>
        ) : (
          '-'
        )
      },
      meta: {
        label: 'Loại câu hỏi',
      },
    },
  ]

  if (!dragMode) {
    columns.pop()
    columns.push({
      id: 'actions',
      cell: function Cell({ row }) {
        return (
          <div className="flex justify-end">
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
                >
                  {isDraftOrRejected ? (
                    <>
                      <SquarePen /> Sửa
                    </>
                  ) : (
                    <>
                      <Eye /> Xem
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onSelect={() => setRowAction({ row, type: 'delete' })}
                  disabled={!isDraftOrRejected}
                >
                  <Trash2 /> Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
      size: 40,
    })
  } else {
    columns.pop()
    columns.push({
      id: 'drag',
      cell: () => (
        <div className="flex justify-end">
          <SortableDragHandle variant="ghost">
            <GripVertical />
          </SortableDragHandle>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    })
  }

  return columns
}
