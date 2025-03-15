'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Calendar, Download, Eye } from 'lucide-react'

import { useGetParticipatedCourses } from '@/hooks/instructor/transaction/useInstructorTransaction'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DataTable } from '@/components/shared/data-table'
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/common'
import { Separator } from '@/components/ui/separator'
import Container from '@/components/shared/container'

export default function TransactionManageView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedTransation, setSelectedTransation] = useState<any>(null)

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

  const { data: participatedCourseData, isLoading } =
    useGetParticipatedCourses(formattedFilters)

  const filteredData = participatedCourseData?.data?.filter((course: any) => {
    const searchFields = ['course_name', 'student_name', 'invoice_code']
    return searchFields.some((field) =>
      course[field]?.toLowerCase()?.includes(searchTerm.toLowerCase())
    )
  })

  const totalRevenue =
    filteredData?.reduce(
      (sum: number, item: any) => sum + Number(item.amount_paid),
      0
    ) || 0

  const columns: ColumnDef<any[]>[] = [
    {
      header: 'STT',
      accessorFn: (_row, index) => index + 1,
      cell: ({ getValue }: any) => (
        <div className="text-center font-medium text-gray-700">
          {getValue()}
        </div>
      ),
      size: 50,
    },
    {
      accessorKey: 'invoice_code',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Mã hoá đơn" />
      ),
      cell: ({ row }: any) => {
        const invoice = row.original
        return (
          <p className="font-medium text-gray-900">{invoice.invoice_code}</p>
        )
      },
    },
    {
      accessorKey: 'course_name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Khóa học" />
      ),
      cell: ({ row }: any) => {
        const course = row.original
        return (
          <div className="flex items-center gap-3">
            <Image
              alt={course.course_name}
              className="rounded-lg border border-gray-200 object-cover"
              src={course.course_thumbnail}
              width={48}
              height={48}
            />
            <span className="line-clamp-2 font-medium text-gray-800">
              {course.course_name}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'student_name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Học viên" />
      ),
      cell: ({ row }: any) => {
        const course = row.original
        return <p className="text-gray-700">{course.student_name}</p>
      },
    },
    {
      accessorKey: 'amount_paid',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Số tiền đã thanh toán" />
      ),
      cell: ({ row }: any) => {
        const course = row.original
        return (
          <p className="font-medium text-gray-900">
            {Number(course.amount_paid).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </p>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }: any) => {
        const course = row.original
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 font-medium text-green-700"
          >
            {course.status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'invoice_created_at',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Ngày mua" />
      ),
      cell: ({ row }: any) => {
        const course = row.original
        return (
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-500" />
            <span>
              {format(new Date(course.invoice_created_at), 'dd/MM/yyyy')}
            </span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }: any) => {
        const invoice = row.original
        return (
          <Button
            onClick={() => {
              setSelectedTransation(invoice)
              setOpenDialog(true)
            }}
            size="sm"
            variant="ghost"
            className="hover:bg-[#E27447]/10 hover:text-[#E27447]"
          >
            <Eye size={18} />
          </Button>
        )
      },
    },
  ]

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-medium">Lịch sử mua hàng</h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý các giao dịch khóa học
            </p>
          </div>

          <Button
            variant="outline"
            className="gap-2 border-[#E27447] text-[#E27447] hover:bg-[#E27447]/10 hover:text-[#E27447]"
          >
            <Download />
            Xuất báo cáo
          </Button>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Tổng giao dịch</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                {filteredData?.length || 0}
              </h3>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
              <h3 className="mt-1 text-2xl font-bold text-[#E27447]">
                {formatCurrency(totalRevenue ?? 0)}
              </h3>
            </CardContent>
          </Card>
        </div>

        <DataTable
          columns={columns}
          data={filteredData || []}
          isLoading={isLoading}
          enableDateFilter={true}
          onSearchChange={setSearchTerm}
          onDateFilterChange={(filters) => setDateFilters(filters)}
        />
      </div>

      {selectedTransation && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Chi tiết hóa đơn
              </DialogTitle>
              <Separator className="my-2" />
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="mb-4 flex items-center">
                <Image
                  alt={selectedTransation.course_name}
                  className="rounded-lg border border-gray-200 object-cover"
                  src={selectedTransation.course_thumbnail}
                  width={80}
                  height={80}
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedTransation.course_name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="mt-1 border-green-200 bg-green-50 font-medium text-green-700"
                  >
                    {selectedTransation.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã hóa đơn</p>
                  <p className="font-medium text-gray-900">
                    {selectedTransation.invoice_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Học viên</p>
                  <p className="font-medium text-gray-900">
                    {selectedTransation.student_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày mua</p>
                  <p className="font-medium text-gray-900">
                    {format(
                      new Date(selectedTransation.invoice_created_at),
                      'dd/MM/yyyy'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số tiền thanh toán</p>
                  <p className="font-medium text-[#E27447]">
                    {Number(selectedTransation.amount_paid).toLocaleString(
                      'vi-VN',
                      {
                        style: 'currency',
                        currency: 'VND',
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenDialog(false)}
                className="mr-2"
              >
                Đóng
              </Button>
              <Button className="bg-[#E27447] text-white hover:bg-[#d16a3d]">
                In hóa đơn
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  )
}
