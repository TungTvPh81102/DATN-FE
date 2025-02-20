import React, { useState } from 'react'
import { CircleCheck, CircleX, SquarePen, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { IChapter } from '@/types'
import {
  useDeleteChapter,
  useUpdateChapter,
} from '@/hooks/instructor/chapter/useChapter'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DraggableHandle from '@/sections/instructor/_components/courses-update/_components/draggable-handle'
import DraggableContent from '@/sections/instructor/_components/courses-update/lesson/_components/draggable-content'

import CreateChapter from './chapter/create-chapter'

type Props = {
  chapters: IChapter[]
  slug: string
  courseStatus?: string
}

const CourseChapterTab = ({ chapters, slug, courseStatus }: Props) => {
  const [addNewChapter, setAddNewChapter] = useState(false)
  const [chapterEdit, setChapterEdit] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState<string>('')

  const { mutate: updateChapter } = useUpdateChapter()
  const { mutate: deleteChapter } = useDeleteChapter()

  console.log(courseStatus)

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
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteChapter({ slug, id })
      }
    })
  }

  return (
    <div className="rounded-md">
      <div>
        <h1 className="text-xl font-bold">Chương trình giảng dạy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bắt đầu xây dựng khoá học của bạn bằng cách tạo các phần bài giảng và
          các hoạt động thực hành.
        </p>
      </div>
      <div className="mt-4">
        <div className="space-y-6">
          {chapters?.map((chapter, chapterIndex) => (
            <div key={chapter.id}>
              <Accordion
                type="single"
                collapsible={!chapterEdit}
                key={chapterIndex}
              >
                <AccordionItem value={`${chapter.id}`}>
                  <AccordionTrigger className="rounded-lg">
                    <div className="flex w-full items-center gap-4">
                      <div className="flex w-full items-center gap-2">
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
                              <span
                                className="flex size-8 items-center justify-center rounded-md border border-[#131316]"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdateChapter(chapter.id as number)
                                }}
                              >
                                <CircleCheck size={14} />
                              </span>
                              <span
                                className="flex size-8 items-center justify-center rounded-md border border-[#131316]"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setChapterEdit(null)
                                }}
                              >
                                <CircleX size={14} />
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              Chương {chapterIndex + 1}: {chapter.title}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="flex size-8 items-center justify-center rounded-md border border-[#131316]"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setChapterEdit(chapter.id as number)
                                  setEditTitle(chapter.title || '')
                                }}
                              >
                                <SquarePen size={14} />
                              </span>
                              {(courseStatus === 'draft' ||
                                courseStatus === 'reject') && (
                                <span
                                  className="flex size-8 items-center justify-center rounded-md border border-[#131316]"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteChapter(chapter.id as number)
                                  }}
                                >
                                  <Trash2 size={14} />
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="ml-auto mr-4">
                        <DraggableHandle />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <DraggableContent
                    courseStatus={courseStatus}
                    chapter={chapter}
                    slug={slug}
                  />
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
        {addNewChapter ? (
          <CreateChapter onHide={() => setAddNewChapter(false)} />
        ) : (
          <>
            <Button
              disabled={courseStatus !== 'draft'}
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
