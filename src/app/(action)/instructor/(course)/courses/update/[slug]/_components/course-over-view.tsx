import { zodResolver } from '@hookform/resolvers/zod'
import {
  Check,
  ChevronDown,
  FileImage,
  FileVideo,
  Loader2,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { useGetCategories } from '@/hooks/category/useCategory'
import { useUpdateCourseOverView } from '@/hooks/instructor/course/useCourse'
import { ICategory } from '@/types/Category'
import {
  UpdateCourseOverViewPayload,
  updateCourseOverViewSchema,
} from '@/validations/course'

import { CurrencyInput } from '@/components/shared/currency-input'
import { ImageCropper } from '@/components/shared/image-cropper'
import { TiptapEditor } from '@/components/tiptap-editor'
import { AspectRatio } from '@/components/ui/aspect-ratio'
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
  FormDescription,
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
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import { ICourse, LevelMap } from '@/types'
import { FileWithPreview } from '@/types/file'
import { hasCodingLesson } from '../utils'
import { useRouter } from 'next/navigation'

const CourseOverView = ({ courseOverView }: { courseOverView: ICourse }) => {
  const router = useRouter()
  const { isDraftOrRejected } = useCourseStatusStore()

  const { data: categoryData } = useGetCategories()
  const {
    mutate: updateCourseOverView,
    isPending: updateCourseOverViewPending,
  } = useUpdateCourseOverView()

  const form = useForm<UpdateCourseOverViewPayload>({
    resolver: zodResolver(updateCourseOverViewSchema),
    disabled: !isDraftOrRejected || updateCourseOverViewPending,
  })

  const [selectedThumbnailFile, setSelectedThumbnailFile] =
    React.useState<FileWithPreview | null>(null)
  const [isDialogOpen, setDialogOpen] = React.useState(false)

  const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) {
      toast.error('Không thể tải tệp lên')
      return
    }

    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    })

    setSelectedThumbnailFile(fileWithPreview)
    setDialogOpen(true)
  }, [])

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
    isDragActive: isThumbnailDragActive,
  } = useDropzone({
    onDrop: onThumbnailDrop,
    disabled: form.formState.disabled,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
  })

  const onIntroDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) {
      toast.error('Không thể tải tệp lên')
      return
    }
    form.setValue('intro', file)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    getRootProps: getIntroRootProps,
    getInputProps: getIntroInputProps,
    isDragActive: isIntroDragActive,
  } = useDropzone({
    onDrop: onIntroDrop,
    disabled: form.formState.disabled,
    accept: {
      'video/mp4': [],
      'video/webm': [],
      'video/ogg': [],
    },
  })

  useEffect(() => {
    if (courseOverView) {
      const data = courseOverView

      form.reset({
        name: data.name || '',
        category_id: data.category_id,
        price: parseFloat(data.price),
        price_sale: parseFloat(data.price_sale),
        level: data.level || '',
        description: data.description || '',
        visibility: data.visibility || '',
        is_free:
          data.is_free !== undefined
            ? (String(data.is_free) as '0' | '1')
            : undefined,
        allow_coding_lesson: !!data.allow_coding_lesson,
        thumbnail: data.thumbnail || '',
        intro: data.intro || '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseOverView])

  const onSubmit = (payload: UpdateCourseOverViewPayload) => {
    if (courseOverView)
      updateCourseOverView(
        { slug: courseOverView.slug, payload },
        {
          onSuccess: (res) => {
            if (res?.data?.slug !== courseOverView.slug) {
              const courseSlug = res?.data.slug
              if (!courseOverView.is_practical_course) {
                router.push(`/instructor/courses/update/${courseSlug}`)
              } else {
                router.push(
                  `/instructor/practical-courses/update/${courseSlug}`
                )
              }
            }
            setSelectedThumbnailFile(null)
          },
        }
      )
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

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Tiêu đề
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề " {...field} />
                </FormControl>
                <FormDescription>
                  Tiêu đề của bạn không những phải thu hút sự chú ý, chứa nhiều
                  thông tin mà còn được tối ưu hóa để dễ tìm kiếm
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Mô tả</FormLabel>
                <FormControl>
                  <TiptapEditor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!courseOverView.is_practical_course && (
            <FormField
              control={form.control}
              name="is_free"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel className="text-base font-semibold">
                    Miễn phí
                  </FormLabel>
                  <FormControl>
                    <Select
                      key={field.value}
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={field.disabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Miễn phí hay không?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Miễn phí</SelectItem>
                        <SelectItem value="0">Có phí</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch('is_free') == '0' && (
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name={'price'}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Giá gốc
                      </FormLabel>
                      <FormControl>
                        <CurrencyInput placeholder="Nhập giá gốc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name={'price_sale'}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Giá khuyến mãi
                      </FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="Nhập giá khuyến mãi"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-base font-semibold">Thông tin cơ bản</Label>
            <div className="grid gap-x-2 gap-y-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:col-span-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'justify-between hover:bg-transparent',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={field.disabled}
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
                              {categoryData?.data.map((category: ICategory) => (
                                <CommandItem
                                  value={category.name}
                                  key={category.id}
                                  onSelect={() => field.onChange(category.id)}
                                  disabled={!isDraftOrRejected}
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
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        disabled={field.disabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn cấp độ" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(LevelMap).map(([key, value]) => (
                            <SelectItem value={key} key={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        disabled={field.disabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Trạng thái khóa học" />
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

              {!courseOverView.is_practical_course && (
                <FormField
                  control={form.control}
                  name="allow_coding_lesson"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={
                            field.disabled ||
                            hasCodingLesson(courseOverView.chapters)
                          }
                        />
                      </FormControl>
                      <FormLabel>Bài tập coding</FormLabel>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Ảnh khóa học
                </FormLabel>
                <div className="grid gap-4 lg:grid-cols-2">
                  <AspectRatio
                    ratio={16 / 9}
                    className={cn(!field.disabled && 'cursor-pointer')}
                  >
                    {selectedThumbnailFile ? (
                      <>
                        {field.value && (
                          <Image
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            fill
                            alt="course-thumbnail"
                            onClick={() => {
                              if (!field.disabled) setDialogOpen(true)
                            }}
                            className="rounded-md"
                          />
                        )}

                        <ImageCropper
                          open={isDialogOpen && !field.disabled}
                          onOpenChange={setDialogOpen}
                          selectedFile={selectedThumbnailFile}
                          setSelectedFile={setSelectedThumbnailFile}
                          croppedImage={
                            field.value instanceof File ? field.value : null
                          }
                          setCroppedImage={(croppedImage) => {
                            field.onChange(croppedImage)
                          }}
                        />
                      </>
                    ) : (
                      <div
                        {...getThumbnailRootProps()}
                        className={cn(
                          'group relative grid size-full cursor-pointer place-items-center rounded-lg border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:border-primary/70 hover:bg-orange-50',
                          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          !field.value && 'border-2',
                          isThumbnailDragActive &&
                            'border-2 border-primary/70 bg-orange-50',
                          field.disabled && 'pointer-events-none opacity-60'
                        )}
                        style={{
                          backgroundImage: !isThumbnailDragActive
                            ? `url(${field.value})`
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <input {...getThumbnailInputProps()} />

                        {isThumbnailDragActive ? (
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="rounded-full bg-orange-100 p-3">
                              <FileImage
                                className="size-7 text-primary"
                                aria-hidden="true"
                              />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Thả tệp vào đây
                            </p>
                          </div>
                        ) : (
                          !field.value && (
                            <div className="flex flex-col items-center justify-center gap-4">
                              <div className="rounded-full bg-orange-100 p-3">
                                <FileImage
                                  className="size-7 text-primary"
                                  aria-hidden="true"
                                />
                              </div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Kéo và thả tệp vào đây, hoặc nhấp để chọn tệp
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </AspectRatio>

                  <div>
                    <p className="font-medium text-gray-700">Tải hình ảnh</p>
                    <p className="mb-4 text-sm text-gray-500">
                      Tải lên hình ảnh khóa học của bạn ở đây. Hình ảnh sẽ xuất
                      hiện trên trang danh sách khóa học và trang chi tiết khóa
                      học.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Check className="mr-2 size-4 text-green-500" />
                        <span>Tỉ lệ 16:9, kích thước tối thiểu 1280x720px</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Check className="mr-2 size-4 text-green-500" />
                        <span>Định dạng: JPG, PNG, hoặc WEBP</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Check className="mr-2 size-4 text-green-500" />
                        <span>Tránh chữ nhỏ và tối giản</span>
                      </div>
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Video giới thiệu
                </FormLabel>
                <div className="grid gap-4 lg:grid-cols-2">
                  <AspectRatio
                    ratio={16 / 9}
                    className={cn(!field.disabled && 'cursor-pointer')}
                  >
                    {field.value ? (
                      <div className="group/video relative overflow-hidden rounded-md">
                        <video
                          className="size-full"
                          controls
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value
                          }
                        />

                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => field.onChange(null)}
                          disabled={field.disabled}
                          className="absolute right-2 top-2 hidden size-8 rounded-full text-destructive group-hover/video:inline-flex"
                        >
                          <Trash2 className="!size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        {...getIntroRootProps()}
                        className={cn(
                          'group relative grid size-full cursor-pointer place-items-center rounded-lg border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:border-primary/70 hover:bg-orange-50',
                          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          !field.value && 'border-2',
                          isIntroDragActive &&
                            'border-2 border-primary/70 bg-orange-50',
                          field.disabled && 'pointer-events-none opacity-60'
                        )}
                      >
                        <input {...getIntroInputProps()} />

                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="rounded-full bg-orange-100 p-3">
                            <FileVideo
                              className="size-7 text-primary"
                              aria-hidden="true"
                            />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {isIntroDragActive
                              ? 'Thả tệp vào đây'
                              : 'Kéo và thả tệp vào đây, hoặc nhấp để chọn tệp'}
                          </p>
                        </div>
                      </div>
                    )}
                  </AspectRatio>

                  <div>
                    <p className="font-medium text-gray-700">
                      Tải video giới thiệu khóa học
                    </p>
                    <p className="mb-4 text-sm text-gray-500">
                      Video giới thiệu sẽ giúp học viên nhanh chóng hiểu về nội
                      dung khóa học. Một video chất lượng sẽ làm tăng tỷ lệ đăng
                      ký của học viên.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Check className="mr-2 size-4 text-green-500" />
                        <span>Tối đa 5 phút, chất lượng HD</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Check className="mr-2 size-4 text-green-500" />
                        <span>Định dạng: MP4, WEBM, hoặc OGG</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Check className="mr-2 size-4 text-green-500" />
                        <span>Giới thiệu rõ kết quả khóa học</span>
                      </div>
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {(courseOverView?.status === 'draft' ||
            courseOverView?.status === 'rejected') && (
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary">Nhập lại</Button>
              <Button type="submit" disabled={updateCourseOverViewPending}>
                {updateCourseOverViewPending && (
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

export default CourseOverView
