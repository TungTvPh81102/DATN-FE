'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { CouponPayload, couponSchema } from '@/validations/coupon'
import QueryKey from '@/constants/query-key'
import { generateRandomCode } from '@/lib/common'
import {
  useGetCoupon,
  useUpdateCoupon,
} from '@/hooks/instructor/coupon/useCoupon'
import { useGetCourses } from '@/hooks/instructor/course/useCourse'
import { useGetLearners } from '@/hooks/learner/useLearner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import ModalLoading from '@/components/common/ModalLoading'
import { DataTable } from '@/components/shared/data-table'
import Container from '@/components/shared/container'

const CouponUpdateView = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])

  const { data: learnerData, isLoading } = useGetLearners()
  const { data: courseData, isLoading: isLoadingCourseData } = useGetCourses()
  const { data: couponDetails, isLoading: isCouponLoading } = useGetCoupon(id)
  const { mutate: updateCoupon, isPending } = useUpdateCoupon()

  const form = useForm<CouponPayload>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      name: '',
      discount_type: 'fixed',
      discount_value: 0,
      discount_max_value: undefined,
      start_date: undefined,
      expire_date: undefined,
      description: '',
      max_usage: 1,
    },
    values: couponDetails?.data,
  })

  useEffect(() => {
    if (couponDetails && couponDetails.data) {
      const { coupon_uses, coupon_courses, ...couponValues } =
        couponDetails.data

      form.reset({
        ...couponValues,
        discount_value: parseFloat(couponValues.discount_value),
        discount_max_value:
          couponValues.discount_max_value != null
            ? parseFloat(couponValues.discount_max_value)
            : undefined,
        max_usage: couponValues.max_usage || undefined,
        status: couponValues.status ? couponValues.status.toString() : '0',
      })

      if (couponValues.discount_type === 'fixed') {
        form.setValue('discount_max_value', undefined)
      }
      setSelectedRows(coupon_uses.map((use: any) => use.user.id))
      setSelectedCourses(coupon_courses.map((course: any) => course.id))
    }
  }, [couponDetails, form])

  useEffect(() => {
    const discountType = form.watch('discount_type')

    if (discountType === 'percentage') {
      const currentDiscountValue = form.getValues('discount_value') || 0
      const currentDiscountMaxValue =
        form.getValues('discount_max_value') || undefined

      form.setValue('discount_value', currentDiscountValue)
      form.setValue('discount_max_value', currentDiscountMaxValue)
    }

    if (discountType === 'fixed') {
      const currentDiscountValue = form.getValues('discount_value') || 0

      form.setValue('discount_value', currentDiscountValue)
      form.setValue('discount_max_value', undefined)
    }
  }, [form])

  const filteredData = learnerData?.filter((learner: any) => {
    const searchFields = ['name']
    return searchFields.some((field) =>
      learner[field]?.toLowerCase()?.includes(searchTerm.toLowerCase())
    )
  })

  const filteredDataCourse = courseData?.filter((course: any) => {
    const searchFields = ['name', 'slug', 'description']
    return searchFields.some((field) =>
      course[field]?.toLowerCase()?.includes(searchTerm.toLowerCase())
    )
  })

  const columns = [
    {
      id: 'select',
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(checked) => {
            if (checked) {
              const allRowIds = table
                .getRowModel()
                .rows.map((row: any) => row.original.id)
              setSelectedRows(allRowIds)
            } else {
              setSelectedRows([])
            }
            table.toggleAllPageRowsSelected(checked)
          }}
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={selectedRows.includes(row.original.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedRows((prev) => [...prev, row.original.id])
            } else {
              setSelectedRows((prev) =>
                prev.filter((id) => id !== row.original.id)
              )
            }
            row.toggleSelected(checked)
          }}
        />
      ),
    },
    { accessorKey: 'name', header: 'Tên học viên' },
    { accessorKey: 'email', header: 'Email' },
  ]
  const courseColumns = [
    {
      id: 'select',
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(checked) => {
            if (checked) {
              const allRows = table
                .getRowModel()
                .rows.map((row: any) => row.original.id)
              setSelectedCourses(allRows)
            } else {
              setSelectedCourses([])
            }
            table.toggleAllPageRowsSelected(checked)
          }}
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={selectedCourses.includes(row.original.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedCourses((prev) => [...prev, row.original.id])
            } else {
              setSelectedCourses((prev) =>
                prev.filter((id) => id !== row.original.id)
              )
            }
            row.toggleSelected(checked)
          }}
        />
      ),
    },
    { accessorKey: 'name', header: 'Tên khoá học' },
  ]

  const onSubmit = (data: CouponPayload) => {
    const payload = {
      ...data,
      specific_course: selectedCourses?.length > 0 ? 1 : 0,
      user_ids: selectedRows,
      course_ids: selectedCourses,
    }

    updateCoupon(
      {
        id: id,
        data: payload,
      },
      {
        onSuccess: async (res: any) => {
          toast.success(res.message)
          await queryClient.invalidateQueries({
            queryKey: [QueryKey.INSTRUCTOR_COUPON],
          })
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      }
    )
  }

  if (isCouponLoading) return <ModalLoading />

  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Cập nhật mã giảm giá
        </h1>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-2">
        <div className="col-span-8 rounded-lg border p-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Thông tin mã giảm giá
            </h2>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Áp dụng cho khoá học
            </Button>
          </div>
          <div className="mt-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Label>Mã giảm giá</Label>
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="Nhập mã giảm giá"
                                {...field}
                                className="pr-20"
                              />
                            </FormControl>
                            <Badge
                              className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                              onClick={() => {
                                const randomCode = generateRandomCode(10)
                                form.setValue('code', randomCode)
                              }}
                            >
                              Tạo mã mới
                            </Badge>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Label>Tên mã</Label>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <Input
                              placeholder="Nhập tên mã giảm giá"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {form.watch('discount_type') === 'percentage' ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Loại mã</Label>
                      <FormField
                        control={form.control}
                        name="discount_type"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormControl>
                              <Select
                                key={field.value}
                                value={field.value}
                                onValueChange={(value) => field.onChange(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn loại giảm giá" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">
                                    Phần trăm
                                  </SelectItem>
                                  <SelectItem value="fixed">Cố định</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <Label>Số phần trăm</Label>
                      <FormField
                        control={form.control}
                        name="discount_value"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Nhập giá trị giảm giá"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <Label>Giá trị giảm tối đa</Label>
                      <FormField
                        control={form.control}
                        name="discount_max_value"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Nhập giá trị giảm tối đa"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Loại mã</Label>
                      <FormField
                        control={form.control}
                        name="discount_type"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormControl>
                              <Select
                                key={field.value}
                                value={field.value}
                                onValueChange={(value) => field.onChange(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn loại giảm giá" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">
                                    Phần trăm
                                  </SelectItem>
                                  <SelectItem value="fixed">Cố định</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <Label>Số tiền giảm</Label>
                      <FormField
                        control={form.control}
                        name="discount_value"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Nhập giá trị giảm giá"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ngày bắt đầu</Label>
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem className="mt-2">
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
                  <div>
                    <Label>Ngày hết hạn</Label>
                    <FormField
                      control={form.control}
                      name="expire_date"
                      render={({ field }) => (
                        <FormItem className="mt-2">
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
                </div>
                <div>
                  <Label>Số lần sử dụng tối đa</Label>
                  <FormField
                    control={form.control}
                    name="max_usage"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập số lần sử dụng tối đa (nếu cần thiết)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Label>Mô tả</Label>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormControl>
                          <Textarea
                            placeholder="Thêm mô tả mã giảm giá (nếu cần)"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Label>Trạng thái</Label>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormControl>
                          <Select
                            key={field.value}
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Hoạt động</SelectItem>
                              <SelectItem value="0">Không hoạt động</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button disabled={isPending} type="submit">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" /> Đang
                        cập nhật...
                      </>
                    ) : (
                      'Cập nhật'
                    )}
                  </Button>
                  <Link href="/instructor/coupon">
                    <Button
                      disabled={isPending}
                      variant="outline"
                      type="button"
                    >
                      Quay lại
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="col-span-4 rounded-lg border p-4">
          <h2 className="text-xl font-bold text-gray-900">
            Danh sách học viên
          </h2>
          <div className="mt-4">
            <DataTable
              showPageSize={false}
              showPageIndex={false}
              data={filteredData || []}
              columns={columns}
              onSearchChange={setSearchTerm}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>Chọn khoá học áp dụng mã</DialogTitle>
          <DataTable
            data={filteredDataCourse || []}
            columns={courseColumns}
            showPageSize={false}
            showPageIndex={false}
            isLoading={isLoadingCourseData}
            onSearchChange={setSearchTerm}
          />
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Huỷ bỏ
            </Button>
            <Button
              onClick={() => {
                setDialogOpen(false)
              }}
            >
              Áp dụng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default CouponUpdateView
