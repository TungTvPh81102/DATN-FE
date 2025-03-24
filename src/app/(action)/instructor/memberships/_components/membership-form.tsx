'use client'

import {
  ArrayPath,
  FieldArray,
  Path,
  PathValue,
  useFieldArray,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form'

import { OptionalLabel } from '@/components/shared/optional-label'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input, inputClassName } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '@/components/ui/sortable'
import { Textarea } from '@/components/ui/textarea'
import { useGetApprovedCourses } from '@/hooks/instructor/course/useCourse'
import { useDataTable } from '@/hooks/use-data-table'
import { cn } from '@/lib/utils'
import { GripVertical, PlusCircle, Trash } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import CurrencyInput from 'react-currency-input-field'
import ApprovedCoursesTable from './approved-courses-table'
import { getColumns } from './approved-courses-table-columns'

interface MembershipFormProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<'form'>, 'onSubmit'> {
  children: React.ReactNode
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  courseIds?: number[]
}

export function MembershipForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  courseIds = [],
}: MembershipFormProps<T>) {
  const { data, isLoading } = useGetApprovedCourses()

  const columns = useMemo(() => getColumns(), [])

  const rowSelection = useMemo(
    () =>
      courseIds?.reduce((acc: { [key: number]: boolean }, id: number) => {
        acc[id] = true
        return acc
      }, {}),
    [courseIds]
  )

  const { table } = useDataTable({
    data,
    columns,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      rowSelection,
    },
    getRowId: (originalRow) => originalRow.id?.toString(),
  })

  const rowsSelected = table.getSelectedRowModel().rows

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'benefits' as ArrayPath<T>,
  })

  const errors = form.formState.errors

  useEffect(() => {
    form.setValue(
      'course_ids' as FieldPath<T>,
      rowsSelected.map((row) => +row.id) as PathValue<T, Path<T>>
    )
    if (errors.course_ids) form.trigger('course_ids' as FieldPath<T>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsSelected])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name={'name' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên gói</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên gói" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'description' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <OptionalLabel>Mô tả</OptionalLabel>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-x-3 gap-y-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name={'price' as FieldPath<T>}
            render={({ field }) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { onChange, ...fieldProps } = field
              return (
                <FormItem>
                  <FormLabel>Nhập giá</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      className={cn(inputClassName)}
                      intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                      placeholder="Nhập giá gói"
                      decimalsLimit={0}
                      onValueChange={(_value, _name, values) => {
                        field.onChange(values?.float)
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name={'duration_months' as FieldPath<T>}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Thời hạn</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      if (value) field.onChange(+value)
                    }}
                    disabled={field.disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thời gian" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from(['3', '6', '12']).map((item) => (
                          <SelectItem key={item} value={item}>
                            {item} Tháng
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label className={cn(errors.benefits && 'text-destructive')}>
              Quyền lợi
            </Label>
            <Button
              variant={'ghost'}
              size={'icon'}
              type="button"
              disabled={fields.length >= 10 || form.formState.disabled}
              onClick={() =>
                append({
                  value: '',
                } as FieldArray<T, ArrayPath<T>>)
              }
              className="size-6"
            >
              <PlusCircle className="!size-3.5" />
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Sortable
              value={fields}
              onMove={({ activeIndex, overIndex }) =>
                move(activeIndex, overIndex)
              }
              orientation="mixed"
            >
              {fields.map((field, index) => (
                <SortableItem key={field.id} value={field.id} asChild>
                  <div className="grid grid-cols-[1fr,auto,auto] items-start gap-2">
                    <FormField
                      control={form.control}
                      name={`benefits.${index}.value` as FieldPath<T>}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={`Nhập quyền lợi thứ ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <SortableDragHandle disabled={fields.length <= 1}>
                      <GripVertical />
                    </SortableDragHandle>
                    <Button
                      variant="outline"
                      type="button"
                      size="icon"
                      className="text-destructive hover:text-destructive/80"
                      disabled={fields.length <= 4}
                      onClick={() => {
                        remove(index)
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
                </SortableItem>
              ))}
            </Sortable>
          </div>

          {errors.benefits && (
            <p className={'text-[0.8rem] font-medium text-destructive'}>
              {typeof errors.benefits?.message === 'string'
                ? errors.benefits.message
                : ''}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className={cn(errors.course_ids && 'text-destructive')}>
            Khóa học áp dụng ({rowsSelected?.length ?? 0})
          </Label>
          <ApprovedCoursesTable table={table} isLoading={isLoading} />
          {errors.course_ids && (
            <p className={'text-[0.8rem] font-medium text-destructive'}>
              {typeof errors.course_ids?.message === 'string'
                ? errors.course_ids.message
                : ''}
            </p>
          )}
        </div>

        {children}
      </form>
    </Form>
  )
}
