'use client'
import React, { useMemo, useState } from 'react'
import { useGetParticipatedMembership } from '@/hooks/instructor/transaction/useInstructorTransaction'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header'
import Image from 'next/image'
import Container from '@/components/shared/container'
import { Button } from '@/components/ui/button'
import { Calendar, Download, Eye } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { IParticipatedMembership } from '@/types'

const SEARCH_FIELDS = ['membership_plan_name', 'student_name', 'invoice_code']

const TransactionManageMembershipView = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [filters, setFilters] = useState<{
    fromDate: Date | null
    toDate: Date | null
  }>({
    fromDate: null,
    toDate: null,
  })

  const formattedFilters = {
    fromDate: filters.fromDate
      ? format(filters.fromDate, 'yyyy-MM-dd')
      : undefined,
    toDate: filters.toDate ? format(filters.toDate, 'yyyy-MM-dd') : undefined,
  }

  const { data, isLoading } = useGetParticipatedMembership(formattedFilters)

  const searchTermLower = searchTerm.toLowerCase().trim()

  const filteredData = useMemo(() => {
    if (!data?.data) return []

    return data.data.filter((membership: IParticipatedMembership) =>
      SEARCH_FIELDS.some((field) =>
        membership[field as keyof IParticipatedMembership]
          ?.toString()
          ?.toLowerCase()
          .includes(searchTermLower)
      )
    )
  }, [data, searchTermLower])

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
      accessorKey: 'membership_plan_name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Tên gói thành viên" />
      ),
      cell: ({ row }: any) => {
        const membership = row.original
        return (
          <p className="text-gray-700">{membership.membership_plan_name}</p>
        )
      },
    },
    {
      accessorKey: 'student_name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Tên học viên" />
      ),
      cell: ({ row }: any) => {
        const student = row.original
        return (
          <div className="flex items-center gap-3">
            <Image
              alt={student.student_name}
              className="rounded-full border border-gray-200 object-cover"
              src={student?.student_avatar ?? ''}
              width={36}
              height={36}
            />
            <span className="line-clamp-2 font-medium text-gray-800">
              {student.student_name}
            </span>
          </div>
        )
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
              setSelectedTransaction(invoice)
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
            <h1 className="text-2xl font-medium">
              Danh sách gói membership đã bán
            </h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý các giao dịch membership
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

        <DataTable
          columns={columns}
          data={(filteredData as any[]) ?? []}
          isLoading={isLoading}
          onSearchChange={setSearchTerm}
          enableDateFilter={true}
          onDateFilterChange={(filter) => setFilters(filter)}
        />
      </div>

      {selectedTransaction && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Chi tiết hóa đơn
              </DialogTitle>
              <Separator className="my-2" />
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="mb-4 flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedTransaction.membership_plan_name}
                </h3>
                <Badge
                  variant="outline"
                  className="mt-1 border-green-200 bg-green-50 font-medium text-green-700"
                >
                  {selectedTransaction.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã hóa đơn</p>
                  <p className="font-medium text-gray-900">
                    {selectedTransaction.invoice_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Học viên</p>
                  <div className="flex items-center space-x-1">
                    <Image
                      alt={selectedTransaction.student_name}
                      className="rounded-full border border-gray-200 object-cover"
                      src={selectedTransaction.student_avatar ?? ''}
                      width={28}
                      height={28}
                    />
                    <p className="font-medium text-gray-900">
                      {selectedTransaction.student_name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày mua</p>
                  <p className="font-medium text-gray-900">
                    {format(
                      new Date(selectedTransaction.invoice_created_at),
                      'dd/MM/yyyy'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số tiền thanh toán</p>
                  <p className="font-medium text-[#E27447]">
                    {Number(selectedTransaction.amount_paid).toLocaleString(
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

export default TransactionManageMembershipView
