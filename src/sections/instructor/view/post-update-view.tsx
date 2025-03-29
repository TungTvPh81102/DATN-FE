'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronDown, Flame, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'

import 'react-datepicker/dist/react-datepicker.css'

import { ICategory } from '@/types/Category'
import { UpdatePostPayload, updatePostSchema } from '@/validations/post'
import { cn } from '@/lib/utils'
import { useGetCategories } from '@/hooks/category/useCategory'
import {
  useGetPostBySlug,
  useUpdatePost,
} from '@/hooks/instructor/post/usePost'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import Container from '@/components/shared/container'
type PostStatus = 'draft' | 'pending' | 'published' | 'private'
const PostUpdateView = ({ slug }: { slug: string }) => {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: categoryData } = useGetCategories()
  const { data: getPostBySlugData, isLoading } = useGetPostBySlug(slug)
  const { mutate: updatePost, isPending } = useUpdatePost()

  const form = useForm<UpdatePostPayload>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      category_id: undefined,
      tags: [],
      status: 'pending' as PostStatus,
    },
  })

  useEffect(() => {
    if (getPostBySlugData) {
      const postData = getPostBySlugData.data
      form.reset({
        title: postData.title,
        category_id: postData.category_id,
        tags: postData.tags.map((tag: any) => tag.name),
        status: postData.status,
        description: postData.description || '',
        content: postData.content || '',
      })
    }
  }, [getPostBySlugData, form])

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

  const onSubmit = (values: UpdatePostPayload) => {
    if (isPending) return

    const postData = getPostBySlugData?.data
    if (!postData) return

    const updatedData = {
      category_id: values.category_id,
      title: values.title,
      description: form.getValues('description') || postData.description || '',
      content: form.getValues('content') || postData.content,
      thumbnail: form.getValues('thumbnail') || postData.thumbnail,
      tags: (values.tags ?? []).length > 0 ? values.tags : postData.tags,
      status: 'pending' as PostStatus, //values.status || postData.status,
    }

    updatePost(
      {
        slug: postData.slug,
        data: updatedData,
      },
      {
        onSuccess: () => {
          form.reset()
          setPreview(null)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="mt-20">
        <Loader2 className="mx-auto size-8 animate-spin" />
      </div>
    )
  }

  return (
    <Container>
      <h1 className="text-2xl font-medium">
        Chỉnh sửa bài viết: {getPostBySlugData?.data.title}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-4 grid grid-cols-[1fr,300px] gap-6">
            <div className="space-y-6">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">
                      Thông tin bài viết: {getPostBySlugData?.data.title ?? ''}
                    </h2>
                    {getPostBySlugData?.data.is_hot === 1 && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 p-2"
                      >
                        <Flame className="size-4 text-orange-500" />
                        Bài viết nổi bật
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiêu đề bài viết</FormLabel>
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
                    </div>
                    <div>
                      <Label>Hình ảnh</Label>
                      <div className="mt-1">
                        <FormField
                          control={form.control}
                          name="thumbnail"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="cursor-pointer"
                                  ref={fileInputRef}
                                  onChange={(event) =>
                                    handleFileChange(event, field)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {preview && (
                        <>
                          <div className="mt-2">
                            <Image
                              src={preview}
                              alt="Preview"
                              width={300}
                              height={300}
                              className="h-[300px] w-full rounded-md object-cover"
                            />
                          </div>
                          <div className="mt-2 text-end">
                            <Button
                              type="button"
                              onClick={() => handleReset(form.setValue as any)}
                            >
                              Reset
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      <Label>Mô tả bài viết</Label>
                      <div className="mt-1">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <QuillEditor {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Nội dung</Label>
                      <div className="mt-1">
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <QuillEditor {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h2 className="mb-2 text-lg font-medium">Ảnh bài viết</h2>
                  <div className="mb-2 border-t"></div>
                  <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-200 p-4">
                    <Image
                      src={getPostBySlugData?.data.thumbnail}
                      alt="Featured"
                      width={800}
                      height={600}
                      className="size-full rounded object-cover"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Danh mục khóa học</FormLabel>
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
                              >
                                {field.value
                                  ? categoryData?.data.find(
                                      (category: ICategory) =>
                                        category.id === field.value
                                    )?.name
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
                                        onSelect={() => {
                                          field.onChange(category.id)
                                        }}
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
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h2 className="mb-2 text-lg font-medium">Tags</h2>
                  <div className="mb-3 border-t"></div>
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <div className="flex justify-end gap-2">
                <Link href="/instructor/posts">
                  <Button variant="secondary">Quay lại danh sách</Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Cập nhật'
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

export default PostUpdateView
