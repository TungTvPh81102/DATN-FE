'use client'

import React, { useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Calendar,
  Check,
  ChevronDown,
  Ghost,
  ImagePlus,
  Loader2,
  Tag,
} from 'lucide-react'
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'

import { ICategory } from '@/types/Category'
import { CreatePostPayload, createPostSchema } from '@/validations/post'
import { cn } from '@/lib/utils'
import { useGetCategories } from '@/hooks/category/useCategory'

import { Button } from '@/components/ui/button'

import 'react-datepicker/dist/react-datepicker.css'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { parseISO } from 'date-fns'

import { useCreatePost } from '@/hooks/instructor/post/usePost'

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
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import QuillEditor from '@/components/shared/quill-editor'
import { Separator } from '@/components/ui/separator'
import Container from '@/components/shared/container'

const PostAddView = () => {
  const router = useRouter()

  const { data: categoryData } = useGetCategories()
  const { mutate: createPost, isPending } = useCreatePost()

  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<CreatePostPayload>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
    },
  })

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      field.onChange(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleReset = (field?: { onChange?: (value: any) => void }) => {
    setPreview(null)

    if (field?.onChange) {
      field.onChange(null)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = (values: CreatePostPayload) => {
    if (isPending) return

    createPost(
      {
        ...values,
        thumbnail: form.getValues('thumbnail'),
      },
      {
        onSuccess: () => {
          form.reset()
          setPreview(null)
          router.push('/instructor/posts')
        },
      }
    )
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
                            className="h-10 focus:ring-2 focus:ring-opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormLabel className="text-base font-medium">
                      Hình ảnh
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="thumbnail"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            {!preview ? (
                              <div
                                className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors hover:bg-orange-50"
                                style={{ borderColor: `${primaryColor}40` }}
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <ImagePlus
                                  className="mb-2 size-10"
                                  style={{ color: primaryColor }}
                                />
                                <p className="text-center text-gray-600">
                                  Kéo thả hoặc nhấn vào đây để tải lên hình ảnh
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                  PNG, JPG, GIF lên đến 10MB
                                </p>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(event) =>
                                    handleFileChange(event, field)
                                  }
                                  ref={fileInputRef}
                                />
                              </div>
                            ) : (
                              <div
                                className="relative overflow-hidden rounded-lg border"
                                style={{ borderColor: `${primaryColor}40` }}
                              >
                                <Image
                                  src={preview}
                                  alt="Preview"
                                  width={800}
                                  height={400}
                                  className="h-64 w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleReset(field)}
                                    className="mx-2"
                                  >
                                    Xóa ảnh
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      fileInputRef.current?.click()
                                    }
                                    className="mx-2"
                                    style={{
                                      backgroundColor: primaryColor,
                                      borderColor: primaryColor,
                                    }}
                                  >
                                    Thay đổi
                                  </Button>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) =>
                                      handleFileChange(event, field)
                                    }
                                    ref={fileInputRef}
                                  />
                                </div>
                              </div>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
              <Card>
                <CardHeader
                  className="pb-3"
                  style={{ background: primaryLightColor }}
                >
                  <CardTitle
                    className="flex items-center text-lg font-medium"
                    style={{ color: primaryColor }}
                  >
                    <Calendar className="mr-2 size-5" />
                    Thời gian xuất bản
                  </CardTitle>
                </CardHeader>
                <Separator style={{ background: primaryColor, opacity: 0.2 }} />
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="published_at"
                      render={({ field }) => {
                        let selectedDate: Date | null = null

                        const fieldValue = field.value as any

                        if (typeof fieldValue === 'string') {
                          selectedDate = parseISO(fieldValue)
                        } else if (fieldValue instanceof Date) {
                          selectedDate = fieldValue
                        } else {
                          selectedDate = new Date()
                        }

                        return (
                          <FormItem>
                            <Label>Ngày xuất bản</Label>
                            <FormControl>
                              <DatePicker
                                selected={selectedDate}
                                onChange={(date) => field.onChange(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd/MM/yyyy HH:mm"
                                placeholderText="Chọn ngày giờ"
                                className="w-[240px] rounded-md border p-2"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
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
