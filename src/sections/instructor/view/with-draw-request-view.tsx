'use client'

import React, { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Calendar, Eye } from 'lucide-react'

import { useGetWithDrawalRequests } from '@/hooks/wallet/useWallet'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/shared/data-table'
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header'
import DialogWithDrawRequest from '@/sections/instructor/components/with-draw-request/dialog-with-draw-request'
import { formatCurrency } from '@/lib/common'

const WithDrawRequestView = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectWithDraw, setSelectWithDraw] = useState<string>('')
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

  const { data: withDrawRequestData, isLoading } =
    useGetWithDrawalRequests(formattedFilters)

  type WithDrawStatus =
    | 'Đang xử lý'
    | 'Đã xử lý'
    | 'Chờ xác nhận lại'
    | 'Từ chối'
    | 'Hoàn thành'

  const columns: ColumnDef<{
    status: WithDrawStatus
    bank_name: string
    account_number: string
    account_holder: string
    amount: number
    request_date: string
    id: string
  }>[] = [
    {
      header: 'STT',
      accessorFn: (_row, index) => index + 1,
      cell: ({ getValue }: any) => (
        <div className="text-sm font-medium text-gray-900">{getValue()}</div>
      ),
      size: 50,
    },
    {
      accessorKey: 'bank_name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Ngân hàng" />
      ),
      cell: ({ row }: any) => {
        const withDrawRequest = row.original
        return (
          <p className="text-sm text-gray-600">{withDrawRequest.bank_name}</p>
        )
      },
    },
    {
      accessorKey: 'account_number',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Số tài khoản" />
      ),
      cell: ({ row }: any) => {
        const withDrawRequest = row.original
        return (
          <p className="text-sm text-gray-600">
            {withDrawRequest.account_number}
          </p>
        )
      },
    },
    {
      accessorKey: 'account_holder',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Chủ tài khoản" />
      ),
      cell: ({ row }: any) => {
        const withDrawRequest = row.original
        return (
          <p className="text-sm text-gray-600">
            {withDrawRequest.account_holder}
          </p>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Số tiền " />
      ),
      cell: ({ row }: any) => {
        const withDrawRequest = row.original
        return (
          <p className="rounded bg-green-50 px-3 py-1 font-semibold text-green-700">
            {formatCurrency(withDrawRequest.amount ?? 0)}
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
        const withDrawRequest = row.original

        const statusStyles = {
          'Đang xử lý': 'bg-amber-100 text-amber-800 border border-amber-300',
          'Đã xử lý': 'bg-blue-100 text-blue-800 border border-blue-300',
          'Chờ xác nhận lại':
            'bg-purple-100 text-purple-800 border border-purple-300',
          'Từ chối': 'bg-red-100 text-red-800 border border-red-300',
          'Hoàn thành':
            'bg-emerald-100 text-emerald-800 border border-emerald-300',
        }

        const style =
          statusStyles[withDrawRequest.status as WithDrawStatus] ||
          'bg-gray-100 text-gray-800 border border-gray-300'

        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style}`}
          >
            {withDrawRequest.status}
          </span>
        )
      },
    },
    {
      accessorKey: 'request_date',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Ngày gửi yêu cầu" />
      ),
      cell: ({ row }: any) => {
        const withDrawRequest = row.original
        return (
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {format(new Date(withDrawRequest.request_date), 'dd/MM/yyyy')}
            </span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }: any) => {
        const withDrawRequest = row.original
        return (
          <div>
            <Button
              onClick={() => {
                setOpenDialog(true)
                setSelectWithDraw(withDrawRequest.id)
              }}
              className="bg-[#E27447] text-white hover:bg-[#ce6a3e]"
              size="sm"
            >
              <Eye size={16} className="mr-1" />
              <span>Chi tiết</span>
            </Button>
          </div>
        )
      },
    },
  ]

  const filteredData = withDrawRequestData?.data?.filter(
    (withDrawRequest: any) => {
      const searchFields = ['bank_name', 'account_number', 'account_holder']
      return searchFields.some((field) =>
        withDrawRequest[field]
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase())
      )
    }
  )

  return (
    <>
      <div className="px-5 py-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-2xl font-bold">
            Yêu cầu rút tiền
          </h2>
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
      {openDialog && (
        <DialogWithDrawRequest
          selectWithDraw={selectWithDraw}
          open={openDialog}
          onOpenChange={setOpenDialog}
        />
      )}
    </>
  )
}

export default WithDrawRequestView
