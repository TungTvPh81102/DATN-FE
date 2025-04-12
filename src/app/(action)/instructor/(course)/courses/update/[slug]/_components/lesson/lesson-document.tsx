import { TiptapEditor } from '@/components/tiptap-editor'
import { Button } from '@/components/ui/button'
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
import {
  useCreateLessonDocument,
  useGetLessonDocument,
  useUpdateLessonDocument,
} from '@/hooks/instructor/lesson/useLesson'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import {
  LessonDocumentPayload,
  lessonDocumentSchema,
} from '@/validations/lesson'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import DialogDocumentPreview from './document/dialog-document-preview'

type Props = {
  chapterId?: string | number
  onHide: () => void
  lessonId?: string | number
}

const LessonDocument = ({ chapterId, lessonId, onHide }: Props) => {
  const { isDraftOrRejected } = useCourseStatusStore()

  const [isOpenDocumentPreview, setIsOpenDocumentPreview] = useState(false)
  const [documentFile, setDocumentFile] = useState<string | null>(null) // [document]
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileType, setFileType] = useState<'document_file' | 'document_url'>(
    null as any
  )
  const [selectedFile, setSelectedFile] = useState<any>(null)

  const { data: lessonDocumentData, isLoading } = useGetLessonDocument(
    chapterId as string,
    lessonId as string
  )
  const { mutate: createLessonDocument, isPending: isLessonDocumentCreating } =
    useCreateLessonDocument()
  const { mutate: updateLessonDocument, isPending: isLessonDocumentUpdating } =
    useUpdateLessonDocument()

  const form = useForm<LessonDocumentPayload>({
    resolver: zodResolver(lessonDocumentSchema),
    defaultValues: {
      title: '',
      content: '',
      file_type: undefined,
      document_file: null as any,
      document_url: '',
      isEdit: false,
    },
    disabled:
      !isDraftOrRejected ||
      isLessonDocumentCreating ||
      isLessonDocumentUpdating,
  })

  useEffect(() => {
    if (lessonDocumentData && lessonId) {
      const { title, content, lessonable } = lessonDocumentData.data
      form.reset({
        title,
        content,
      })

      if (lessonable.document_file) {
        form.setValue('document_file', lessonable.document_file)
      } else {
        form.setValue(
          'document_url',
          lessonable.document ? lessonable.document.document_url : ''
        )
      }
      form.setValue('isEdit', true)
      if (lessonable?.file_path) {
        setDocumentFile(lessonable.file_path)
      }
    }
  }, [lessonDocumentData, form, lessonId])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ]
      if (!validTypes.includes(file.type)) {
        form.setError('document_file', {
          message:
            'Định dạng file không hợp lệ. Chỉ chấp nhận định dạng pdf, doc, docx.',
        })
        return
      }

      form.clearErrors('document_file')
      form.setValue('document_file', file)
      setSelectedFile(file)
    }
  }

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleResetClick = useCallback(() => {
    form.setValue('document_file', null as unknown as File)
    setSelectedFile(null)
  }, [form])

  const onSubmit = (data: LessonDocumentPayload) => {
    if (!lessonId) {
      if (fileType === 'document_file' && !data.document_file) {
        return alert('Vui lòng tải lên tệp dữ liệu.')
      }
      if (
        fileType === 'document_url' &&
        (!data.document_url || data.document_url.trim() === '')
      ) {
        return alert('Vui lòng nhập URL tài liệu.')
      }
    }

    if (isLessonDocumentCreating) return

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content || '')
    if (fileType === 'document_file') {
      formData.append('document_file', selectedFile)
    } else {
      formData.append('document_url', String(data.document_url))
    }
    formData.append('chapter_id', String(chapterId))

    if (lessonId) {
      formData.append('_method', 'PUT')
    }

    if (lessonId) {
      updateLessonDocument(
        {
          chapterId: chapterId as string,
          lessonId: lessonId as string,
          payload: formData,
        },
        {
          onSuccess: async (res: any) => {
            form.reset()
            onHide()
            toast.success(res.message)
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi cập nhật bài học')
          },
        }
      )
    } else {
      createLessonDocument(
        {
          chapterId: chapterId as string,
          payload: formData,
        },
        {
          onSuccess: async (res: any) => {
            form.reset()
            onHide()
            toast.success(res.message)
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi tạo bài học')
          },
        }
      )
    }
  }

  if (isLoading)
    return <Loader2 className="mx-auto animate-spin text-muted-foreground" />

  return (
    <>
      <div className="flex justify-between">
        <h2 className="font-semibold">
          {isDraftOrRejected ? (lessonId ? 'Cập nhật' : 'Thêm') : 'Thông tin'}{' '}
          tài liệu
        </h2>
        {documentFile && (
          <Button onClick={() => setIsOpenDocumentPreview(true)}>
            Xem tài liệu
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề bài giảng</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề bài giảng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung bài giảng</FormLabel>
                <FormControl>
                  <TiptapEditor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isDraftOrRejected && (
            <>
              <FormField
                control={form.control}
                name="file_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bạn có thể tải file tài liệu ở đây</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          setFileType(value as 'document_file' | 'document_url')
                          form.setValue(
                            'file_type',
                            value as 'document_file' | 'document_url'
                          )
                          setSelectedFile(null)
                          form.setValue('document_file', null as any)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn loại tài liệu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document_file">
                            Tải lên tệp
                          </SelectItem>
                          <SelectItem value="document_url">
                            URL tài liệu
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fileType === 'document_file' && (
                <div>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-gray-300 p-5">
                    <span className="text-xs">Tải dữ liệu video</span>
                    <button
                      type="button"
                      className="rounded-lg border border-black p-4 font-medium transition-all duration-300 ease-in-out hover:bg-[#404040] hover:text-white"
                      onClick={handleUploadClick}
                    >
                      Tải lên tệp
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>
                  <FormMessage>
                    {form.formState.errors.document_file && (
                      <p className="mt-2 text-xs text-red-500">
                        {String(form.formState.errors.document_file.message) ||
                          undefined}
                      </p>
                    )}
                  </FormMessage>
                </div>
              )}
              {selectedFile && (
                <div className="flex w-full items-center justify-between">
                  <p className="text-left text-sm font-medium">
                    Đã chọn tài liệu: {selectedFile?.name || ''}
                  </p>
                  <Button
                    onClick={handleResetClick}
                    type="button"
                    variant="destructive"
                    disabled={
                      isLessonDocumentCreating || isLessonDocumentUpdating
                    }
                  >
                    Tải lại
                  </Button>
                </div>
              )}
              {fileType === 'document_url' && (
                <FormField
                  control={form.control}
                  name="document_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL tài liệu</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="Nhập URL tài liệu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    isLessonDocumentCreating || isLessonDocumentUpdating
                  }
                >
                  {(isLessonDocumentCreating || isLessonDocumentUpdating) && (
                    <Loader2 className="animate-spin" />
                  )}
                  {lessonId ? 'Lưu tài liệu' : 'Thêm tài liệu'}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>

      <DialogDocumentPreview
        isOpen={isOpenDocumentPreview}
        setIsOpen={setIsOpenDocumentPreview}
        documentFile={`http://localhost:8000/storage/${documentFile}`}
      />
    </>
  )
}

export default LessonDocument
