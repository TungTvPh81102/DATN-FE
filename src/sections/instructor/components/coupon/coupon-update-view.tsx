'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Book, Gift, Loader2, Tag, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { CouponPayload, couponSchema } from '@/validations/coupon'
import QueryKey from '@/constants/query-key'
import { generateRandomCode } from '@/lib/common'
import {
  useGetCoupon,
  useUpdateCoupon,
} from '@/hooks/instructor/coupon/useCoupon'
import { useGetCoursesWithPrice } from '@/hooks/instructor/course/useCourse'
import { useGetLearners } from '@/hooks/learner/useLearner'

import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DataTable } from '@/components/shared/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import ModalLoading from '@/components/common/ModalLoading'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const CouponUpdateView = ({ id }: { id: string }) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [searchLearnerTerm, setSearchLearnerTerm] = useState('')
  const [searchCourseTerm, setSearchCourseTerm] = useState('')
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState('details')
  const [learnerUsageStatus, setLearnerUsageStatus] = useState<
    Record<
      number,
      {
        status: string
        applied_at?: string
        expired_at?: string
      }
    >
  >({})

  const { data: learnerData, isLoading } = useGetLearners()
  const { data: courseData, isLoading: isLoadingCourseData } =
    useGetCoursesWithPrice()
  const { data: couponDetails, isLoading: isCouponLoading } = useGetCoupon(id)
  const { mutate: updateCoupon, isPending } = useUpdateCoupon()

  const [filteredLearnerData, setFilteredLearnerData] = useState<any[]>([])
  const [filteredCourseData, setFilteredCourseData] = useState<any[]>([])

  const form = useForm<CouponPayload>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      name: '',
      discount_type: 'fixed',
      discount_value: 0,
      discount_max_value: undefined,
      start_date: '',
      expire_date: '',
      description: '',
      max_usage: 1,
      status: '1',
    },
  })

  useEffect(() => {
    if (couponDetails?.data) {
      const { coupon_uses, coupon_courses, ...couponValues } =
        couponDetails.data

      form.reset({
        ...couponValues,
        discount_value: parseFloat(couponValues.discount_value),
        discount_max_value:
          couponValues.discount_max_value != null
            ? parseFloat(couponValues.discount_max_value)
            : undefined,
        max_usage: couponValues.max_usage || 1,
        status: couponValues.status.toString(),
        start_date: couponValues.start_date || '',
        expire_date: couponValues.expire_date || '',
        description: couponValues.description || '',
      })

      if (couponValues.discount_type === 'fixed') {
        form.setValue('discount_max_value', undefined)
      }

      if (coupon_uses) {
        const usageStatusMap: Record<
          number,
          { status: string; applied_at?: string; expired_at?: string }
        > = {}

        coupon_uses.forEach((use: any) => {
          const userId = use.user.id
          usageStatusMap[userId] = {
            status: use.status,
            applied_at: use.applied_at,
            expired_at: use.expired_at,
          }
        })

        setLearnerUsageStatus(usageStatusMap)
        setSelectedRows(coupon_uses.map((use: any) => use.user.id))
      }

      if (coupon_courses) {
        setSelectedCourses(coupon_courses.map((course: any) => course.id))
      }
    }
  }, [couponDetails, form])

  useEffect(() => {
    if (learnerData) {
      const filtered = learnerData.filter((learner: any) => {
        const searchFields = ['name', 'email']
        return searchFields.some((field) =>
          learner[field]
            ?.toLowerCase()
            ?.includes(searchLearnerTerm.toLowerCase())
        )
      })
      setFilteredLearnerData(filtered)
    }
  }, [learnerData, searchLearnerTerm])

  useEffect(() => {
    if (courseData) {
      const filtered = courseData.filter((course: any) => {
        const searchFields = ['name', 'slug', 'description']
        return searchFields.some((field) =>
          course[field]?.toLowerCase()?.includes(searchCourseTerm.toLowerCase())
        )
      })
      setFilteredCourseData(filtered)
    }
  }, [courseData, searchCourseTerm])

  const handleToggleAllLearners = (checked: boolean) => {
    if (checked) {
      const selectableIds =
        learnerData
          ?.filter((learner: any) => {
            const usage = learnerUsageStatus[learner.id]
            return !usage || usage.status === 'unused'
          })
          .map((learner: any) => learner.id) || []

      setSelectedRows(selectableIds)
    } else {
      setSelectedRows([])
    }
  }

  const handleToggleAllCourses = (checked: boolean) => {
    if (checked) {
      const allCourseIds = courseData?.map((course: any) => course.id) || []
      setSelectedCourses(allCourseIds)
    } else {
      setSelectedCourses([])
    }
  }

  const isLearnerSelected = (id: number) => selectedRows.includes(id)
  const isCourseSelected = (id: number) => selectedCourses.includes(id)

  const canToggleLearner = (id: number) => {
    const usage = learnerUsageStatus[id]
    return !usage || usage.status === 'unused'
  }

  const getLearnerStatusDisplay = (id: number) => {
    const usage = learnerUsageStatus[id]
    if (!usage) return <Badge variant="secondary">Không được áp dụng</Badge>

    switch (usage.status) {
      case 'used':
        return <Badge variant="success">Đã sử dụng</Badge>
      case 'expired':
        return <Badge variant="destructive">Đã hết hạn</Badge>
      case 'unused':
        return <Badge variant="info">Chưa sử dụng</Badge>
      default:
        return <Badge variant="secondary">Không được áp dụng</Badge>
    }
  }

  const getStatusTooltip = (id: number) => {
    const usage = learnerUsageStatus[id]
    if (!usage) return 'Học viên chưa được gắn mã'

    switch (usage.status) {
      case 'used':
        return `Đã sử dụng vào: ${new Date(usage.applied_at || '').toLocaleDateString('vi-VN')}`
      case 'expired':
        return `Đã hết hạn vào: ${new Date(usage.expired_at || '').toLocaleDateString('vi-VN')}`
      case 'unused':
        return 'Chưa sử dụng'
      default:
        return 'Học viên chưa được gắn mã'
    }
  }

  const selectableLearners =
    learnerData?.filter((learner: any) => canToggleLearner(learner.id)) || []
  const areAllLearnersSelected =
    selectableLearners.length > 0 &&
    selectableLearners.every((learner: any) => isLearnerSelected(learner.id))
  const areAllCoursesSelected =
    Array.isArray(courseData) &&
    courseData.length > 0 &&
    selectedCourses.length === courseData.length

  const learnerColumns = [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={areAllLearnersSelected}
          onCheckedChange={handleToggleAllLearners}
        />
      ),
      cell: ({ row }: any) => {
        const isDisabled = !canToggleLearner(row.original.id)
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Checkbox
                    checked={isLearnerSelected(row.original.id)}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => {
                      if (!isDisabled) {
                        if (checked) {
                          setSelectedRows((prev) => [...prev, row.original.id])
                        } else {
                          setSelectedRows((prev) =>
                            prev.filter((id) => id !== row.original.id)
                          )
                        }
                      }
                    }}
                  />
                </div>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>Không thể xóa học viên đã sử dụng hoặc hết hạn mã</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: 'name',
      header: 'Tên học viên',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage
              src={row.original.avatar || ''}
              alt={row.original.name}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {row.original.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span>{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: ({ row }: any) => {
        const status = getLearnerStatusDisplay(row.original.id)
        const tooltipText = getStatusTooltip(row.original.id)

        if (!status) return null

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>{status}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
  ]

  const courseColumns = [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={areAllCoursesSelected}
          onCheckedChange={handleToggleAllCourses}
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={isCourseSelected(row.original.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedCourses((prev) => [...prev, row.original.id])
            } else {
              setSelectedCourses((prev) =>
                prev.filter((id) => id !== row.original.id)
              )
            }
          }}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Khóa học',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <div className="relative h-12 w-20 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={row.original.thumbnail || '/placeholder.jpg'}
              alt={row.original.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="line-clamp-2">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Danh mục',
      cell: ({ row }: any) => {
        const category = row.original.category?.name || 'Không có'
        return (
          <Badge variant="outline" className="text-sm">
            {category}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'price',
      header: 'Giá gốc',
      cell: ({ row }: any) => {
        const price = parseFloat(row.original.price || 0)
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(price)
      },
    },
    {
      accessorKey: 'price_sale',
      header: 'Giá khuyến mãi',
      cell: ({ row }: any) => {
        const priceSale = parseFloat(row.original.price_sale || 0)
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(priceSale)
      },
    },
  ]

  const onSubmit = (data: CouponPayload) => {
    if (selectedCourses.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một khóa học để áp dụng mã giảm giá')
      setActiveTab('courses')
      return
    }

    if (selectedRows.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một học viên để áp dụng mã giảm giá')
      setActiveTab('learners')
      return
    }

    const existingUsers = Object.entries(learnerUsageStatus)
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, status]) => status.status === 'used' || status.status === 'expired'
      )
      .map(([userId]) => parseInt(userId))

    const finalUserIds = Array.from(
      new Set([...selectedRows, ...existingUsers])
    )

    updateCoupon(
      {
        id: id,
        data: {
          ...data,
          specific_course: selectedCourses?.length > 0 ? 1 : 0,
          user_ids: finalUserIds,
          course_ids: selectedCourses,
        },
      },
      {
        onSuccess: async (res: any) => {
          toast.success(res.message)
          await queryClient.invalidateQueries({
            queryKey: [QueryKey.INSTRUCTOR_COUPON],
          })
          router.push('/instructor/coupon')
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      }
    )
  }

  if (isCouponLoading) return <ModalLoading />

  return (
    <div className="px-5 py-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/instructor/coupon">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Cập nhật mã giảm giá
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/instructor/coupon')}
          >
            Hủy
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Đang xử lý...
              </>
            ) : (
              <>
                <Gift className="mr-2 size-4" /> Cập nhật mã giảm giá
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3 shadow-sm">
          <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent p-1">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Tag className="mr-2 size-4" /> Thông tin mã giảm giá
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Book className="mr-2 size-4" /> Chọn khóa học (
              {selectedCourses.length})
            </TabsTrigger>
            <TabsTrigger
              value="learners"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Users className="mr-2 size-4" /> Chọn học viên (
              {selectedRows.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <Form {...form}>
          <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>
                    Thiết lập thông tin chi tiết về mã giảm giá
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mã giảm giá</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  placeholder="Nhập mã giảm giá"
                                  {...field}
                                  className="pr-24"
                                />
                              </FormControl>
                              <Badge
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                onClick={() => {
                                  const randomCode = generateRandomCode(10)
                                  form.setValue('code', randomCode)
                                }}
                              >
                                Đổi mã
                              </Badge>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên mã giảm giá</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="VD: Ưu đãi đặc biệt tháng 4"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discount_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loại giảm giá</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value)
                                if (value === 'fixed') {
                                  form.setValue('discount_max_value', undefined)
                                }
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn loại giảm giá" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fixed">
                                  Giảm số tiền cố định
                                </SelectItem>
                                <SelectItem value="percentage">
                                  Giảm theo phần trăm
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch('discount_type') === 'fixed' ? (
                        <FormField
                          control={form.control}
                          name="discount_value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số tiền giảm (VND)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="VD: 100000"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-xs text-gray-500">
                                Số tiền giảm phải từ 10,000 VND đến 1,000,000
                                VND
                              </p>
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="discount_value"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phần trăm giảm (%)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="VD: 25"
                                    {...field}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                                <p className="text-xs text-gray-500">
                                  Từ 10% đến 100%
                                </p>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="discount_max_value"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Giảm tối đa (VND)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="VD: 500000"
                                    {...field}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày bắt đầu</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  value={field.value ?? ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="expire_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày hết hạn</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  value={field.value ?? ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="max_usage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số lần sử dụng tối đa</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="VD: 1"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trạng thái</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">
                                    <div className="flex items-center">
                                      <div className="mr-2 size-2 rounded-full bg-green-500"></div>
                                      Hoạt động
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="0">
                                    <div className="flex items-center">
                                      <div className="mr-2 size-2 rounded-full bg-red-500"></div>
                                      Không hoạt động
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Thêm mô tả về mã giảm giá này..."
                                {...field}
                                value={field.value || ''}
                                className="resize-none"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('courses')}
                    >
                      <Book className="mr-2 size-4" /> Tiếp: Chọn khóa học
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Book className="size-5" />
                      Chọn khóa học
                    </div>
                    <Badge variant="outline" className="text-sm font-normal">
                      Đã chọn: {selectedCourses.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Chọn các khóa học sẽ áp dụng mã giảm giá này
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={filteredCourseData || []}
                    columns={courseColumns}
                    showPageSize={false}
                    showPageIndex={false}
                    isLoading={isLoadingCourseData}
                    onSearchChange={setSearchCourseTerm}
                  />

                  {selectedCourses.length === 0 && (
                    <div className="mt-2 text-sm text-amber-600">
                      Vui lòng chọn ít nhất một khóa học để áp dụng mã giảm giá
                    </div>
                  )}

                  <div className="mt-6 flex justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('details')}
                    >
                      <ArrowLeft className="mr-2 size-4" /> Quay lại
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab('learners')}
                    >
                      <Users className="mr-2 size-4" /> Tiếp: Chọn học viên
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="learners">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="size-5" />
                      Chọn học viên
                    </div>
                    <Badge variant="outline" className="text-sm font-normal">
                      Đã chọn: {selectedRows.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Chọn các học viên sẽ được áp dụng mã giảm giá này. Học viên
                    đã sử dụng mã hoặc mã đã hết hạn sẽ không thể bỏ chọn.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info">Chưa sử dụng</Badge>
                      <Badge variant="success">Đã sử dụng</Badge>
                      <Badge variant="destructive">Đã hết hạn</Badge>
                      <Badge variant="secondary">Chưa gắn mã</Badge>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Trạng thái là: &#34;Đã sử dụng&#34; hoặc &#34;Đã hết
                      hạn&#34; không thể bỏ chọn.
                    </p>
                  </div>

                  <DataTable
                    data={filteredLearnerData || []}
                    columns={learnerColumns}
                    showPageSize={false}
                    showPageIndex={false}
                    onSearchChange={setSearchLearnerTerm}
                    isLoading={isLoading}
                  />

                  {selectedRows.length === 0 && (
                    <div className="mt-2 text-sm text-amber-600">
                      Vui lòng chọn ít nhất một học viên để áp dụng mã giảm giá
                    </div>
                  )}

                  <div className="mt-6 flex justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('courses')}
                    >
                      <ArrowLeft className="mr-2 size-4" /> Quay lại
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" /> Đang
                          xử lý...
                        </>
                      ) : (
                        <>
                          <Gift className="mr-2 size-4" /> Cập nhật mã giảm giá
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}

export default CouponUpdateView
