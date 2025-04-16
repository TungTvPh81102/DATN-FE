'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Camera,
  CheckCircle,
  Loader2,
  Plus,
  RefreshCw,
  Trash,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { questions } from '@/constants/common'
import { useInstructorRegister } from '@/hooks/instructor/instructor-register/useInstructorRegister'
import { useGetQaSystems } from '@/hooks/qa-system/useQaSystem'
import { cn } from '@/lib/utils'
import {
  RegisterInstructorPayload,
  registerInstructorSchema,
} from '@/validations/instructor'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import ModalLoading from '@/components/common/ModalLoading'
import { Card, CardContent } from '@/components/ui/card'
import { useGetProfile } from '@/hooks/profile/useProfile'
import echo from '@/lib/echo'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Webcam from 'react-webcam'
import Swal from 'sweetalert2'

import 'swiper/css'
import 'swiper/css/autoplay'

const BecomeAnInstructor = () => {
  const { user, role, setRole } = useAuthStore()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [isWaitingForRealtime, setIsWaitingForRealtime] = useState(false)

  const webcamRef = useRef<Webcam | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const { data: qaSystems, isLoading } = useGetQaSystems()
  const { data: profileData, isLoading: isLoadingProfileData } = useGetProfile()

  const { mutate: registerInstructor, isPending } = useInstructorRegister()

  const totalSteps = qaSystems?.data?.length ? qaSystems.data.length + 2 : 3

  const form = useForm<RegisterInstructorPayload>({
    resolver: zodResolver(registerInstructorSchema),
    mode: 'onTouched',
    defaultValues: {
      qa_systems: questions.map((question) => ({
        question: question.question,
        options: question.options,
        selected_options: [],
      })),
      certificates: [{ file: undefined }],
      identity_verification: undefined,
      confirmation: undefined,
    },
    disabled: isPending,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'certificates',
  })

  useEffect(() => {
    if (!user) return

    const privateChannel = echo.private(`App.Models.User.${user?.id}`)
    privateChannel.listen('InstructorApproved', (data: any) => {
      console.log(data)
      const { new_role } = data
      setRole(new_role)

      if (isWaitingForRealtime) {
        Swal.fire({
          title: 'Chúc mừng!',
          html: '<div class="text-center"><p>Bạn đã chính thức trở thành giảng viên của CourseMeLy.</p><p>Hãy bắt đầu hành trình chia sẻ kiến thức và xây dựng khóa học đầu tiên của bạn!</p></div>',
          icon: 'success',
          confirmButtonText: 'Bắt đầu ngay',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/instructor')
          }
        })

        setIsWaitingForRealtime(false)
      }
    })

    return () => {
      echo.leave(`App.Models.User.${user.id}`)
    }
  }, [isWaitingForRealtime, router, setRole, user])

  const showReviewingModal = () => {
    const timerInterval: NodeJS.Timeout | undefined = undefined

    Swal.fire({
      title: 'Đang xử lý hồ sơ của bạn',
      html: '<div class="text-center"><p>Hệ thống đang tự động đánh giá thông tin của bạn.</p><p>Quá trình này chỉ mất vài giây...</p></div>',
      icon: 'info',
      timer: 8000,
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        if (timerInterval) clearInterval(timerInterval)
      },
    })
  }

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      setCapturedImage(imageSrc)

      if (imageSrc) {
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'identity-verification.jpg', {
              type: 'image/jpeg',
            })
            form.setValue('identity_verification', file)
          })
      }
    }
  }, [webcamRef, form])

  useEffect(() => {
    if (step === totalSteps) {
      setIsCameraActive(true)
    } else {
      setIsCameraActive(false)
    }
  }, [step, totalSteps])

  const onSubmit = (values: RegisterInstructorPayload) => {
    showReviewingModal()
    setIsWaitingForRealtime(true)
    registerInstructor(values, {
      onError: () => {
        Swal.fire({
          title: 'Hồ sơ đang được xem xét',
          html: '<div class="text-center"><p>Cảm ơn bạn đã đăng ký làm giảng viên tại CourseMeLy!</p><p>Đội ngũ của chúng tôi đang xem xét hồ sơ của bạn. Bạn sẽ nhận được thông báo ngay khi quá trình xét duyệt hoàn tất.</p></div>',
          icon: 'info',
          confirmButtonText: 'Đã hiểu',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/')
          }
        })
        setIsWaitingForRealtime(false)
      },
    })
  }

  useEffect(() => {
    const profile = profileData?.data?.user?.profile

    if (!isLoading && (!profile?.phone || !profile?.address)) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Bạn vui lòng hoàn thiện đầy đủ thông tin cá nhân trước khi đăng ký.',
        icon: 'warning',
        confirmButtonText: 'Đồng ý',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/me')
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, isLoading])

  if (isLoading || isLoadingProfileData) return <ModalLoading />

  if (role === 'instructor') {
    router.push('/instructor')
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn('fixed left-0 top-0 z-50 w-full bg-white')}>
          <div className="container mx-auto px-8">
            <div className="flex h-20 w-full items-center space-x-6">
              <Link href="/">
                <Image
                  src="/images/logo/logo.svg"
                  width={200}
                  height={200}
                  alt=""
                />
              </Link>

              <div className="flex h-full flex-1 items-center border-l border-gray-200 px-6 text-lg">
                Bước {step}/{totalSteps}
              </div>

              <Link
                href="/"
                className="rounded-lg px-4 py-2 font-semibold text-orange-500 hover:bg-orange-50"
              >
                Thoát
              </Link>
            </div>
          </div>

          <Progress
            value={(step / totalSteps) * 100}
            className="h-1 bg-gray-300"
          />
        </div>

        <div className="container mx-auto my-20 p-8 pb-16">
          <h1 className="text-3xl font-semibold">Chia sẻ kiến thức của bạn</h1>

          <p className="mb-8 mt-4 max-w-3xl text-muted-foreground">
            Các khóa học trên CourseMely đều mang lại trải nghiệm học tập bằng
            cách xem video. Điều này giúp học viên có cơ hội học kỹ năng dễ thực
            hành. Dù bạn đã có kinh nghiệm giảng dạy hay đây là lần đầu tiên bạn
            giảng dạy, thì chúng tôi sẽ giúp bạn đưa kiến thức của mình vào khóa
            học online để cải thiện cuộc sống của học viên.
          </p>

          {qaSystems?.data.map((question: any, questionIndex: number) => (
            <div
              className={cn(
                'max-w-3xl',
                step !== questionIndex + 1 && 'hidden'
              )}
              key={question.id}
            >
              {question.answer_type === 'single' ? (
                <FormField
                  control={form.control}
                  name={`qa_systems.${questionIndex}.selected_options`}
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-lg font-semibold">
                        {question.title}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="flex flex-col gap-4"
                          onValueChange={(value) => {
                            field.onChange([parseInt(value)])
                            field.onBlur()
                          }}
                          defaultValue={field.value[0]?.toString()}
                        >
                          {JSON.parse(question.options).map(
                            (option: string, optionIndex: number) => (
                              <FormItem key={optionIndex}>
                                <FormLabel className="flex cursor-pointer items-center space-x-4 rounded border p-4 font-normal">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={optionIndex.toString()}
                                    />
                                  </FormControl>
                                  <span>{option}</span>
                                </FormLabel>
                              </FormItem>
                            )
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name={`qa_systems.${questionIndex}.selected_options`}
                  render={() => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-lg font-semibold">
                        {question.title}
                      </FormLabel>
                      {JSON.parse(question.options).map(
                        (option: string, optionIndex: number) => (
                          <FormField
                            key={`${question.id}-${optionIndex}`}
                            control={form.control}
                            name={`qa_systems.${questionIndex}.selected_options`}
                            render={({ field }) => {
                              return (
                                <FormItem key={`${question.id}-${optionIndex}`}>
                                  <FormLabel className="flex cursor-pointer items-center space-x-4 rounded border p-4 font-normal">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value.includes(
                                          optionIndex
                                        )}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange([
                                              ...field.value,
                                              optionIndex,
                                            ])
                                          } else {
                                            field.onChange(
                                              field.value?.filter(
                                                (value) => value !== optionIndex
                                              )
                                            )
                                          }
                                          field.onBlur()
                                        }}
                                      />
                                    </FormControl>
                                    <span>{option}</span>
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        )
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          ))}

          <div
            className={cn(
              'max-w-3xl',
              step !== qaSystems?.data.length + 1 && 'hidden'
            )}
          >
            <FormField
              control={form.control}
              name="certificates"
              render={() => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-semibold">
                    Thêm chứng chỉ{' '}
                    <span className="text-sm text-muted-foreground">
                      (* Bắt buộc ít nhất 1 chứng chỉ hoặc bằng cấp)
                    </span>
                  </FormLabel>
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`certificates.${index}.file`}
                      render={({
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        field: { value, onChange, ...fieldProps },
                      }) => (
                        <FormItem>
                          <div className="relative">
                            <FormControl>
                              <Input
                                {...fieldProps}
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]

                                  if (!file) {
                                    onChange(undefined)
                                    form.trigger('certificates')
                                    return
                                  }

                                  if (
                                    file.type !== 'application/pdf' &&
                                    !file.type.startsWith('image/')
                                  ) {
                                    toast.error(
                                      'Vui lòng chọn tệp hình ảnh hoặc PDF.'
                                    )

                                    e.target.value = ''
                                    onChange(undefined)

                                    return
                                  }

                                  onChange(file)
                                }}
                                accept="image/*, application/pdf"
                                className="pr-10"
                              />
                            </FormControl>
                            <FormMessage />
                            {index > 0 && (
                              <Button
                                variant="ghost"
                                type="button"
                                size="icon"
                                className="absolute right-0 top-0 text-destructive hover:bg-transparent hover:text-destructive/80"
                                onClick={() => {
                                  remove(index)
                                }}
                                disabled={fieldProps.disabled}
                              >
                                <Trash />
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <Button
                    className="block"
                    type="button"
                    variant="secondary"
                    onClick={() => append({ file: undefined })}
                    disabled={form.formState.disabled || fields.length >= 5}
                  >
                    <Plus />
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={cn('max-w-3xl', step !== totalSteps && 'hidden')}>
            <FormField
              control={form.control}
              name="identity_verification"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-semibold">
                    Xác minh danh tính{' '}
                    <span className="text-sm text-muted-foreground">
                      (* Vui lòng chụp ảnh mặt của bạn để xác minh danh tính)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Card className="overflow-hidden">
                      <CardContent className="p-6">
                        {isCameraActive && !capturedImage ? (
                          <div className="flex flex-col items-center">
                            <Webcam
                              audio={false}
                              ref={webcamRef}
                              screenshotFormat="image/jpeg"
                              videoConstraints={{
                                width: 480,
                                height: 360,
                                facingMode: 'user',
                              }}
                              className="rounded-md"
                            />
                            <Button
                              type="button"
                              className="mt-4"
                              onClick={captureImage}
                            >
                              <Camera className="mr-2 size-4" />
                              Chụp ảnh
                            </Button>
                          </div>
                        ) : capturedImage ? (
                          <div className="flex flex-col items-center">
                            <div className="relative">
                              <Image
                                src={capturedImage}
                                alt="Ảnh đã chụp"
                                width={480}
                                height={360}
                                className="h-auto w-full max-w-md rounded-md"
                                unoptimized
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                className="mt-4"
                                onClick={() => {
                                  setCapturedImage(null)
                                  field.onChange(null)
                                  setIsCameraActive(false)
                                }}
                              >
                                <RefreshCw className="mr-2 size-4" />
                                Chụp lại
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <p className="mb-4 text-center text-muted-foreground">
                              Nhấn vào nút bên dưới để bật camera và chụp ảnh
                              xác minh
                            </p>
                            <Button
                              type="button"
                              onClick={() => setIsCameraActive(true)}
                            >
                              <Camera className="mr-2 size-4" />
                              Bật camera
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </FormControl>
                  <div className="rounded-md border p-4 text-sm">
                    <p className="font-medium">Hướng dẫn chụp ảnh xác minh:</p>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Đảm bảo ánh sáng đủ rõ và không bị chói.</li>
                      <li>
                        Giữ khuôn mặt chính diện, không nghiêng hoặc che khuất.
                      </li>
                      <li>Không đội mũ hoặc đeo kính nếu không cần thiết.</li>
                      <li>
                        Chụp trong không gian yên tĩnh, tránh nền quá lộn xộn.
                      </li>
                      <li>Đảm bảo ảnh rõ nét, không bị mờ hoặc nhòe.</li>
                    </ul>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <div className="rounded-md border">
                    <div className="p-5">
                      <div className="flex items-start space-x-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value === true}
                            onCheckedChange={field.onChange}
                            className="mt-1 size-5"
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="flex items-center text-base font-semibold">
                            <CheckCircle className="mr-2 size-5" />
                            Cam kết thông tin
                          </FormLabel>
                          <p className="mt-2 text-sm leading-relaxed text-gray-700">
                            Tôi cam đoan rằng tất cả thông tin đã cung cấp là
                            đúng sự thật và chính xác. Tôi hiểu rằng việc cung
                            cấp thông tin sai lệch có thể dẫn đến việc từ chối
                            đơn đăng ký hoặc hủy bỏ tư cách giảng viên của tôi.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <FormMessage className="mt-2 text-sm" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 z-50 w-full bg-white"
          style={{
            boxShadow:
              '0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
        >
          <div className="container mx-auto px-8">
            <div className="flex h-20 w-full items-center justify-between">
              {step > 1 && (
                <Button
                  disabled={isPending}
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Quay lại
                </Button>
              )}

              {step < totalSteps - 1 && (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    form.getValues('qa_systems')[step - 1].selected_options
                      .length === 0
                  }
                >
                  Tiếp tục
                </Button>
              )}

              {step === totalSteps - 1 && (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    !form
                      .getValues('certificates')
                      .some((certificate) => certificate?.file)
                  }
                >
                  Tiếp tục
                </Button>
              )}

              {step === totalSteps && (
                <Button
                  type="submit"
                  disabled={
                    form.formState.disabled ||
                    !form.getValues('identity_verification') ||
                    !form
                      .getValues('certificates')
                      .some((certificate) => certificate?.file) ||
                    !form.getValues('confirmation')
                  }
                >
                  {isPending && <Loader2 className="animate-spin" />}
                  Gửi hồ sơ
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default BecomeAnInstructor
