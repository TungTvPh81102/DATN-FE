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
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import DialogDocumentPreview from './document/dialog-document-preview'

type Props = {
  chapterId: number
  onHide: () => void
  lessonId?: number
}

const LessonDocument = ({ chapterId, lessonId, onHide }: Props) => {
  const { isDraftOrRejected } = useCourseStatusStore()

  const [isOpenDocumentPreview, setIsOpenDocumentPreview] = useState(false)
  const [documentFile, setDocumentFile] = useState<string | null>(null) // [document]

  const { data: lessonDocumentData, isLoading } = useGetLessonDocument(
    chapterId,
    lessonId
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
      file_type: 'upload',
      isEdit: false,
    },
    disabled:
      !isDraftOrRejected ||
      isLessonDocumentCreating ||
      isLessonDocumentUpdating,
  })

  const fileType = form.watch('file_type')

  useEffect(() => {
    if (lessonDocumentData) {
      const { title, content, lessonable } = lessonDocumentData

      form.reset({
        title,
        content,
        file_type: lessonable?.file_type,
        document_url:
          lessonable?.file_type === 'url'
            ? lessonable?.file_path
            : lessonable?.file_type === 'upload'
              ? process.env.NEXT_PUBLIC_STORAGE + '/' + lessonable?.file_path
              : undefined,
        isEdit: true,
      })

      // Set document file separately to ensure it's properly captured
      if (lessonable?.file_path) {
        setDocumentFile(lessonable.file_path)
      }
    }
  }, [lessonDocumentData, form])

  const onSubmit = (payload: LessonDocumentPayload) => {
    if (lessonId) {
      updateLessonDocument(
        {
          chapterId,
          lessonId,
          payload,
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
          chapterId,
          payload,
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
                    <FormLabel>Loại tài liệu</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          form.setValue('file_type', value as 'upload' | 'url')
                          if (value === 'upload') {
                            form.setValue('document_url', undefined)
                          } else if (value === 'url') {
                            form.setValue('document_file', undefined)
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn loại tài liệu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upload">Tải lên tệp</SelectItem>
                          <SelectItem value="url">URL tài liệu</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fileType === 'upload' && (
                <FormField
                  control={form.control}
                  name="document_file"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Tải lên tài liệu</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,"
                          onChange={(e) => {
                            onChange(e.target.files?.[0])
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {fileType === 'url' && (
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
