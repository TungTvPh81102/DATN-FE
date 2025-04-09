'use client'

import React, { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  Calendar,
  Eye,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import {
  useGetWithDrawalRequests,
  useHandleConfirmWithDrawalRequest,
} from '@/hooks/wallet/useWallet'
import QueryKey from '@/constants/query-key'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/shared/data-table'
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header'
import DialogWithDrawRequest from '@/sections/instructor/components/with-draw-request/dialog-with-draw-request'
import { formatCurrency } from '@/lib/common'
import Container from '@/components/shared/container'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'

const WithDrawRequestView = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectWithDraw, setSelectWithDraw] = useState<string>('')
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false)
  const [complaintNote, setComplaintNote] = useState('')
  const [selectedRequestId, setSelectedRequestId] = useState<string>('')
  const [dateFilters, setDateFilters] = useState<{
    fromDate: Date | null
    toDate: Date | null
  }>({
    fromDate: null,
    toDate: null,
  })
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [withdrawIdToConfirm, setWithdrawIdToConfirm] = useState<string>('')

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

  const { mutate, isPending } = useHandleConfirmWithDrawalRequest()

  const openConfirmDialog = (id: string) => {
    setWithdrawIdToConfirm(id)
    setConfirmDialogOpen(true)
  }

  const handleConfirmReceipt = () => {
    const payload = {
      is_received: 0,
      instructor_confirmation_note: 'Đã nhận tiền thành công',
    }

    mutate(
      {
        id: withdrawIdToConfirm,
        data: payload,
      },
      {
        onSuccess: async (res: any) => {
          setConfirmDialogOpen(false)
          toast.success(res.message || 'Xác nhận nhận tiền thành công')
          await queryClient.invalidateQueries({
            queryKey: [QueryKey.INSTRUCTOR_WITH_DRAW_REQUEST],
          })
        },
        onError: async (error: any) => {
          setConfirmDialogOpen(false)
          toast.error(error?.message || 'Có lỗi xảy ra khi xác nhận')
          await queryClient.invalidateQueries({
            queryKey: [QueryKey.INSTRUCTOR_WITH_DRAW_REQUEST],
          })
        },
      }
    )
  }

  const openComplaintDialog = (id: string) => {
    setSelectedRequestId(id)
    setComplaintDialogOpen(true)
  }

  const submitComplaint = () => {
    if (!complaintNote.trim() || complaintNote.length < 10) {
      toast.warning('Nội dung khiếu nại phải từ 10 ký tự trở lên!')
      return
    }

    const payload = {
      is_received: 1,
      instructor_confirmation_note: complaintNote,
    }

    mutate(
      {
        id: selectedRequestId,
        data: payload,
      },
      {
        onSuccess: async (res: any) => {
          setComplaintDialogOpen(false)
          setComplaintNote('')
          toast.success(res.message || 'Gửi khiếu nại thành công')
          await queryClient.invalidateQueries({
            queryKey: [QueryKey.INSTRUCTOR_WITH_DRAW_REQUEST],
          })
        },
        onError: async (error: any) => {
          toast.error(error?.message || 'Có lỗi xảy ra khi gửi khiếu nại')
          await queryClient.invalidateQueries({
            queryKey: [QueryKey.INSTRUCTOR_WITH_DRAW_REQUEST],
          })
        },
      }
    )
  }

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
    instructor_confirmation?: string
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
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Thao tác" />
      ),
      cell: ({ row }: any) => {
        const withDrawRequest = row.original
        const canConfirm =
          withDrawRequest.status === 'Đã xử lý' &&
          withDrawRequest.instructor_confirmation !== 'confirmed'

        return (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                setOpenDialog(true)
                setSelectWithDraw(withDrawRequest.id)
              }}
              className="hover:[bg-#FF6852] bg-[#EC8961] text-white"
              size="sm"
            >
              <Eye size={14} className="mr-1" />
              <span>Chi tiết</span>
            </Button>

            {canConfirm && (
              <>
                <Button
                  onClick={() => openConfirmDialog(withDrawRequest.id)}
                  className="bg-green-600 text-white hover:bg-green-700"
                  size="sm"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 size={14} className="mr-1 animate-spin" />
                  ) : (
                    <CheckCircle size={14} className="mr-1" />
                  )}
                  <span>Đã nhận tiền</span>
                </Button>

                <Button
                  onClick={() => openComplaintDialog(withDrawRequest.id)}
                  className="bg-amber-500 text-white hover:bg-amber-600"
                  size="sm"
                >
                  <AlertTriangle size={14} className="mr-1" />
                  <span>Khiếu nại</span>
                </Button>
              </>
            )}
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
      <Container>
        <div className="flex items-center justify-between">
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
      </Container>

      {openDialog && (
        <DialogWithDrawRequest
          selectWithDraw={selectWithDraw}
          open={openDialog}
          onOpenChange={setOpenDialog}
        />
      )}

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-medium">
              Xác nhận đã nhận tiền
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn rằng mình đã nhận được tiền từ yêu cầu rút tiền
              này? Sau khi xác nhận, trạng thái yêu cầu sẽ được cập nhật thành
              &#34;Hoàn thành&#34;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              className="border-gray-300 text-gray-700"
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReceipt}
              disabled={isPending}
              className="bg-[#EA855C] text-white"
            >
              {isPending ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                'Xác nhận đã nhận tiền'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={complaintDialogOpen} onOpenChange={setComplaintDialogOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle size={18} className="mr-2 text-amber-500" />
              Gửi khiếu nại
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Nội dung khiếu nại
            </label>
            <Textarea
              rows={4}
              value={complaintNote}
              onChange={(e) => setComplaintNote(e.target.value)}
              className="w-full rounded-md border border-gray-300 text-sm"
              placeholder="Nhập nội dung khiếu nại của bạn..."
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setComplaintDialogOpen(false)
                setComplaintNote('')
              }}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={submitComplaint}
              className="bg-[#CE6A3E] text-white hover:bg-[#ce6a3e]"
              disabled={isPending || !complaintNote.trim()}
            >
              {isPending ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                'Gửi khiếu nại'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WithDrawRequestView
