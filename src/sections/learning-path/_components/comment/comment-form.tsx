import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import { Textarea } from '@/components/ui/textarea'
import QueryKey from '@/constants/query-key'
import {
  useGetCommentBlockTime,
  useStoreCommentLesson,
} from '@/hooks/comment-lesson/useComment'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  LessonCommentPayload,
  lessonCommentSchema,
} from '@/validations/comment'
import { Send, TriangleAlert, X } from 'lucide-react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useCommentBlockStore } from '@/stores/useCommentBlockStore'

export const CommentForm = ({ lessonId }: { lessonId: number }) => {
  const { user } = useAuthStore()
  const {
    isBlocked,
    blockDuration,
    setBlockState,
    clearBlockState,
    getRemainingTime,
  } = useCommentBlockStore()

  const [isAdding, setIsAdding] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const queryClient = useQueryClient()

  const { mutate: storeLessonComment, isPending } = useStoreCommentLesson()

  const {
    data: blockTimeData,
    isLoading: isLoadingBlockTime,
    refetch: refetchBlockTime,
  } = useGetCommentBlockTime()

  useEffect(() => {
    const remaining = getRemainingTime()
    if (remaining > 0) {
      setRemainingTime(remaining)
    } else if (isBlocked) {
      clearBlockState()
    }
  }, [isBlocked, getRemainingTime, clearBlockState])

  useEffect(() => {
    if (blockTimeData?.data) {
      if (blockTimeData.data.is_blocked) {
        const countdown = blockTimeData.data.countdown
        setBlockState(true, countdown)
        setRemainingTime(countdown)
      } else {
        const remaining = getRemainingTime()
        if (remaining <= 0 && isBlocked) {
          clearBlockState()
        }
      }
    }
  }, [
    blockTimeData,
    setBlockState,
    getRemainingTime,
    isBlocked,
    clearBlockState,
  ])

  useEffect(() => {
    if (isBlocked) {
      const intervalId = setInterval(() => {
        const remaining = getRemainingTime()
        setRemainingTime(remaining)

        if (remaining <= 0) {
          clearInterval(intervalId)
          clearBlockState()
          refetchBlockTime()
        }
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [isBlocked, getRemainingTime, clearBlockState, refetchBlockTime])

  const form = useForm<LessonCommentPayload>({
    resolver: zodResolver(lessonCommentSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = useCallback(
    (values: LessonCommentPayload) => {
      if (isBlocked) {
        toast.error('Bạn đang bị cấm bình luận')
        return
      }

      const payload: LessonCommentPayload = {
        ...values,
        lesson_id: lessonId,
      }

      storeLessonComment(payload, {
        onSuccess: async (res: any) => {
          toast.success(res.message)
          form.reset()
          setIsAdding(false)

          await queryClient.invalidateQueries({
            queryKey: [QueryKey.LESSON_COMMENT, lessonId],
          })
        },
        onError: (error: any) => {
          toast.error(error.message)

          if (error?.countdown) {
            const countdown = error.countdown
            setBlockState(true, countdown)
            setRemainingTime(countdown)
            setIsAdding(false)
            form.reset()

            refetchBlockTime()
          }
        },
      })
    },
    [
      isBlocked,
      lessonId,
      storeLessonComment,
      form,
      queryClient,
      refetchBlockTime,
      setBlockState,
    ]
  )

  const handleTimerComplete = useCallback(() => {
    clearBlockState()
    refetchBlockTime()
    return { shouldRepeat: false }
  }, [clearBlockState, refetchBlockTime])

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    }
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }, [])

  const handleCommentClick = useCallback(() => {
    if (!isBlocked && !isLoadingBlockTime) {
      setIsAdding(true)
    } else if (isBlocked) {
      toast.error('Bạn đang bị cấm bình luận')
    }
  }, [isBlocked, isLoadingBlockTime])

  const placeholderText = useMemo(() => {
    if (isBlocked) return 'Bạn đang bị tạm khóa tính năng bình luận...'
    if (isLoadingBlockTime) return 'Đang kiểm tra...'
    return 'Nhập bình luận mới của bạn...'
  }, [isBlocked, isLoadingBlockTime])

  return (
    <div className="space-y-4">
      {isBlocked && (
        <div className="overflow-hidden rounded-lg bg-gradient-to-r from-red-50 to-orange-50 shadow-sm">
          <div className="border-b border-red-100 bg-red-100/30 px-4 py-3">
            <h3 className="flex items-center gap-2 font-medium text-red-700">
              <TriangleAlert size={16} />
              Tạm thời bị hạn chế bình luận
            </h3>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="pr-4">
              <p className="text-sm text-gray-700">
                Bạn tạm thời không thể bình luận do vi phạm quy định. Vui lòng
                thử lại sau khi hết thời gian chờ.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Tránh sử dụng ngôn từ không phù hợp để tránh bị hạn chế lâu hơn.
              </p>
            </div>
            <div className="shrink-0">
              <CountdownCircleTimer
                key={blockDuration}
                isPlaying
                duration={blockDuration}
                initialRemainingTime={remainingTime}
                colors={['#EF4444', '#F59E0B', '#3B82F6', '#10B981']}
                colorsTime={[
                  0,
                  blockDuration * 0.3,
                  blockDuration * 0.6,
                  blockDuration,
                ]}
                size={90}
                strokeWidth={6}
                onComplete={handleTimerComplete}
                onUpdate={(remaining) => setRemainingTime(remaining)}
              >
                {({ remainingTime }) => (
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-medium text-gray-500">
                      Còn lại
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatTime(remainingTime)}
                    </span>
                  </div>
                )}
              </CountdownCircleTimer>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Avatar className="size-10">
          <AvatarImage src={user?.avatar || ''} alt={user?.name} />
          <AvatarFallback className="bg-blue-100 text-blue-800">
            {user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        {!isAdding ? (
          <div
            className={`flex w-full items-center rounded-3xl bg-gray-50 p-2 px-4 py-3 ${
              isBlocked || isLoadingBlockTime
                ? 'cursor-not-allowed text-gray-400'
                : 'cursor-text text-gray-500 hover:text-gray-700'
            }`}
            onClick={handleCommentClick}
          >
            {isBlocked && (
              <TriangleAlert size={16} className="mr-2 text-amber-500" />
            )}
            {placeholderText}
          </div>
        ) : (
          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ''}
                          placeholder="Nhập bình luận của bạn..."
                          className="min-h-[100px] resize-none rounded-2xl bg-white/80 px-4 py-3 focus:border-[#E27447] focus:outline-none focus:ring-1 focus:ring-[#E27447] focus-visible:border-[#E27447] focus-visible:ring-1 focus-visible:ring-[#E27447]"
                          autoFocus
                          disabled={isBlocked}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="reset"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAdding(false)}
                    disabled={isPending}
                    className="rounded-full"
                  >
                    <X size={14} />
                    Hủy
                  </Button>
                  <LoadingButton
                    type="submit"
                    size="sm"
                    loading={isPending}
                    disabled={isBlocked}
                    className="rounded-full"
                  >
                    <Send size={14} />
                    Gửi bình luận
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  )
}
