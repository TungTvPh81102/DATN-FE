'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  PlusCircle,
  ChevronRight,
  ChevronLeft,
  Upload,
  Check,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify'
import { DateTimePicker } from '@/components/shared/date-time-picker'
import { formatDate } from '@/lib/common'
import { LiveSchedulePayload, liveScheduleSchema } from '@/validations/live'
import { useCreateLiveSchedule } from '@/hooks/live/useLive'
import { useQueryClient } from '@tanstack/react-query'
import QueryKey from '@/constants/query-key'
import { useRouter } from 'next/navigation'
import { LoadingButton } from '@/components/ui/loading-button'

const DialogScheduleLivestream = () => {
  const router = useRouter()

  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const { mutate: createLiveSchedule, isPending: isPendingCreateLiveSchedule } =
    useCreateLiveSchedule()

  const form = useForm<LiveSchedulePayload>({
    resolver: zodResolver(liveScheduleSchema),
    defaultValues: {
      title: '',
      description: '',
      visibility: 'public',
      thumbnail: null,
      starts_at: undefined,
    },
  })

  const isValidStartTime = (date: Date | undefined): boolean => {
    if (!date) return false
    const now = new Date()
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000) // Thêm 1 giờ
    return date >= oneHourFromNow
  }

  const nextStep = async (e: any) => {
    if (e) e.preventDefault()
    if (step === 1) {
      await form.trigger(['title'])
      if (!form.formState.errors.title) {
        setStep(2)
      }
    } else if (step === 2) {
      await form.trigger('starts_at')
      if (!form.formState.errors.starts_at) {
        setStep(3)
      }
    } else if (step === 3) {
      await form.trigger('visibility')
      if (!form.formState.errors.visibility) {
        setStep(4)
      }
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canGoNext = () => {
    if (step === 1) {
      const title = form.getValues('title')
      return !!title
    } else if (step === 2) {
      const startsAt = form.getValues('starts_at')
      return !!startsAt
    } else if (step === 3) {
      const visibility = form.getValues('visibility')
      return !!visibility
    }
    return false
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Hình ảnh không được vượt quá 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
        form.setValue('thumbnail', file)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: LiveSchedulePayload) => {
    if (!isValidStartTime(data.starts_at)) {
      form.setError('starts_at', {
        type: 'manual',
        message: 'Thời gian sự kiện phải cách thời gian hiện tại 1h',
      })
      setStep(2)
      return
    }

    createLiveSchedule(data, {
      onSuccess: async (res: any) => {
        setOpen(false)
        setStep(1)
        form.reset()
        setThumbnailPreview(null)
        await queryClient.invalidateQueries({
          queryKey: [QueryKey.LIVE_SCHEDULE],
        })
        router.push(`/live-streaming/${res?.data.code}`)
      },
    })
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusCircle className="mr-1 size-4" />
        <span>Sự kiện</span>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="w-[95%] max-w-3xl overflow-hidden rounded-xl p-0">
          <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
            <AlertDialogHeader className="mb-0">
              <div className="flex items-center justify-between">
                <div>
                  <AlertDialogTitle className="text-xl font-bold md:text-2xl">
                    Tạo sự kiện
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm md:text-base">
                    Điền thông tin để lên lịch sự kiện mới
                  </AlertDialogDescription>
                </div>
                <X
                  size={16}
                  className="cursor-pointer text-muted-foreground hover:text-black"
                  onClick={() => setOpen(false)}
                />
              </div>
            </AlertDialogHeader>

            <div className="mt-4">
              <div className="grid grid-cols-4 gap-1 sm:gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center rounded-full px-2 py-1',
                      step === i ? 'bg-primary/10' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium md:h-8 md:w-8 md:text-sm',
                        step === i
                          ? 'bg-primary text-white shadow-md'
                          : step > i
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      )}
                    >
                      {step > i ? <Check className="size-3 md:size-4" /> : i}
                    </div>
                    <span className="ml-2 truncate text-xs font-medium md:text-sm">
                      {i === 1 && 'Thông tin'}
                      {i === 2 && 'Thời gian'}
                      {i === 3 && 'Hiển thị'}
                      {i === 4 && 'Xác nhận'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 h-1 rounded-full bg-gray-200">
                <div
                  className="h-1 rounded-full bg-primary transition-all"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="h-96 overflow-y-auto p-6">
                {step === 1 && (
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">
                            Tên sự kiện <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập tên của sự kiện livestream"
                              className="rounded-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">
                            Mô tả
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Nhập mô tả chi tiết về sự kiện livestream"
                              className="min-h-32 resize-y rounded-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-medium text-gray-800 md:text-lg">
                      Chọn thời gian cho sự kiện
                    </h3>

                    <FormField
                      control={form.control}
                      name="starts_at"
                      render={({ field }) => (
                        <FormItem className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <div className="space-y-4">
                            <FormLabel className="block text-sm font-medium">
                              Ngày và giờ{' '}
                              <span className="text-red-500">*</span>
                            </FormLabel>

                            <FormControl>
                              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                                <DateTimePicker
                                  value={field.value}
                                  onChange={(date) => {
                                    field.onChange(date)
                                    if (isValidStartTime(date)) {
                                      form.clearErrors('starts_at')
                                    } else {
                                      form.setError('starts_at', {
                                        type: 'manual',
                                        message:
                                          'Thời gian sự kiện phải cách thời gian hiện tại 1h',
                                      })
                                    }
                                  }}
                                />
                              </div>
                            </FormControl>

                            {field.value && (
                              <div className="mt-4 flex items-center rounded-md bg-primary/10 p-3 text-sm">
                                <div
                                  className={cn(
                                    'mr-3 flex size-10 items-center justify-center rounded-full text-white',
                                    isValidStartTime(field.value)
                                      ? 'bg-primary'
                                      : 'bg-orange-500'
                                  )}
                                >
                                  {isValidStartTime(field.value) ? (
                                    <Check className="size-5" />
                                  ) : (
                                    <X className="size-5" />
                                  )}
                                </div>
                                <div>
                                  <p
                                    className={cn(
                                      'font-medium',
                                      isValidStartTime(field.value)
                                        ? 'text-primary'
                                        : 'text-orange-500'
                                    )}
                                  >
                                    {isValidStartTime(field.value)
                                      ? 'Đã chọn thời gian'
                                      : 'Thời gian không hợp lệ'}
                                  </p>
                                  <p className="text-gray-600">
                                    {formatDate(field.value, {
                                      weekday: 'long',
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                  {!isValidStartTime(field.value) && (
                                    <p className="mt-1 text-xs text-orange-600">
                                      Thời gian sự kiện phải cách thời gian hiện
                                      tại 1h
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium">
                            Chế độ hiển thị{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col gap-2"
                            >
                              <div
                                className={cn(
                                  'flex items-center space-x-2 rounded-lg border p-2 transition-all hover:bg-gray-50',
                                  field.value === 'public' &&
                                    'border-primary bg-primary/5'
                                )}
                              >
                                <RadioGroupItem value="public" id="public" />
                                <Label
                                  htmlFor="public"
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="font-medium">Công khai</div>
                                  <div className="text-xs text-gray-500">
                                    Ai cũng có thể tìm thấy và xem phiên
                                    livestream này
                                  </div>
                                </Label>
                              </div>
                              <div
                                className={cn(
                                  'flex items-center space-x-2 rounded-lg border p-2 transition-all hover:bg-gray-50',
                                  field.value === 'private' &&
                                    'border-primary bg-primary/5'
                                )}
                              >
                                <RadioGroupItem value="private" id="private" />
                                <Label
                                  htmlFor="private"
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="font-medium">Riêng tư</div>
                                  <div className="text-xs text-gray-500">
                                    Chỉ học viên mới được phép xem
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Hình thu nhỏ
                      </Label>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <div
                          className={cn(
                            'flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-all hover:bg-gray-50 sm:w-40',
                            thumbnailPreview
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300'
                          )}
                        >
                          <input
                            type="file"
                            id="thumbnail"
                            className="hidden"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                          />
                          <label
                            htmlFor="thumbnail"
                            className="size-full cursor-pointer"
                          >
                            {thumbnailPreview ? (
                              <div className="flex h-full items-center justify-center">
                                <img
                                  src={thumbnailPreview}
                                  alt="Preview"
                                  className="max-h-full max-w-full rounded-lg object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center text-gray-400">
                                <Upload className="mb-1 size-6" />
                                <span className="text-xs font-medium">
                                  Tải lên hình ảnh
                                </span>
                                <span className="text-xs text-gray-400">
                                  Nhấp hoặc kéo thả
                                </span>
                              </div>
                            )}
                          </label>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p className="mb-1 font-medium">Hướng dẫn:</p>
                          <ul className="list-disc space-y-1 pl-4">
                            <li>Kích thước khuyến nghị: 1280 x 720 pixels</li>
                            <li>Tỷ lệ khung hình: 16:9</li>
                            <li>Định dạng: JPG, PNG</li>
                            <li>Dung lượng tối đa: 5MB</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-medium text-gray-800 md:text-lg">
                      Xác nhận thông tin
                    </h3>

                    <div className="overflow-hidden rounded-lg border bg-gray-50">
                      <div className="grid gap-2 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                        <div className="p-3">
                          <h4 className="mb-1 text-sm font-medium text-gray-700">
                            Thông tin cơ bản
                          </h4>
                          <dl className="space-y-1">
                            <div>
                              <dt className="text-xs font-medium text-gray-500">
                                Tên sự kiện
                              </dt>
                              <dd className="mt-1 text-sm">
                                {form.getValues('title')}
                              </dd>
                            </div>
                            {form.getValues('description') && (
                              <div>
                                <dt className="text-xs font-medium text-gray-500">
                                  Mô tả
                                </dt>
                                <dd className="mt-1 line-clamp-3 text-xs">
                                  {form.getValues('description')}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        <div className="p-3">
                          <h4 className="mb-1 text-sm font-medium text-gray-700">
                            Thời gian & Hiển thị
                          </h4>
                          <dl className="space-y-1">
                            <div>
                              <dt className="text-xs font-medium text-gray-500">
                                Thời gian
                              </dt>
                              <dd className="mt-1 text-sm font-medium">
                                {form.getValues('starts_at')
                                  ? format(
                                      form.getValues('starts_at'),
                                      'dd/MM/yyyy HH:mm'
                                    )
                                  : 'Chưa chọn'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-gray-500">
                                Chế độ hiển thị
                              </dt>
                              <dd className="mt-1 text-sm">
                                {form.getValues('visibility') === 'public' && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                    <span className="size-1.5 rounded-full bg-green-500"></span>
                                    Công khai
                                  </span>
                                )}
                                {form.getValues('visibility') ===
                                  'unlisted' && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                    <span className="size-1.5 rounded-full bg-blue-500"></span>
                                    Không liệt kê
                                  </span>
                                )}
                                {form.getValues('visibility') === 'private' && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                                    <span className="size-1.5 rounded-full bg-orange-500"></span>
                                    Riêng tư
                                  </span>
                                )}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="p-3">
                          <h4 className="mb-1 text-sm font-medium text-gray-700">
                            Hình ảnh
                          </h4>
                          {thumbnailPreview ? (
                            <div className="mt-1">
                              <div className="h-20 w-32 overflow-hidden rounded-lg border border-gray-200">
                                <img
                                  src={thumbnailPreview}
                                  alt="Thumbnail"
                                  className="size-full object-cover"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="mt-1 text-xs text-gray-500">
                              Chưa tải lên hình thu nhỏ
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center rounded-lg border border-green-200 bg-green-50 p-3 text-green-800">
                      <Check className="mr-2 size-4 rounded-full bg-green-500 p-0.5 text-white" />
                      <div>
                        <p className="text-sm font-medium">
                          Sẵn sàng để lên lịch
                        </p>
                        <p className="text-xs">
                          Phiên livestream sẽ hiển thị trong danh sách của bạn
                          sau khi được lên lịch
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <AlertDialogFooter className="flex flex-col-reverse gap-2 border-t bg-gray-50 p-4 sm:flex-row sm:justify-between">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex w-full items-center justify-center gap-1 sm:w-auto"
                  >
                    <ChevronLeft className="size-4" />
                    <span>Quay lại</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpen(false)
                      form.reset()
                    }}
                    className="w-full sm:w-auto"
                  >
                    Hủy
                  </Button>
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canGoNext()}
                    className="flex w-full items-center justify-center gap-1 sm:w-auto"
                  >
                    <span>Tiếp tục</span>
                    <ChevronRight className="size-4" />
                  </Button>
                ) : (
                  <LoadingButton
                    loading={isPendingCreateLiveSchedule}
                    type="submit"
                  >
                    <span>Hoàn tất lên lịch</span>
                    <Check className="ml-1 size-4" />
                  </LoadingButton>
                )}
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DialogScheduleLivestream
