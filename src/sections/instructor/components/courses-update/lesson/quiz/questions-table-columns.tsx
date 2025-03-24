'use client'

import type { ColumnDef } from '@tanstack/react-table'
import {
  EllipsisVertical,
  Eye,
  GripVertical,
  SquarePen,
  Trash2,
} from 'lucide-react'

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
      header: 'Câu hỏi',
      cell: ({ row }) => {
        const question = row.original
        return (
          <div className="flex min-w-80 items-center gap-4">
            {question.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_STORAGE}/${question.image}`}
                alt={question.question}
                width={48}
                height={48}
                className="size-12 rounded-lg object-cover"
              />
            ) : (
              <div className="size-12" />
            )}

            <h3 className="line-clamp-2 flex-1 font-semibold">
              {question.question}
            </h3>
          </div>
        )
      },
      meta: {
        className: 'pl-4',
      },
    },
    {
      accessorKey: 'answer_type',
      header: 'Loại câu hỏi',
      cell: ({ row }) => {
        const answer = AnswerTypeMap[row.original.answer_type]
        return (
          answer && (
            <Badge
              className="shrink-0 whitespace-nowrap"
              variant={answer.badge}
            >
              {answer.label}
            </Badge>
          )
        )
      },
      size: 100,
    },
  ]

  if (!dragMode) {
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
      size: 40,
    })
  } else {
    columns.push({
      id: 'drag',
      cell: () => (
        <div className="flex justify-end">
          <SortableDragHandle variant="ghost">
            <GripVertical />
          </SortableDragHandle>
        </div>
      ),
      size: 40,
    })
  }

  return columns
}
