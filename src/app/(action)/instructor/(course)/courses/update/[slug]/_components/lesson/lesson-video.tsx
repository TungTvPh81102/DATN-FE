import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, FolderOpen, Upload } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import {
  useCreateLessonVideo,
  useGetLessonVideo,
  useUpdateLessonVideo,
  useGetUploadUrl,
  useGetVideoInfo,
} from '@/hooks/instructor/lesson/useLesson'
import { LessonVideoPayload, lessonVideoSchema } from '@/validations/lesson'

import { TiptapEditor } from '@/components/tiptap-editor'
import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import MuxPlayer from '@mux/mux-player-react/lazy'
import MuxUploader from '@mux/mux-uploader-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import MediaLibraryDialog from '@/app/(action)/instructor/(course)/courses/update/[slug]/_components/lesson/media-item'

type Props = {
  chapterId: number
  onHide: () => void
  isEdit?: boolean
  lessonId?: number
}

const LessonVideo = ({ onHide, chapterId, isEdit, lessonId }: Props) => {
  const { isDraftOrRejected } = useCourseStatusStore()

  const [uploading, setUploading] = useState(false)
  const [uploadId, setUploadId] = useState('')
  const [muxPlaybackId, setMuxPlaybackId] = useState<string | null>(null)
  const [muxAssetId, setMuxAssetId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('upload')
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false)
  const [duration, setDuration] = useState(null)

  const { data: lessonVideoData, isLoading: isLessonLoading } =
    useGetLessonVideo(chapterId, lessonId)

  const { data: uploadUrlData, refetch: refetchUploadUrl } = useGetUploadUrl()

  const { data: videoInfoData, refetch: refetchVideoInfo } = useGetVideoInfo(
    uploadId || ''
  )

  const { mutate: createLessonVideo, isPending: isLessonVideoCreating } =
    useCreateLessonVideo()
  const { mutate: updateLessonVideo, isPending: isLessonVideoUpdating } =
    useUpdateLessonVideo()

  const form = useForm<LessonVideoPayload>({
    resolver: zodResolver(lessonVideoSchema),
    defaultValues:
      isEdit && lessonVideoData?.data
        ? {
            title: lessonVideoData.data.title,
            content: lessonVideoData.data.content,
            is_free_preview: Boolean(lessonVideoData.data.is_free_preview),
            isEdit: true,
          }
        : {
            title: '',
            content: '',
            is_free_preview: false,
            isEdit: false,
          },
    disabled:
      !isDraftOrRejected || isLessonVideoCreating || isLessonVideoUpdating,
  })

  useEffect(() => {
    if (isDraftOrRejected && !uploadUrlData) {
      refetchUploadUrl()
    }

    if (uploadUrlData?.data?.id) {
      setUploadId(uploadUrlData.data.id)
      console.log('Upload ID set:', uploadUrlData.data.id)
    }
  }, [isDraftOrRejected, uploadUrlData, refetchUploadUrl])

  useEffect(() => {
    if (videoInfoData && videoInfoData.data) {
      setMuxPlaybackId(videoInfoData.data.playback_id)
      setMuxAssetId(videoInfoData.data.asset_id)
      setDuration(videoInfoData.data.duration)
      setUploading(false)
    }
  }, [videoInfoData])

  useEffect(() => {
    if (isEdit && lessonVideoData?.data) {
      const { title, content, is_free_preview, lessonable } =
        lessonVideoData.data

      form.reset({
        title,
        content,
        is_free_preview: is_free_preview || false,
      })

      form.setValue('isEdit', true)

      if (lessonable?.mux_playback_id) {
        setMuxPlaybackId(lessonable.mux_playback_id)
      }

      if (lessonable?.mux_asset_id) {
        setMuxAssetId(lessonable.mux_asset_id)
      }

      if (lessonable?.duration) {
        setDuration(lessonable.duration)
      }
    }
  }, [isEdit, lessonVideoData, form])

  useEffect(() => {
    if (!isEdit) {
      resetVideoStates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit])

  const handleMuxUploadStart = useCallback(() => {
    setUploading(true)
    toast.info('Đang bắt đầu tải lên video')
  }, [])

  const handleMuxUploadSuccess = useCallback(async () => {
    if (!uploadId) {
      setUploading(false)
      toast.error('Không có ID tải lên, vui lòng thử lại')
      return
    }

    const pollVideoStatus = async (retries = 0) => {
      if (retries >= 10) {
        setUploading(false)
        toast.error('Quá thời gian xử lý video')
        return
      }

      try {
        const result = await refetchVideoInfo()

        if (!result.data || !result.data.data) {
          console.log(
            `Video đang xử lý, thử lại sau 3s (lần ${retries + 1}/10)`
          )
          setTimeout(() => pollVideoStatus(retries + 1), 3000)
        }
      } catch (error) {
        console.error('Error polling video status:', error)
        if (retries < 10) {
          setTimeout(() => pollVideoStatus(retries + 1), 3000)
        } else {
          setUploading(false)
          toast.error('Lỗi khi kiểm tra trạng thái video')
        }
      }
    }

    pollVideoStatus()
  }, [uploadId, refetchVideoInfo])

  const handleMuxUploadError = useCallback((event: any) => {
    console.error('Mux upload error:', event)
    setUploading(false)
    toast.error('Tải lên video thất bại')
  }, [])

  const handleResetVideo = useCallback(() => {
    setMuxPlaybackId(null)
    setMuxAssetId(null)
    setDuration(null)
    refetchUploadUrl()
  }, [refetchUploadUrl])

  const handleMediaSelect = useCallback(
    (playback_id: string, asset_id: string | undefined) => {
      if (!asset_id) {
        toast.error('Không tìm thấy asset ID cho video này')
        return
      }

      setMuxPlaybackId(playback_id)
      setMuxAssetId(asset_id)
      toast.success('Đã chọn video từ thư viện')
    },
    []
  )

  const resetVideoStates = () => {
    setMuxPlaybackId(null)
    setMuxAssetId(null)
    setDuration(null)
    setUploading(false)
    refetchUploadUrl()
  }

  const onsubmit = (data: LessonVideoPayload) => {
    if (!chapterId) {
      toast.error('Không tìm thấy thông tin chương học')
      return
    }

    if (!isEdit && !muxPlaybackId) {
      toast.error('Vui lòng thêm video trước khi lưu')
      return
    }

    if (isLessonVideoCreating || isLessonVideoUpdating) return

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('is_free_preview', data.is_free_preview ? '1' : '0')
    formData.append('chapter_id', String(chapterId))

    if (muxAssetId) {
      formData.append('mux_asset_id', muxAssetId)
    }

    if (muxPlaybackId) {
      formData.append('mux_playback_id', muxPlaybackId)
    }

    if (duration !== null) {
      formData.append('duration', String(duration))
    }

    if (isEdit) {
      formData.append('_method', 'PUT')
    }

    if (isEdit && lessonId) {
      updateLessonVideo(
        {
          chapterId,
          lessonId,
          payload: formData,
        },
        {
          onSuccess: () => {
            onHide()
            resetVideoStates()
          },
        }
      )
    } else {
      createLessonVideo(
        { chapterId, payload: formData },
        {
          onSuccess: () => {
            form.reset()
            onHide()
            resetVideoStates()
          },
        }
      )
    }
  }

  if (isLessonLoading) {
    return <Loader2 className="mx-auto animate-spin text-muted-foreground" />
  }

  return (
    <>
      <h2 className="font-semibold">
        {isDraftOrRejected ? (isEdit ? 'Cập nhật' : 'Thêm') : 'Thông tin'} bài
        giảng
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
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
            <div className="mt-2">
              <h3 className="mb-2 text-sm font-medium">Video bài giảng</h3>

              <div className="flex flex-col rounded-md border-2 border-dashed border-gray-300 p-5">
                {muxPlaybackId ? (
                  <>
                    <MuxPlayer
                      loading="page"
                      playbackId={muxPlaybackId}
                      autoPlay={false}
                      className="aspect-video w-full"
                      accentColor="hsl(var(--primary))"
                    />

                    {isDraftOrRejected && (
                      <Button
                        onClick={handleResetVideo}
                        type="button"
                        variant="outline"
                        className="mt-4 w-full sm:w-auto"
                        disabled={
                          isLessonVideoCreating || isLessonVideoUpdating
                        }
                      >
                        Thay đổi bài giảng
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="w-full space-y-4">
                    <Tabs
                      defaultValue="upload"
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                          value="upload"
                          className="flex items-center gap-2"
                        >
                          <Upload className="size-4" />
                          <span>Tải lên</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="library"
                          className="flex items-center gap-2"
                        >
                          <FolderOpen className="size-4" />
                          <span>Thư viện</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="upload" className="py-4">
                        {uploadUrlData?.data?.url ? (
                          <>
                            <p className="mb-4 text-center text-sm">
                              Kéo và thả hoặc tải lên video bài giảng (MP4, AVI,
                              MKV)
                            </p>
                            <MuxUploader
                              endpoint={uploadUrlData.data.url}
                              onUploadStart={handleMuxUploadStart}
                              onSuccess={handleMuxUploadSuccess}
                              onUploadError={handleMuxUploadError}
                              maxFileSize={1073741824}
                              className="w-full"
                            />
                          </>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="size-4 animate-spin" />
                            <p className="text-sm text-muted-foreground">
                              Đang khởi tạo trình tải lên...
                            </p>
                          </div>
                        )}

                        {uploading && (
                          <div className="mt-4 flex items-center justify-center space-x-2">
                            <Loader2 className="size-4 animate-spin" />
                            <p className="text-sm text-muted-foreground">
                              Đang xử lý video, vui lòng đợi...
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent
                        value="library"
                        className="flex flex-col items-center justify-center py-8"
                      >
                        <div className="mb-4 text-center">
                          <h4 className="text-sm font-medium">
                            Chọn từ thư viện video của bạn
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Sử dụng lại video đã có sẵn trong thư viện
                          </p>
                        </div>

                        <Dialog
                          open={mediaLibraryOpen}
                          onOpenChange={setMediaLibraryOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <FolderOpen className="size-4" />
                              Mở thư viện
                            </Button>
                          </DialogTrigger>

                          <MediaLibraryDialog
                            open={mediaLibraryOpen}
                            onOpenChange={setMediaLibraryOpen}
                            onSelectMedia={handleMediaSelect}
                          />
                        </Dialog>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="is_free_preview"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Cho phép xem trước</FormLabel>
                  <FormDescription>
                    Học viên có thể xem trước nội dung bài học
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={field.disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isDraftOrRejected && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  isLessonVideoCreating ||
                  isLessonVideoUpdating ||
                  uploading ||
                  (!isEdit && !muxPlaybackId)
                }
              >
                {(isLessonVideoCreating || isLessonVideoUpdating) && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {isEdit ? 'Cập nhật' : 'Thêm bài học'}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  )
}

export default LessonVideo
