import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import {
  createLiveSessionSchema,
  CreateLiveStreamPayload,
} from '@/validations/live'
import QueryKey from '@/constants/query-key'
import { useCreateLiveSteam } from '@/hooks/live/useLive'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ModalLoading from '@/components/common/ModalLoading'

const DialogLiveStreamCreate = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const queryClient = useQueryClient()

  const { mutate: createLiveStream, isPending } = useCreateLiveSteam()

  const form = useForm<CreateLiveStreamPayload>({
    resolver: zodResolver(createLiveSessionSchema),
    defaultValues: {
      title: '',
      description: '',
      start_time: '',
    },
  })

  const onSubmit = (values: CreateLiveStreamPayload) => {
    createLiveStream(values, {
      onSuccess: async (res: any) => {
        form.reset()
        toast.success(res.message)
        onOpenChange(false)
        await queryClient.invalidateQueries({
          queryKey: [QueryKey.INSTRUCTOR_LIVE_SESSIONS],
        })
      },
      onError: (error: any) => {
        toast.error(error.message)
      },
    })
  }

  if (isPending) {
    return <ModalLoading />
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tạo phiên live</DialogTitle>
            <DialogDescription className="text-gray-600">
              Điền thông tin để tạo phiên live mới của bạn. Bạn có thể chỉnh sửa
              sau.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề phiên Live *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tiêu đề phiên Live" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Nhập mô tả ngắn cho phiên Live..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian bắt đầu *</FormLabel>
                    <FormControl>
                      <Input {...field} type="datetime-local" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => onOpenChange(false)}
                >
                  Hủy bỏ
                </Button>
                <Button type="submit" variant="default">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" /> Đang tạo...
                    </>
                  ) : (
                    'Tạo phiên Live'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DialogLiveStreamCreate
