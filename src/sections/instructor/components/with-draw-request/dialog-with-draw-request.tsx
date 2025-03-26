import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  AlertCircle,
  AlertTriangle,
  BanknoteIcon,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  User,
} from 'lucide-react'
import { toast } from 'react-toastify'

import QueryKey from '@/constants/query-key'
import { formatCurrency } from '@/lib/common'
import {
  useGetWithDrawalRequest,
  useHandleConfirmWithDrawalRequest,
} from '@/hooks/wallet/useWallet'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type StatusType =
  | 'Đang xử lý'
  | 'Đã xử lý'
  | 'Chờ xác nhận lại'
  | 'Hoàn thành'
  | 'Từ chối'

const statusMappings: Record<
  StatusType,
  {
    class: string
    icon: JSX.Element
  }
> = {
  'Đang xử lý': {
    class: 'bg-amber-100 text-amber-800 border border-amber-300',
    icon: <Clock className="mr-2" size={16} />,
  },
  'Đã xử lý': {
    class: 'bg-blue-100 text-blue-800 border border-blue-300',
    icon: <FileText className="mr-2" size={16} />,
  },
  'Chờ xác nhận lại': {
    class: 'bg-purple-100 text-purple-800 border border-purple-300',
    icon: <AlertCircle className="mr-2" size={16} />,
  },
  'Hoàn thành': {
    class: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    icon: <CheckCircle className="mr-2" size={16} />,
  },
  'Từ chối': {
    class: 'bg-red-100 text-red-800 border border-red-300',
    icon: <AlertTriangle className="mr-2" size={16} />,
  },
}

const DialogWithDrawRequest = ({
  open,
  onOpenChange,
  selectWithDraw,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectWithDraw: string
}) => {
  const queryClient = useQueryClient()

  const [responseNote, setResponseNote] = useState('')
  const [isComplaintChecked, setIsComplaintChecked] = useState(false)

  const { data: withDrawRequestData, isLoading } =
    useGetWithDrawalRequest(selectWithDraw)

  const { mutate, isPending } = useHandleConfirmWithDrawalRequest()

  const handleRequestSubmission = () => {
    if (isComplaintChecked && !responseNote) {
      toast.warning('Hãy nhập nội dung phản hồi trước khi gửi khiếu nại! ')
      return
    }

    const isReceived = isComplaintChecked ? 1 : 0

    const payload = {
      is_received: isReceived,
      instructor_confirmation_note: isComplaintChecked
        ? responseNote
        : 'Đã nhận tiền thành công',
    }

    mutate(
      {
        id: selectWithDraw,
        data: payload,
      },
      {
        onSuccess: async (res: any) => {
          setIsComplaintChecked(false)
          onOpenChange(false)

          toast.success(res.message)

          await queryClient.invalidateQueries({
            queryKey: [QueryKey.INSTRUCTOR_WITH_DRAW_REQUEST],
          })
        },
        onError: async (error: any) => {
          toast.error(error?.message)

          await queryClient.invalidateQueries({
            queryKey: [QueryKey.INSTRUCTOR_WITH_DRAW_REQUEST],
          })
        },
      }
    )
  }

  const status = withDrawRequestData?.data?.status || ''
  const statusInfo = statusMappings[status as StatusType] || {
    class: 'bg-gray-100 text-gray-800 border border-gray-300',
    icon: null,
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col rounded-xl p-0">
          <div className="sticky top-0 z-10 rounded-lg bg-gradient-to-r from-[#E27447] to-[#f0936e] p-6 text-white">
            <div className="flex items-center justify-between">
              <DialogHeader className="text-white">
                <DialogTitle className="flex items-center text-2xl font-bold">
                  <FileText className="mr-2" size={22} />
                  Chi tiết yêu cầu rút tiền
                </DialogTitle>
                <DialogDescription className="mt-1 text-white/80">
                  Mã yêu cầu: {selectWithDraw ?? ''}
                </DialogDescription>
              </DialogHeader>
              <div>
                {withDrawRequestData?.data?.instructor_confirmation ===
                'confirmed' ? (
                  <Badge className="flex items-center gap-1 bg-green-500 px-3 py-1.5 text-white hover:bg-green-600">
                    <CheckSquare size={16} />
                    Đã phản hồi
                  </Badge>
                ) : (
                  <Badge className="flex items-center gap-1 bg-gray-600 px-3 py-1.5 text-white hover:bg-gray-700">
                    <AlertCircle size={16} />
                    Chưa phản hồi
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="size-8 animate-spin text-[#E27447]" />
              </div>
            ) : (
              <>
                {withDrawRequestData && (
                  <>
                    <div className="mb-6 rounded-xl bg-[#E27447]/5 p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-800">
                          Thông tin tài chính
                        </h3>
                        <div
                          className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${statusInfo.class}`}
                        >
                          {statusInfo.icon}
                          {withDrawRequestData?.data?.status}
                        </div>
                      </div>
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Số tiền yêu cầu
                          </span>
                          <span className="text-2xl font-bold text-[#E27447]">
                            {formatCurrency(
                              withDrawRequestData.data.amount || ''
                            )}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2">
                            <Calendar
                              size={16}
                              className="mr-2 text-gray-500"
                            />
                            <div>
                              <div className="text-xs text-gray-500">
                                Ngày yêu cầu
                              </div>
                              <div className="font-medium">
                                {withDrawRequestData.data.request_date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2">
                            <CheckCircle
                              size={16}
                              className="mr-2 text-gray-500"
                            />
                            <div>
                              <div className="text-xs text-gray-500">
                                Ngày hoàn thành
                              </div>
                              <div className="font-medium">
                                {withDrawRequestData.data.completed_date ||
                                  'Chưa hoàn thành'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="flex items-start rounded-lg border border-gray-200 p-4">
                        <BanknoteIcon
                          className="mr-3 text-[#E27447]"
                          size={20}
                        />
                        <div>
                          <p className="text-sm text-gray-500">Ngân hàng</p>
                          <p className="font-semibold text-gray-900">
                            {withDrawRequestData.data.bank_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start rounded-lg border border-gray-200 p-4">
                        <CreditCard className="mr-3 text-[#E27447]" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Số tài khoản</p>
                          <p className="font-semibold text-gray-900">
                            {withDrawRequestData.data.account_number}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start rounded-lg border border-gray-200 p-4">
                        <User className="mr-3 text-[#E27447]" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Chủ tài khoản</p>
                          <p className="font-semibold text-gray-900">
                            {withDrawRequestData.data.account_holder}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start rounded-lg border border-gray-200 p-4">
                        <FileText className="mr-3 text-[#E27447]" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Ghi chú</p>
                          <p className="font-semibold text-gray-900">
                            {withDrawRequestData.data.note ||
                              'Không có ghi chú'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 space-y-4">
                      {withDrawRequestData.data.admin_comment && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                          <h4 className="mb-1 flex items-center font-semibold text-blue-700">
                            <FileText size={16} className="mr-2" />
                            Ghi chú từ giảng viên
                          </h4>
                          <p className="text-blue-800">
                            {withDrawRequestData.data.admin_comment}
                          </p>
                        </div>
                      )}

                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h4 className="mb-1 flex items-center font-semibold text-gray-700">
                          <CheckSquare size={16} className="mr-2" />
                          Phản hồi xác nhận
                        </h4>
                        <p className="text-gray-800">
                          {withDrawRequestData.data
                            .instructor_confirmation_note ||
                            'Bạn chưa phản hồi'}
                        </p>

                        {withDrawRequestData.data
                          .instructor_confirmation_date && (
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            <span>
                              Ngày gửi phản hồi:{' '}
                              {
                                withDrawRequestData.data
                                  .instructor_confirmation_date
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {(withDrawRequestData?.data.status === 'Đã xử lý' ||
                      withDrawRequestData?.data.instructor_confirmation ===
                        'not_received') && (
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="mb-4 flex items-center">
                          <div className="flex size-10 items-center justify-center rounded-full bg-[#E27447]/10">
                            <CheckSquare size={18} className="text-[#E27447]" />
                          </div>
                          <h3 className="ml-3 text-lg font-semibold text-gray-800">
                            Xác nhận thông tin
                          </h3>
                        </div>

                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="receivedConfirm"
                              name="confirmationType"
                              className="size-5 border-gray-300 text-[#E27447] focus:ring-[#E27447]"
                              checked={!isComplaintChecked}
                              onChange={() => setIsComplaintChecked(false)}
                            />
                            <label
                              htmlFor="receivedConfirm"
                              className="ml-2 text-sm font-medium text-gray-700"
                            >
                              Tôi đã nhận được tiền
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="complaintConfirm"
                              name="confirmationType"
                              className="size-5 border-gray-300 text-[#E27447] focus:ring-[#E27447]"
                              checked={isComplaintChecked}
                              onChange={() => setIsComplaintChecked(true)}
                            />
                            <label
                              htmlFor="complaintConfirm"
                              className="ml-2 text-sm font-medium text-gray-700"
                            >
                              Tôi muốn gửi khiếu nại
                            </label>
                          </div>
                        </div>

                        <form
                          onSubmit={(e) => e.preventDefault()}
                          className="space-y-4"
                        >
                          {isComplaintChecked && (
                            <div>
                              <label className="block text-sm font-medium text-gray-900">
                                Nội dung phản hồi
                              </label>
                              <textarea
                                rows={3}
                                value={responseNote}
                                onChange={(e) =>
                                  setResponseNote(e.target.value)
                                }
                                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Nhập nội dung phản hồi tại đây..."
                              />
                            </div>
                          )}
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={isPending}
                              onClick={() => {
                                setIsComplaintChecked(false)
                                setResponseNote('')
                                onOpenChange(false)
                              }}
                            >
                              Hủy bỏ
                            </Button>
                            <Button
                              type="button"
                              variant="default"
                              onClick={handleRequestSubmission}
                              disabled={isPending}
                            >
                              {isPending ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                              ) : isComplaintChecked ? (
                                'Xác nhận khiếu nại'
                              ) : (
                                'Đã nhận tiền'
                              )}
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DialogWithDrawRequest
