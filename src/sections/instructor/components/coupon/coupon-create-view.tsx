'use client'

import React, { useState, useEffect } from 'react'
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
import { useCreateCoupon } from '@/hooks/instructor/coupon/useCoupon'
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

const CouponCreateView = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [searchLearnerTerm, setSearchLearnerTerm] = useState('')
  const [searchCourseTerm, setSearchCourseTerm] = useState('')
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState('details')

  const { data: learnerData, isLoading } = useGetLearners()
  const { data: courseData, isLoading: isLoadingCourseData } =
    useGetCoursesWithPrice()
  const { mutate: createCoupon, isPending } = useCreateCoupon()

  const [filteredLearnerData, setFilteredLearnerData] = useState<any[]>([])
  const [filteredCourseData, setFilteredCourseData] = useState<any[]>([])

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

  const handleToggleAllLearners = (checked: boolean) => {
    if (checked) {
      const allLearnerIds = learnerData?.map((learner: any) => learner.id) || []
      setSelectedRows(allLearnerIds)
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

  const areAllLearnersSelected =
    Array.isArray(learnerData) &&
    learnerData.length > 0 &&
    selectedRows.length === learnerData.length
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
      cell: ({ row }: any) => (
        <Checkbox
          checked={isLearnerSelected(row.original.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedRows((prev) => [...prev, row.original.id])
            } else {
              setSelectedRows((prev) =>
                prev.filter((id) => id !== row.original.id)
              )
            }
          }}
        />
      ),
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
              src={row.original.thumbnail}
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
        const category = row.original.category.name || 'Không có'
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

    createCoupon(
      {
        ...data,
        specific_course: selectedCourses?.length > 0 ? 1 : 0,
        user_ids: selectedRows,
        course_ids: selectedCourses,
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
            Tạo mã giảm giá mới
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
                <Gift className="mr-2 size-4" /> Tạo mã giảm giá
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="4 w-full">
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
                                Tạo mã
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
                              defaultValue={field.value}
                              onValueChange={(value) => {
                                field.onChange(value)
                                form.setValue('discount_value', 0)
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
                                defaultValue={field.value}
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
                    Chọn các học viên sẽ được áp dụng mã giảm giá này
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                          <Gift className="mr-2 size-4" /> Tạo mã giảm giá
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

export default CouponCreateView
