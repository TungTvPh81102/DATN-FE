'use client'

import React, { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Calendar, Eye, Star } from 'lucide-react'

import { useGetEvaluations } from '@/hooks/instructor/evaluation/useEvaluation'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DataTable } from '@/components/shared/data-table'
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const EvaluationView = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const { data: dataFeedback, isLoading } = useGetEvaluations(formattedFilters)

  const openDialog = (feedback: any) => {
    setSelectedFeedback(feedback)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setSelectedFeedback(null)
    setIsDialogOpen(false)
  }

  const getValueByPath = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj)
  }

  const filteredData = dataFeedback?.data?.filter((feedBack: any) => {
    const searchFields = ['content', 'rate', 'user.name', 'course.name']

    return searchFields.some((field) => {
      const value: any = getValueByPath(feedBack, field)

      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase())
      }

      if (typeof value === 'number') {
        return value.toString().includes(searchTerm)
      }

      return false
    })
  })

  const columns: ColumnDef<any[]>[] = [
    {
      header: 'STT',
      accessorFn: (_row, index) => index + 1,
      cell: ({ getValue }: any) => (
        <div className="font-medium text-gray-700">{getValue()}</div>
      ),
      size: 50,
    },
    {
      accessorKey: 'name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Khoá học" />
      ),
      cell: ({ row }: any) => {
        const feedback = row.original
        return (
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-blue-700"
            >
              Khoá học
            </Badge>
            <span className="font-medium text-gray-800">
              {feedback.course.name}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'user',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Học viên" />
      ),
      cell: ({ row }: any) => {
        const feedback = row.original
        const initials = feedback.user.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-8 bg-gray-100">
              <AvatarFallback className="text-xs text-gray-600">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-800">
              {feedback.user.name}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'rate',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Đánh giá" />
      ),
      cell: ({ row }: any) => {
        const feedback = row.original
        const stars = Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            className={`${i < feedback.rate ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))
        return (
          <div className="flex items-center">
            {stars}
            <span className="ml-2 text-sm text-gray-500">
              ({feedback.rate}/5)
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Ngày đánh giá" />
      ),
      cell: ({ row }: any) => {
        const feedback = row.original
        return (
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-gray-600">
              {format(new Date(feedback.created_at), 'dd/MM/yyyy')}
            </span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }: any) => {
        const feedback = row.original
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDialog(feedback)}
            className="border-[#E27447] text-[#E27447] transition-colors hover:bg-[#E27447] hover:text-white"
          >
            <Eye size={16} className="mr-1" />
            <span className="hidden sm:inline">Xem</span>
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <div className="px-5 py-6">
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách đánh giá
            </h1>
          </div>
        </div>
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filteredData || []}
            isLoading={isLoading}
            enableDateFilter={true}
            onSearchChange={setSearchTerm}
            onDateFilterChange={(filters) => setDateFilters(filters)}
          />
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Badge className="bg-[#E27447] text-white">
                <Star size={14} className="mr-1 fill-white" />
                Đánh giá
              </Badge>
              Chi tiết đánh giá
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Xem chi tiết về đánh giá của học viên.
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 bg-gray-100">
                  <AvatarFallback className="text-gray-600">
                    {selectedFeedback.user.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-800">
                    {selectedFeedback.user.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < selectedFeedback.rate ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-500">
                      ({selectedFeedback.rate}/5)
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Khoá học:</span>
                  <span className="text-gray-800">
                    {selectedFeedback.course.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Ngày đánh giá:
                  </span>
                  <span className="flex items-center gap-1 text-gray-800">
                    <Calendar size={14} className="text-gray-500" />
                    {format(
                      new Date(selectedFeedback.created_at),
                      'dd/MM/yyyy'
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">
                  Nội dung đánh giá:
                </h4>
                <div className="min-h-20 rounded-lg bg-gray-50 p-3 text-gray-700">
                  {selectedFeedback.content || 'Không có nội dung đánh giá'}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={closeDialog}
              className="bg-[#E27447] text-white transition-colors hover:bg-[#c96640]"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EvaluationView
