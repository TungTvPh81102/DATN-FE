'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { useGetCategories } from '@/hooks/category/useCategory'
import { useCreateCourse } from '@/hooks/instructor/course/useCourse'
import { ICategory } from '@/types/Category'
import { CreateCoursePayload, createCourseSchema } from '@/validations/course'

import FormCombobox from '@/components/shared/form-combobox'
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

interface Props {
  isPracticalCourse?: boolean
}

export const CreateCourseDialog = ({ isPracticalCourse = false }: Props) => {
  const router = useRouter()

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories()

  const categoryOptions = categories?.data.map((category: ICategory) => ({
    label: category.name,
    value: category.id,
  }))

  const { mutate: createCourse, isPending: isCourseCreating } =
    useCreateCourse()

  const form = useForm<CreateCoursePayload>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      name: '',
      isPracticalCourse,
    },
    disabled: isCourseCreating,
  })

  const onSubmit = (values: CreateCoursePayload) => {
    createCourse(values, {
      onSuccess: (res) => {
        const courseSlug = res?.data.slug
        if (!isPracticalCourse) {
          router.push(`/instructor/courses/update/${courseSlug}`)
        } else {
          router.push(`/instructor/practical-courses/update/${courseSlug}`)
        }
      },
    })
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Tạo khóa học
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm tiêu đề và chọn danh mục cho khóa học</DialogTitle>
          <DialogDescription>
            Bạn có thể thêm tiêu đề và chọn danh mục cho khóa học của mình.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề khóa học</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormCombobox
              control={form.control}
              name="category_id"
              label="Danh mục"
              options={categoryOptions}
              isLoading={isCategoriesLoading}
              placeholder="Chọn danh mục"
            />
            <div className="mt-3 flex justify-end">
              <Button
                type="submit"
                className="bg-primary"
                disabled={isCourseCreating}
              >
                {isCourseCreating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Tiếp tục'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
