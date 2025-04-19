import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
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
// import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export const CommentForm = ({ lessonId }: { lessonId: number }) => {
  const { user } = useAuthStore()
  // const [showTimer, setShowTimer] = useState(true)
  // const [timerKey, setTimerKey] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const queryClient = useQueryClient()

  const {
    mutate: storeLessonComment,
    isPending,
    // error,
  } = useStoreCommentLesson()

  const { data: CommentBlockTimeData } = useGetCommentBlockTime()
  console.log('CommentBlockTimeData', CommentBlockTimeData)

  const form = useForm<LessonCommentPayload>({
    resolver: zodResolver(lessonCommentSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = (values: LessonCommentPayload) => {
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
        // if (error?.formatted_countdown) {
        //   setShowTimer(true)
        //   setTimerKey((prev) => prev + 1)
        //   setIsAdding(false)
        //   form.reset()
        // }
      },
    })
  }

  // const parseFormattedCountdown = (formatted: string): number => {
  //   const [minutes, seconds] = formatted.split(':').map(Number)
  //   return minutes * 60 + seconds
  // }
  //
  // const formatted = (error as any)?.formatted_countdown || ''
  // const duration = formatted ? parseFormattedCountdown(formatted) : 0
  //
  // const handleCommentClick = () => {
  //   if (!showTimer || !formatted) {
  //     setIsAdding(true)
  //   }
  //   // If timer is active, do nothing
  // }

  return (
    <div className="flex gap-3">
      {/*<div>*/}
      {/*  {showTimer && formatted ? (*/}
      {/*    <CountdownCircleTimer*/}
      {/*      key={timerKey}*/}
      {/*      isPlaying*/}
      {/*      duration={duration}*/}
      {/*      colors={['#00bf63', '#F7B801', '#FF0000']}*/}
      {/*      colorsTime={[duration, duration / 2, 0]}*/}
      {/*      size={80}*/}
      {/*      strokeWidth={6}*/}
      {/*      onComplete={() => {*/}
      {/*        console.log('Countdown done!')*/}
      {/*        setShowTimer(false)*/}
      {/*        return { shouldRepeat: false }*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      {({ remainingTime }) => {*/}
      {/*        const minutes = Math.floor(remainingTime / 60)*/}
      {/*        const seconds = remainingTime % 60*/}
      {/*        return (*/}
      {/*          <span className="text-sm font-semibold">*/}
      {/*            {String(minutes).padStart(2, '0')}:*/}
      {/*            {String(seconds).padStart(2, '0')}*/}
      {/*          </span>*/}
      {/*        )*/}
      {/*      }}*/}
      {/*    </CountdownCircleTimer>*/}
      {/*  ) : (*/}
      {/*    ' '*/}
      {/*  )}*/}
      {/*</div>*/}

      <Avatar className="size-10">
        <AvatarImage src={user?.avatar || ''} alt={user?.name} />
        <AvatarFallback className="bg-blue-100 text-blue-800">
          {user?.name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 rounded-3xl bg-gray-50 p-2">
        {!isAdding ? (
          <div
            className="cursor-text px-4 py-3 text-gray-500 hover:text-gray-700"
            onClick={() => setIsAdding(true)}
            // className={`px-4 py-3 ${
            //   showTimer && formatted
            //     ? 'cursor-not-allowed text-gray-400'
            //     : 'cursor-text text-gray-500 hover:text-gray-700'
            // }`}
            // onClick={handleCommentClick}
          >
            Nhập bình luận mới của bạn...
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                        className="min-h-[100px] resize-none border border-gray-200 focus:border-gray-300 focus:outline-none focus:ring-0 focus-visible:border-gray-300 focus-visible:ring-0"
                        autoFocus
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
                  Hủy
                </Button>
                <LoadingButton
                  type="submit"
                  size="sm"
                  loading={isPending}
                  className="rounded-full"
                >
                  Gửi
                </LoadingButton>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}
