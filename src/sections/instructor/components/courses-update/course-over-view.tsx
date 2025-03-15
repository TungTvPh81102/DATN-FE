import React, { useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Check,
  ChevronDown,
  Loader2,
  Trash2,
  Upload,
  Video,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'

import { ICategory } from '@/types/Category'
import {
  UpdateCourseOverViewPayload,
  updateCourseOverViewSchema,
} from '@/validations/course'
import { formatNumber } from '@/lib/common'
import { cn } from '@/lib/utils'
import { useGetCategories } from '@/hooks/category/useCategory'
import { useUpdateCourseOverView } from '@/hooks/instructor/course/useCourse'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ModalLoading from '@/components/common/ModalLoading'

const CourseOverView = ({ courseOverView }: any) => {
  const avatarCourseRef = useRef<HTMLInputElement | null>(null)
  const trailerCourseRef = useRef<HTMLInputElement | null>(null)

  const { data: categoryData } = useGetCategories()
  const {
    mutate: updateCourseOverView,
    isPending: updateCourseOverViewPending,
  } = useUpdateCourseOverView()

  const form = useForm<UpdateCourseOverViewPayload>({
    resolver: zodResolver(updateCourseOverViewSchema),
    defaultValues: {
      name: '',
      category_id: undefined,
      price: 0,
      price_sale: 0,
      description: '',
      level: '' as 'beginner' | 'intermediate' | 'advanced',
      visibility: '' as 'public' | 'private',
      is_free: '0' as '0' | '1',
    },
  })

  const isReadOnly = !(
    courseOverView?.status === 'draft' || courseOverView?.status === 'rejected'
  )

  useEffect(() => {
    if (courseOverView) {
      const data = courseOverView

      form.reset({
        name: data.name || '',
        category_id: data.category_id || '',
        price: parseFloat(data.price) || 0,
        price_sale: parseFloat(data.price_sale) || 0,
        level: data.level || '',
        description: data.description || '',
        visibility: data.visibility || '',
        is_free: data.is_free || '0',
        thumbnail: data.thumbnail || '',
        intro: data.intro || '',
      })
    }
  }, [courseOverView, form])

  const onSubmit = (data: UpdateCourseOverViewPayload) => {
    updateCourseOverView({ slug: courseOverView.slug, data })
  }

  if (updateCourseOverViewPending) {
    return <ModalLoading />
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row">
            <div>
              <h3 className="text-xl font-bold">Thông tin khoá học</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Thông tin sẽ được hiển thị trên trang Tổng quan, dễ dàng tiếp
                cận Học viên hơn.
              </p>
            </div>
            {(courseOverView?.status === 'draft' ||
              courseOverView?.status === 'rejected') && (
              <div className="flex items-center justify-end gap-2 lg:flex-col lg:items-end">
                <Button variant="secondary">Nhập lại</Button>
                <Button
                  className="lg:order-first"
                  type="submit"
                  disabled={updateCourseOverViewPending}
                >
                  {updateCourseOverViewPending && (
                    <Loader2 className="animate-spin" />
                  )}
                  Lưu thông tin
                </Button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề khoá học</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tiêu đề cho khoá học"
                        {...field}
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="mt-2 text-[14px] text-[#4b5563]">
                Tiêu đề của bạn không những phải thu hút sự chú ý, chứa nhiều
                thông tin mà còn được tối ưu hóa để dễ tìm kiếm
              </p>
            </div>
            <div className="mt-3">
              <Label className="text-base font-semibold">Mô tả khoá học</Label>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ReactQuill
                        {...field}
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="custom-quill mt-2"
                        theme="snow"
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-3">
              <Label className="text-base font-semibold">Giá khoá học</Label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nhập giá khoá học"
                          {...field}
                          value={formatNumber(field.value || 0)}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, '')
                            field.onChange(
                              rawValue ? parseInt(rawValue, 10) : 0
                            )
                          }}
                          readOnly={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price_sale"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Giá khuyến mãi"
                          {...field}
                          value={formatNumber(field.value || 0)}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, '')
                            field.onChange(
                              rawValue ? parseInt(rawValue, 10) : 0
                            )
                          }}
                          readOnly={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-base font-semibold">
                Thông tin cơ bản
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                                disabled={isReadOnly}
                              >
                                {field.value
                                  ? (categoryData?.data.find(
                                      (category: ICategory) =>
                                        category.id === field.value
                                    )?.name ?? 'Chọn danh mục cho khóa học')
                                  : 'Chọn danh mục cho khóa học'}
                                <ChevronDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Tìm kiếm danh mục"
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  Không có kết quả nào phù hợp
                                </CommandEmpty>
                                <CommandGroup>
                                  {categoryData?.data.map(
                                    (category: ICategory) => (
                                      <CommandItem
                                        value={category.name}
                                        key={category.id}
                                        onSelect={() =>
                                          field.onChange(category.id)
                                        }
                                        disabled={isReadOnly}
                                      >
                                        {category.name}
                                        <Check
                                          className={cn(
                                            'ml-auto',
                                            category.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    )
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            key={field.value}
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn cấp độ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Cơ bản</SelectItem>
                              <SelectItem value="intermediate">
                                Nâng cao
                              </SelectItem>
                              <SelectItem value="advanced">
                                Chuyên sâu
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            key={field.value}
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Trạng thái khoá học" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Công khai</SelectItem>
                              <SelectItem value="private">Riêng tư</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div>
                <Label className="text-base font-semibold">Ảnh đại diện</Label>
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-2 gap-4">
                      <div className="relative mt-3">
                        <div
                          className={cn(
                            'flex h-[200px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200',
                            field.value
                              ? 'border-transparent'
                              : 'border-gray-300 bg-gray-50 hover:border-[#E27447] hover:bg-orange-50'
                          )}
                          style={{
                            backgroundImage: field.value
                              ? field.value instanceof File
                                ? `url(${URL.createObjectURL(field.value)})`
                                : `url(${field.value})`
                              : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                          onClick={() =>
                            !isReadOnly && avatarCourseRef.current?.click()
                          }
                        >
                          {!field.value && (
                            <div className="flex flex-col items-center justify-center text-center">
                              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-orange-100">
                                <Upload className="size-6 text-[#E27447]" />
                              </div>
                              <p className="font-medium text-gray-700">
                                Tải ảnh đại diện
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                Kéo thả ảnh hoặc nhấp để chọn
                              </p>
                            </div>
                          )}
                        </div>
                        {field.value && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  avatarCourseRef.current?.click()
                                }}
                                disabled={isReadOnly}
                                className="flex size-10 items-center justify-center rounded-full bg-white text-gray-700 transition-colors hover:bg-gray-100"
                                title="Thay đổi ảnh"
                              >
                                <Upload className="size-5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (avatarCourseRef.current) {
                                    avatarCourseRef.current.value = ''
                                  }
                                  field.onChange(null)
                                }}
                                disabled={isReadOnly}
                                className="flex size-10 items-center justify-center rounded-full bg-white text-red-500 transition-colors hover:bg-red-50"
                                title="Xóa ảnh"
                              >
                                <Trash2 className="size-5" />
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="hidden">
                          <Input
                            disabled={isReadOnly}
                            ref={avatarCourseRef}
                            id="thumbnail"
                            type="file"
                            onChange={(e) => {
                              if (e.target.files?.length) {
                                const file = e.target.files[0]
                                field.onChange(file)
                              }
                            }}
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          Tải hình ảnh khoá học
                        </p>
                        <p className="my-2 text-sm text-gray-500">
                          Tải lên hình ảnh khóa học của bạn ở đây. Hình ảnh sẽ
                          xuất hiện trên trang danh sách khóa học và trang chi
                          tiết khóa học. Chấp nhận định dạng .jpg, .jpeg, .png,
                          .webp.
                        </p>
                        <div className="mt-3 cursor-pointer">
                          <Input
                            ref={avatarCourseRef}
                            id="thumbnail"
                            type="file"
                            onChange={(e) => {
                              if (e.target.files?.length) {
                                const file = e.target.files[0]
                                field.onChange(file)
                              }
                            }}
                            disabled={isReadOnly}
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            className="cursor-pointer border-gray-300 file:bg-[#E27447] file:text-white hover:border-[#E27447]"
                          />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-6">
                <Label className="text-base font-semibold">
                  Video giới thiệu
                </Label>
                <FormField
                  control={form.control}
                  name="intro"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-2 gap-4">
                      <div className="relative mt-3">
                        <div
                          className={cn(
                            'flex h-[200px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200',
                            field.value
                              ? 'border-transparent bg-gray-900'
                              : 'border-gray-300 bg-gray-50 hover:border-[#E27447] hover:bg-orange-50'
                          )}
                          style={{
                            backgroundImage: !field.value
                              ? "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM47.5 35C47.5 32.5147 49.5147 30.5 52 30.5C54.4853 30.5 56.5 32.5147 56.5 35V65C56.5 67.4853 54.4853 69.5 52 69.5C49.5147 69.5 47.5 67.4853 47.5 65V35ZM35 47.5C32.5147 47.5 30.5 49.5147 30.5 52C30.5 54.4853 32.5147 56.5 35 56.5H65C67.4853 56.5 69.5 54.4853 69.5 52C69.5 49.5147 67.4853 47.5 65 47.5H35Z' fill='%23E2E8F0'/%3E%3C/svg%3E\")"
                              : 'none',
                            backgroundSize: '48px',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          }}
                          onClick={() =>
                            !isReadOnly && trailerCourseRef.current?.click()
                          }
                        >
                          {field.value ? (
                            <video
                              className="size-full rounded-lg object-cover"
                              controls
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-orange-100">
                                <Video className="size-6 text-[#E27447]" />
                              </div>
                              <p className="font-medium text-gray-700">
                                Tải video giới thiệu
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                Kéo thả video hoặc nhấp để chọn
                              </p>
                            </div>
                          )}
                        </div>
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => {
                              if (trailerCourseRef.current) {
                                trailerCourseRef.current.value = ''
                              }
                              field.onChange(null)
                            }}
                            disabled={isReadOnly}
                            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/70 text-red-500 backdrop-blur-sm transition-colors hover:bg-white"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                        <div className="hidden">
                          <Input
                            ref={trailerCourseRef}
                            id="intro"
                            type="file"
                            onChange={(e) => {
                              if (e.target.files?.length) {
                                const file = e.target.files[0]
                                field.onChange(file)
                              }
                            }}
                            disabled={isReadOnly}
                            accept="video/mp4, video/webm, video/ogg"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          Tải video giới thiệu khoá học
                        </p>
                        <p className="my-2 text-sm text-gray-500">
                          Video giới thiệu sẽ giúp học viên nhanh chóng hiểu về
                          nội dung khóa học. Một video chất lượng sẽ làm tăng tỷ
                          lệ đăng ký của học viên. Chấp nhận định dạng .mp4,
                          .webm, .ogg.
                        </p>
                        <div className="mt-3">
                          <Input
                            ref={trailerCourseRef}
                            id="intro"
                            type="file"
                            onChange={(e) => {
                              if (e.target.files?.length) {
                                const file = e.target.files[0]
                                field.onChange(file)
                              }
                            }}
                            disabled={isReadOnly}
                            accept="video/mp4, video/webm, video/ogg"
                            className="cursor-pointer border-gray-300 file:bg-[#E27447] file:text-white hover:border-[#E27447]"
                          />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-3">
              <Label className="text-base font-semibold">Miễn phí</Label>
              <FormField
                control={form.control}
                name="is_free"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormControl>
                      <Select
                        key={field.value}
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={String(field.value)}
                        disabled={isReadOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Miễn phí hay không?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={String(1)}>Miễn phí</SelectItem>
                          <SelectItem value={String(0)}>Có phí</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export default CourseOverView
