'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Check,
  ChevronDown,
  FileImage,
  Ghost,
  Loader2,
  Tag,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'

import { useGetCategories } from '@/hooks/category/useCategory'
import { cn } from '@/lib/utils'
import { ICategory } from '@/types/Category'
import { CreatePostPayload, createPostSchema } from '@/validations/post'

import { Button } from '@/components/ui/button'

import 'react-datepicker/dist/react-datepicker.css'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useCreatePost } from '@/hooks/instructor/post/usePost'

import Container from '@/components/shared/container'
import { ImageCropper } from '@/components/shared/image-cropper'
import QuillEditor from '@/components/shared/quill-editor'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { FileWithPreview } from '@/types/file'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

const PostAddView = () => {
  const router = useRouter()

  const { data: categoryData } = useGetCategories()
  const { mutate: createPost, isPending } = useCreatePost()

  const form = useForm<CreatePostPayload>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
    },
  })

  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) {
      toast.error('Không thể tải tệp lên')
      return
    }

    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    })

    setSelectedFile(fileWithPreview)
    setDialogOpen(true)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    disabled: form.formState.disabled,
    accept: {
      'image/*': [],
    },
  })

  const onSubmit = (values: CreatePostPayload) => {
    if (isPending) return

    createPost(values, {
      onSuccess: () => {
        form.reset()
        setSelectedFile(null)
        router.push('/instructor/posts')
      },
    })
  }
  const primaryColor = '#E27447'
  const primaryLightColor = '#FAF0ED'

  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Thêm bài viết</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/instructor/posts')}
          className="hover:bg-orange-50"
        >
          Quay lại
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,350px]">
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader
                  className="pb-3"
                  style={{ background: primaryLightColor }}
                >
                  <CardTitle
                    className="text-lg font-medium"
                    style={{ color: primaryColor }}
                  >
                    Thông tin bài viết
                  </CardTitle>
                </CardHeader>
                <Separator style={{ background: primaryColor, opacity: 0.2 }} />
                <CardContent className="space-y-5 pt-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Tiêu đề bài viết
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tiêu đề bài viết"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Hình ảnh
                        </FormLabel>
                        <div className="mx-auto max-w-md">
                          <AspectRatio
                            ratio={16 / 9}
                            className={cn(!field.disabled && 'cursor-pointer')}
                          >
                            {selectedFile ? (
                              <>
                                {field.value && (
                                  <Image
                                    src={
                                      field.value instanceof File
                                        ? URL.createObjectURL(field.value)
                                        : field.value
                                    }
                                    fill
                                    alt="post-thumbnail"
                                    onClick={() => {
                                      if (!field.disabled) setDialogOpen(true)
                                    }}
                                    className="rounded-md"
                                  />
                                )}

                                <ImageCropper
                                  open={isDialogOpen && !field.disabled}
                                  onOpenChange={setDialogOpen}
                                  selectedFile={selectedFile}
                                  setSelectedFile={setSelectedFile}
                                  croppedImage={
                                    field.value instanceof File
                                      ? field.value
                                      : null
                                  }
                                  setCroppedImage={field.onChange}
                                />
                              </>
                            ) : (
                              <div
                                {...getRootProps()}
                                className={cn(
                                  'group relative grid size-full cursor-pointer place-items-center rounded-lg border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:border-primary/70 hover:bg-orange-50',
                                  'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                  !field.value && 'border-2',
                                  isDragActive &&
                                    'border-2 border-primary/70 bg-orange-50',
                                  field.disabled &&
                                    'pointer-events-none opacity-60'
                                )}
                                style={{
                                  backgroundImage: !isDragActive
                                    ? `url(${field.value})`
                                    : 'none',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              >
                                <FormControl>
                                  <input {...getInputProps()} />
                                </FormControl>

                                {isDragActive ? (
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
                                      <p className="font-medium text-muted-foreground">
                                        Kéo và thả tệp vào đây, hoặc nhấp để
                                        chọn tệp
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </AspectRatio>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormLabel className="text-base font-medium">
                      Mô tả bài viết
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="overflow-hidden rounded-md border">
                              <QuillEditor {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <FormLabel className="text-base font-medium">
                      Nội dung bài viết
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="overflow-hidden rounded-md border">
                              <QuillEditor fullToolbar {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader
                  className="pb-3"
                  style={{ background: primaryLightColor }}
                >
                  <CardTitle
                    className="flex items-center text-lg font-medium"
                    style={{ color: primaryColor }}
                  >
                    <Ghost className="mr-2 size-5" />
                    Danh mục bài viết
                  </CardTitle>
                </CardHeader>
                <Separator style={{ background: primaryColor, opacity: 0.2 }} />
                <CardContent className="pt-5">
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
                                  'w-full justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                                style={{
                                  borderColor: `${primaryColor}40`,
                                  color: field.value ? 'inherit' : '#9CA3AF',
                                }}
                              >
                                {field.value
                                  ? categoryData?.data.find(
                                      (category: ICategory) =>
                                        category.id === field.value
                                    )?.name
                                  : 'Chọn danh mục bài viết'}
                                <ChevronDown className="ml-2 size-4 opacity-50" />
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
                                        onSelect={() => {
                                          field.onChange(category.id)
                                        }}
                                        className="flex items-center justify-between"
                                      >
                                        {category.name}
                                        <Check
                                          className={cn(
                                            'ml-auto',
                                            category.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                          style={{ color: primaryColor }}
                                        />
                                      </CommandItem>
                                    )
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage style={{ color: primaryColor }} />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader
                  className="pb-3"
                  style={{ background: primaryLightColor }}
                >
                  <CardTitle
                    className="flex items-center text-lg font-medium"
                    style={{ color: primaryColor }}
                  >
                    <Tag className="mr-2 size-5" />
                    Thẻ gắn kèm
                  </CardTitle>
                </CardHeader>
                <Separator style={{ background: primaryColor, opacity: 0.2 }} />
                <CardContent className="pt-5">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CreatableSelect
                            isMulti
                            placeholder="Nhập tags và nhấn Enter..."
                            value={field.value?.map((tag: string) => ({
                              value: tag,
                              label: tag,
                            }))}
                            onChange={(selected) =>
                              field.onChange(
                                selected.map((option) => option.value)
                              )
                            }
                            onCreateOption={(inputValue) => {
                              field.onChange([
                                ...(field.value || []),
                                inputValue,
                              ])
                            }}
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderColor: `${primaryColor}40`,
                                borderRadius: '0.375rem',
                                minHeight: '38px',
                                boxShadow: 'none',
                                '&:hover': {
                                  borderColor: `${primaryColor}70`,
                                },
                              }),
                              multiValue: (base) => ({
                                ...base,
                                backgroundColor: primaryLightColor,
                                borderRadius: '0.25rem',
                              }),
                              multiValueLabel: (base) => ({
                                ...base,
                                color: primaryColor,
                              }),
                              multiValueRemove: (base) => ({
                                ...base,
                                color: primaryColor,
                                ':hover': {
                                  backgroundColor: primaryColor,
                                  color: 'white',
                                },
                              }),
                              option: (base, { isFocused }) => ({
                                ...base,
                                backgroundColor: isFocused
                                  ? primaryLightColor
                                  : 'white',
                                color: isFocused ? primaryColor : 'inherit',
                              }),
                            }}
                          />
                        </FormControl>
                        <FormMessage style={{ color: primaryColor }} />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Xuất bản'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </Container>
  )
}

export default PostAddView
