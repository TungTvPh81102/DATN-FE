'use client'

import { useEffect, useState } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import {
  CircleCheck,
  CircleX,
  GripVertical,
  Loader2,
  SquarePen,
  Trash2,
} from 'lucide-react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { CourseStatus, IChapter } from '@/types'
import {
  useDeleteChapter,
  useUpdateChapter,
  useUpdateChapterOrder,
} from '@/hooks/instructor/chapter/useChapter'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '@/components/ui/sortable'

import CreateChapter from './chapter/create-chapter'
import Link from 'next/link'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import SortableLesson from './lesson/sortable-lesson'

type Props = {
  chapters: IChapter[]
  slug: string
}

const CourseChapterTab = ({ chapters: chapterList, slug }: Props) => {
  const [chapters, setChapters] = useState<IChapter[]>([])
  const [addNewChapter, setAddNewChapter] = useState(false)
  const [chapterEdit, setChapterEdit] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState<string>('')

  const { courseStatus, isDraftOrRejected } = useCourseStatusStore()

  const { mutate: updateChapter } = useUpdateChapter()
  const { mutate: deleteChapter, isPending: isDeleting } = useDeleteChapter()
  const { mutate: updateChapterOrder, isPending: isUpdateOrder } =
    useUpdateChapterOrder()

  const handleUpdateChapter = (id: number) => {
    if (!editTitle.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Vui lòng nhập tên chương',
      })

      return
    }

    if (editTitle !== chapters.find((chapter) => chapter.id === id)?.title) {
      updateChapter(
        { slug, id, data: { title: editTitle } },
        {
          onSuccess: () => {
            setChapterEdit(null)
            setEditTitle('')
          },
        }
      )
    } else {
      setChapterEdit(null)
      setEditTitle('')
      toast.info('Dữ liệu không thay đổi')
    }
  }

  const handleDeleteChapter = (id: number) => {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa chương này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteChapter(
          { slug, id },
          {
            onSettled: () => setChapterEdit(null),
          }
        )
      }
    })
  }

  const onValueChange = (
    data: {
      id: UniqueIdentifier
      value: IChapter
    }[]
  ) => {
    const newChapters = data.map((item) => item.value)

    setChapters(newChapters)

    const payload = newChapters
      .filter((chapter) => chapter.id !== undefined)
      .map((chapter, index) => ({
        id: chapter.id as number,
        order: index + 1,
      }))

    updateChapterOrder({ slug, chapters: payload })
  }

  useEffect(() => {
    setChapters(chapterList || [])
  }, [chapterList])

  return (
    <div className="rounded-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Chương trình giảng dạy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Bắt đầu xây dựng khoá học của bạn bằng cách tạo các phần bài giảng
            và các hoạt động thực hành.
          </p>
        </div>

        {isDraftOrRejected && (
          <Button asChild size="sm">
            <Link href={`/draft/${slug}`}>Xem trước</Link>
          </Button>
        )}
      </div>
      <div className="mt-4">
        <Sortable
          value={chapters.map((chapter) => ({
            id: chapter.id as UniqueIdentifier,
            value: chapter,
          }))}
          onValueChange={onValueChange}
        >
          <Accordion type="multiple" className="space-y-6">
            {chapters?.map((chapter, chapterIndex) => (
              <SortableItem
                key={chapter.id}
                value={chapter.id!}
                disabled={isUpdateOrder}
                asChild
              >
                <AccordionItem value={`${chapter.id}`}>
                  <AccordionTrigger className="space-x-4 rounded-lg">
                    <div className="flex w-full items-center justify-between gap-2">
                      {chapterEdit === chapter.id ? (
                        <>
                          <div
                            className="w-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Input
                              placeholder="Nhập tên chương"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUpdateChapter(chapter.id as number)
                              }}
                            >
                              <CircleCheck />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive/80"
                              onClick={(e) => {
                                e.stopPropagation()
                                setChapterEdit(null)
                              }}
                            >
                              <CircleX />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3>
                            Chương {chapterIndex + 1}: {chapter.title}
                          </h3>

                          {isDraftOrRejected && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setChapterEdit(chapter.id as number)
                                  setEditTitle(chapter.title || '')
                                }}
                              >
                                <SquarePen />
                              </Button>

                              <SortableDragHandle>
                                <GripVertical />
                              </SortableDragHandle>

                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive hover:text-destructive/80"
                                disabled={isDeleting}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setChapterEdit(chapter.id as number)
                                  handleDeleteChapter(chapter.id as number)
                                }}
                              >
                                {isDeleting && chapterEdit === chapter.id ? (
                                  <Loader2 className="animate-spin" />
                                ) : (
                                  <Trash2 />
                                )}
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="mt-3 rounded-lg p-4">
                    <SortableLesson chapter={chapter} slug={slug} />
                  </AccordionContent>
                </AccordionItem>
              </SortableItem>
            ))}
          </Accordion>
        </Sortable>

        {addNewChapter ? (
          <CreateChapter onHide={() => setAddNewChapter(false)} />
        ) : (
          <>
            <Button
              disabled={
                courseStatus !== CourseStatus.DRAFT &&
                courseStatus !== CourseStatus.REJECT
              }
              onClick={() => setAddNewChapter(true)}
              className="mt-4"
            >
              <SquarePen size={18} />
              Thêm chương mới
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
export default CourseChapterTab
