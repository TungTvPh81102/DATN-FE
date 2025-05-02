import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, X } from 'lucide-react'
import { useReportComment } from '@/hooks/comment-lesson/useComment'
import {
  ReportCommentPayload,
  reportCommentSchema,
} from '@/validations/comment'
import { toast } from 'react-toastify'

interface ReportCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lessonId: number
  commentId: string
}

const ReportCommentDialog: React.FC<ReportCommentDialogProps> = ({
  open,
  onOpenChange,
  lessonId,
  commentId,
}) => {
  const { mutate: reportComment, isPending } = useReportComment()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ReportCommentPayload>({
    resolver: zodResolver(reportCommentSchema),
    defaultValues: {
      report_content: '',
    },
  })

  const reportContent = watch('report_content', '')
  const charCount = reportContent.length
  const maxChars = 100

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  if (!open) return null

  const handleFormSubmit = (data: ReportCommentPayload) => {
    reportComment(
      {
        data: {
          comment_id: commentId,
          report_content: data.report_content,
        },
        lessonId,
      },
      {
        onSuccess: async (res: any) => {
          toast.success(res.message)
          onOpenChange(false)
          reset()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-50 to-orange-100 p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Báo cáo bình luận
            </h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-orange-100 hover:text-orange-700"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-6 leading-relaxed text-gray-600">
            Vui lòng cho chúng tôi biết lý do bạn muốn báo cáo bình luận này.
            Chúng tôi sẽ xem xét và có hành động phù hợp.
          </p>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  {...register('report_content')}
                  className={`h-32 w-full resize-none rounded-xl border p-4 transition-all focus:outline-none focus:ring-2 ${
                    errors.report_content
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-orange-200 focus:ring-orange-200'
                  }`}
                  placeholder="Nhập lý do báo cáo..."
                />
                <div
                  className={`absolute bottom-3 right-3 text-sm font-medium ${
                    charCount > maxChars
                      ? 'text-red-500'
                      : charCount > maxChars * 0.8
                        ? 'text-orange-500'
                        : 'text-gray-400'
                  }`}
                >
                  {charCount}/{maxChars}
                </div>
              </div>

              {errors.report_content && (
                <p className="text-sm font-medium text-red-500">
                  {errors.report_content.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="rounded-xl border border-gray-200 px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2"
              >
                Hủy
              </button>
              <button
                disabled={isPending}
                className="flex min-w-[100px] items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 font-medium text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:from-orange-400 disabled:to-orange-400"
              >
                {isPending ? (
                  <span className="inline-block size-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  'Báo cáo'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportCommentDialog
