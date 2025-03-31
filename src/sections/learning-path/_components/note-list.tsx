import { useQueryClient } from '@tanstack/react-query'
import { FilePenLine, Loader2, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import QueryKey from '@/constants/query-key'
import { useGetChapterFromLesson } from '@/hooks/learning-path/useLearningPath'
import { useDeleteNote, useGetNotes, useUpdateNote } from '@/hooks/note/useNote'
import { formatDuration } from '@/lib/common'

import HtmlRenderer from '@/components/shared/html-renderer'
import { TiptapEditor } from '@/components/tiptap-editor'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import Link from 'next/link'

const NoteList = ({
  open,
  onOpenChange,
  courseSlug,
  lessonId,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
  courseSlug: string
  lessonId: number
}) => {
  const queryClient = useQueryClient()

  const [filters, setFilters] = useState<{
    chapterId: number | null
    sortOrder: 'asc' | 'desc'
  }>({
    chapterId: null,
    sortOrder: 'desc',
  })

  const [isEditNote, setIsEditNote] = useState(false)
  const [selectNote, setSelectNote] = useState<{
    id: string | null
    content: string
  }>({ id: null, content: '' })

  const { data: chapterData } = useGetChapterFromLesson(lessonId)
  const { data: noteData, isLoading } = useGetNotes(courseSlug, filters)

  const { mutate: updateNote, isPending: isPendingUpdateNote } = useUpdateNote()
  const { mutate: deleteNote, isPending: isPendingDeleteNote } = useDeleteNote()

  useEffect(() => {
    if (chapterData?.data.id) {
      setFilters((prev) => ({
        ...prev,
        chapterId: chapterData.data.id,
      }))
    }
  }, [chapterData?.data.id])

  const handleFilterChange = (field: string, value: string | number | null) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleEdit = (id: string, content: string) => {
    setIsEditNote(true)
    setSelectNote({ id, content })
  }

  const handleCancelEdit = () => {
    setIsEditNote(false)
    setSelectNote({ id: null, content: '' })
  }

  const handleSaveNote = () => {
    if (selectNote.id && selectNote.content) {
      const payload = {
        lesson_id: lessonId,
        content: selectNote.content,
      }

      updateNote(
        {
          id: selectNote.id,
          data: payload,
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: [QueryKey.NOTE_LESSON],
            })
            setIsEditNote(false)
          },
          onError: (error: any) => {
            toast.error(error.message)
          },
        }
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="h-screen max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ghi chú của tôi</SheetTitle>
          <SheetDescription>
            <span> Danh sách ghi chú trong khoá học của bạn.</span>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          <div className="mb-4 flex justify-end gap-2">
            <Select
              value={filters.chapterId === null ? 'all' : 'current'}
              onValueChange={(value) => {
                const chapterId =
                  value === 'current' ? chapterData?.data.id : null
                handleFilterChange('chapterId', chapterId)
              }}
              key={filters.chapterId}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tất cả các chương" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả các chương</SelectItem>
                <SelectItem value="current">Chương hiện tại</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => handleFilterChange('sortOrder', value)}
              defaultValue="desc"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mới nhất" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Mới nhất</SelectItem>
                <SelectItem value="asc">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <Loader2 className="mx-auto size-8 animate-spin text-muted-foreground" />
          ) : noteData?.data?.length > 0 ? (
            noteData?.data?.map((note: any) => (
              <div className="mt-6" key={note.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/learning/${courseSlug}/lesson/${note.lesson_id}?time=${note.time}`}
                      onClick={() => onOpenChange(false)}
                    >
                      <Badge>
                        {formatDuration(Math.round(note.time), 'colon')}
                      </Badge>
                    </Link>
                    <Link
                      className="font-bold text-primary hover:text-primary/80"
                      href={`/learning/${courseSlug}/lesson/${note.lesson_id} `}
                      onClick={() => onOpenChange(false)}
                    >
                      <h4>{note.lesson_name}</h4>
                    </Link>
                    <h4 className="font-medium">{note.chapter_name}</h4>
                  </div>
                  <div className="flex gap-2">
                    <FilePenLine
                      size="16"
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => handleEdit(note.id, note.content)}
                    />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Trash
                          size="16"
                          className="cursor-pointer text-muted-foreground hover:text-foreground"
                        />
                      </AlertDialogTrigger>

                      <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa ghi chú</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Ghi chú của bạn sẽ
                            bị xóa vĩnh viễn.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              deleteNote(note.id, {
                                onSuccess: async () => {
                                  await queryClient.invalidateQueries({
                                    queryKey: [QueryKey.NOTE_LESSON],
                                  })
                                },
                                onError: (error: any) => {
                                  toast.error(error.message)
                                },
                              })
                            }
                          >
                            {isPendingDeleteNote && (
                              <Loader2 className="animate-spin" />
                            )}
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {isEditNote && selectNote.id === note.id ? (
                  <div className="mt-4">
                    <TiptapEditor
                      value={selectNote.content}
                      onChange={(value) =>
                        setSelectNote((prev) => ({
                          ...prev,
                          content: value as string,
                        }))
                      }
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        onClick={handleCancelEdit}
                        disabled={isPendingUpdateNote}
                        type="button"
                        variant="outline"
                      >
                        Huỷ bỏ
                      </Button>
                      <Button
                        onClick={handleSaveNote}
                        disabled={isPendingUpdateNote}
                        type="submit"
                      >
                        {isPendingUpdateNote && (
                          <Loader2 className="animate-spin" />
                        )}
                        Lưu
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 rounded-md bg-gray-100 p-4 shadow">
                    <HtmlRenderer html={note.content} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="mt-12 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-gray-100 p-6 shadow">
                <Trash size="32" className="text-gray-400" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-700">
                Không có ghi chú nào
              </h2>
              <p className="mt-2 text-gray-500">
                Hãy tạo ghi chú mới để theo dõi nội dung bài học của bạn!
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default NoteList
