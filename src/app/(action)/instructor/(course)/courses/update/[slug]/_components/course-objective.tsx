import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus, Loader2, Trash } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { useUpdateCourseObjective } from '@/hooks/instructor/course/useCourse'
import {
  UpdateCourseObjectivePayload,
  updateCourseObjectiveSchema,
} from '@/validations/course'

import { Button } from '@/components/ui/button'
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
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '@/components/ui/sortable'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'

const CourseObjective = ({ courseObjective }: { courseObjective: any }) => {
  const {
    mutate: updateCourseObjective,
    isPending: updateCourseObjectivePending,
  } = useUpdateCourseObjective()

  const form = useForm<UpdateCourseObjectivePayload>({
    resolver: zodResolver(updateCourseObjectiveSchema),
    defaultValues: {
      benefits: Array(4).fill({ value: '' }),
      requirements: Array(4).fill({ value: '' }),
      qa: [{ question: '', answer: '' }],
    },
  })

  const errors = form.formState.errors

  const isReadOnly = !(
    courseObjective?.status === 'draft' ||
    courseObjective?.status === 'rejected'
  )

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
    move: moveBenefit,
  } = useFieldArray({
    control: form.control,
    name: 'benefits',
  })

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
    move: moveRequirement,
  } = useFieldArray({
    control: form.control,
    name: 'requirements',
  })

  const {
    fields: qaFields,
    append: appendQA,
    remove: removeQA,
    move: moveQA,
  } = useFieldArray({
    control: form.control,
    name: 'qa',
  })

  useEffect(() => {
    if (courseObjective) {
      form.reset({
        benefits: courseObjective.benefits?.length
          ? courseObjective.benefits.map((benefit: string) => ({
              value: benefit,
            }))
          : Array(4).fill({ value: '' }),

        requirements: courseObjective.requirements?.length
          ? courseObjective.requirements.map((requirement: string) => ({
              value: requirement,
            }))
          : Array(4).fill({ value: '' }),

        qa: courseObjective.qa?.length
          ? courseObjective.qa
          : [{ question: '', answer: '' }],
      })
    }
  }, [courseObjective, form])

  const handleAddBenefit = () => {
    if (benefitFields.length < 10) {
      appendBenefit({ value: '' })
    }
  }

  const handleAddRequirement = () => {
    if (requirementFields.length < 10) {
      appendRequirement({ value: '' })
    }
  }

  const handleAddQA = () => {
    if (qaFields.length < 10) {
      appendQA({ question: '', answer: '' })
    }
  }

  const onSubmit = (data: UpdateCourseObjectivePayload) => {
    const formData = {
      benefits: data.benefits.filter((benefit) => benefit.value.trim() !== ''),
      requirements: data.requirements.filter(
        (requirement) => requirement.value.trim() !== ''
      ),
      qa: data.qa?.filter(
        (faq) => faq.question.trim() !== '' && faq.answer.trim() !== ''
      ),
    }

    updateCourseObjective({
      slug: courseObjective.slug,
      data: formData,
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-xl font-bold">Thông tin khóa học</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thông tin sẽ được hiển thị trên trang tổng quan, dễ dàng tiếp cận
              học viên hơn.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-x-1">
              <Label
                className={cn(
                  'text-base font-semibold',
                  errors.benefits && 'text-destructive'
                )}
              >
                Lợi ích mà khóa học mang lại
              </Label>
              {!isReadOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  disabled={benefitFields.length >= 10}
                  onClick={handleAddBenefit}
                  className="size-6"
                >
                  <CirclePlus className="size-3.5" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Bạn phải nhập ít nhất 4 lợi ích mà học viên có thể nhận được sau
              khi kết thúc khóa học.
            </p>

            <Sortable
              value={benefitFields}
              onMove={({ activeIndex, overIndex }) =>
                moveBenefit(activeIndex, overIndex)
              }
              orientation="vertical"
            >
              <ol className="ml-4 list-decimal space-y-3">
                {benefitFields.map((field, index) => (
                  <SortableItem key={field.id} value={field.id} asChild>
                    <li className="pl-1">
                      <div className="grid grid-cols-[1fr,auto,auto] gap-2">
                        <FormField
                          control={form.control}
                          name={`benefits.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={`Nhập lợi ích số ${index + 1}`}
                                  readOnly={isReadOnly}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {!isReadOnly && (
                          <>
                            <SortableDragHandle
                              disabled={updateCourseObjectivePending}
                            >
                              <GripVertical className="cursor-grab" />
                            </SortableDragHandle>
                            <Button
                              variant="outline"
                              type="button"
                              size="icon"
                              className="text-red-500 hover:text-red-500/80"
                              disabled={
                                benefitFields.length <= 4 ||
                                updateCourseObjectivePending
                              }
                              onClick={() => removeBenefit(index)}
                            >
                              <Trash className="size-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </li>
                  </SortableItem>
                ))}

                {errors.benefits && (
                  <p
                    className={
                      'ml-1 text-[0.8rem] font-medium text-destructive'
                    }
                  >
                    {errors.benefits?.message || errors.benefits?.root?.message}
                  </p>
                )}
              </ol>
            </Sortable>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-x-1">
              <Label
                className={cn(
                  'text-base font-semibold',
                  errors.requirements && 'text-destructive'
                )}
              >
                Yêu cầu khi tham gia khóa học
              </Label>
              {!isReadOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  disabled={requirementFields.length >= 10}
                  onClick={handleAddRequirement}
                  className="size-6"
                >
                  <CirclePlus className="size-3.5" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Liệt kê các kỹ năng, kinh nghiệm, công cụ hoặc thiết bị mà học
              viên bắt buộc phải có trước khi tham gia khóa học.
            </p>

            <Sortable
              value={requirementFields}
              onMove={({ activeIndex, overIndex }) =>
                moveRequirement(activeIndex, overIndex)
              }
              orientation="vertical"
            >
              <ol className="ml-4 list-decimal space-y-3">
                {requirementFields.map((field, index) => (
                  <SortableItem key={field.id} value={field.id} asChild>
                    <li className="pl-1">
                      <div className="mt-3 grid grid-cols-[1fr,auto,auto] gap-2">
                        <FormField
                          control={form.control}
                          name={`requirements.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={`Nhập yêu cầu số ${index + 1}`}
                                  readOnly={isReadOnly}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {!isReadOnly && (
                          <>
                            <SortableDragHandle
                              disabled={updateCourseObjectivePending}
                            >
                              <GripVertical className="cursor-grab" />
                            </SortableDragHandle>
                            <Button
                              variant="outline"
                              type="button"
                              size="icon"
                              className="text-red-500 hover:text-red-500/80"
                              disabled={
                                requirementFields.length <= 4 ||
                                updateCourseObjectivePending
                              }
                              onClick={() => removeRequirement(index)}
                            >
                              <Trash className="size-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </li>
                  </SortableItem>
                ))}
                {errors.requirements && (
                  <p
                    className={
                      'ml-1 text-[0.8rem] font-medium text-destructive'
                    }
                  >
                    {errors.requirements?.message ||
                      errors.requirements?.root?.message}
                  </p>
                )}
              </ol>
            </Sortable>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-x-1">
              <Label
                className={cn(
                  'text-base font-semibold',
                  errors.qa && 'text-destructive'
                )}
              >
                Câu hỏi thường gặp
              </Label>
              {!isReadOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  disabled={qaFields.length >= 10}
                  onClick={handleAddQA}
                  className="size-6"
                >
                  <CirclePlus className="size-3.5" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Thêm các câu hỏi và câu trả lời thường gặp về khóa học.
            </p>

            <Sortable
              value={qaFields}
              onMove={({ activeIndex, overIndex }) =>
                moveQA(activeIndex, overIndex)
              }
              orientation="vertical"
            >
              <ol className="ml-4 list-decimal space-y-4">
                {qaFields.map((field, index) => (
                  <SortableItem key={field.id} value={field.id} asChild>
                    <li className="space-y-3 pl-1">
                      <div className="grid grid-cols-[1fr,auto,auto] gap-2">
                        <FormField
                          control={form.control}
                          name={`qa.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FloatingLabelInput
                                  {...field}
                                  label={`Câu hỏi ${index + 1}`}
                                  readOnly={isReadOnly}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {!isReadOnly && (
                          <>
                            <SortableDragHandle
                              disabled={
                                qaFields.length <= 1 ||
                                updateCourseObjectivePending
                              }
                            >
                              <GripVertical className="cursor-grab" />
                            </SortableDragHandle>
                            <Button
                              variant="outline"
                              type="button"
                              size="icon"
                              className="text-red-500 hover:text-red-500/80"
                              disabled={
                                qaFields.length <= 1 ||
                                updateCourseObjectivePending
                              }
                              onClick={() => removeQA(index)}
                            >
                              <Trash className="size-4" />
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="pl-1 md:pl-4">
                        <FormField
                          control={form.control}
                          name={`qa.${index}.answer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FloatingLabelInput
                                  {...field}
                                  label={`Câu trả lời ${index + 1}`}
                                  readOnly={isReadOnly}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </li>
                  </SortableItem>
                ))}
                {errors.qa && (
                  <p
                    className={
                      'ml-1 text-[0.8rem] font-medium text-destructive'
                    }
                  >
                    {errors.qa?.message || errors.qa?.root?.message}
                  </p>
                )}
              </ol>
            </Sortable>
          </div>

          {(courseObjective?.status === 'draft' ||
            courseObjective?.status === 'rejected') && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => form.reset()}
              >
                Nhập lại
              </Button>
              <Button type="submit" disabled={updateCourseObjectivePending}>
                {updateCourseObjectivePending && (
                  <Loader2 className="animate-spin" />
                )}
                Lưu thông tin
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  )
}

export default CourseObjective
