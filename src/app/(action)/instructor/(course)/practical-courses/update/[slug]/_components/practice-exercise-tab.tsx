import { UniqueIdentifier } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import {
  CircleHelp,
  CirclePlus,
  CircleX,
  GripVertical,
  Loader2,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import {
  useDeleteLesson,
  useUpdateOrderLesson,
} from '@/hooks/instructor/lesson/useLesson'
import { IChapter, ILesson } from '@/types'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '@/components/ui/sortable'
import { cn } from '@/lib/utils'
import { useCourseStatusStore } from '@/stores/use-course-status-store'
import LessonQuiz from '../../../../courses/update/[slug]/_components/lesson/lesson-quiz'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface Props {
  chapter: IChapter
  slug: string
}

export const PracticeExerciseTab = ({ chapter, slug }: Props) => {
  const { isDraftOrRejected, modificationRequest } = useCourseStatusStore()

  const [addNewLesson, setAddNewLesson] = useState(false)
  const [lessons, setLessons] = useState<ILesson[]>([])
  const [lessonEdit, setLessonEdit] = useState<number | null>(null)

  const { mutate: updateLessonOrder, isPending: isUpdateOrder } =
    useUpdateOrderLesson()
  const { mutate: deleteLesson, isPending: isDeleting } = useDeleteLesson()

  useEffect(() => {
    setLessons(chapter?.lessons || [])
  }, [chapter?.lessons])

  const onValueChange = (
    data: {
      id: UniqueIdentifier
      value: ILesson
    }[]
  ) => {
    const newLessons = data.map((item) => item.value)

    setLessons(newLessons)

    const payload = newLessons
      .filter((lesson) => lesson.id !== undefined)
      .map((lesson, index) => ({
        id: lesson.id as number,
        order: index + 1,
      }))

    updateLessonOrder({ slug, lessons: payload })
  }

  const canDeleteLesson = (lesson: ILesson) => {
    if (isDraftOrRejected && !modificationRequest) {
      return true
    }

    return !!(
      isDraftOrRejected &&
      modificationRequest &&
      lesson.is_supplement === 1
    )
  }

  const handleDeleteLesson = (id: number) => {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa bài học này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLesson(
          {
            chapterId: chapter.id as number,
            id,
          },
          {
            onSettled: () => setLessonEdit(null),
          }
        )
      }
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Bài tập trắc nghiệm</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bắt đầu xây dựng khoá học của bạn bằng cách tạo các hoạt động thực
          hành.
        </p>
      </div>

      <Sortable
        value={lessons.map((lesson) => ({
          id: lesson.id as UniqueIdentifier,
          value: lesson,
        }))}
        onValueChange={onValueChange}
      >
        {lessons.map((lesson) => {
          const isLessonDeletable = canDeleteLesson(lesson)

          return (
            <SortableItem
              key={lesson.id}
              value={lesson.id!}
              disabled={isUpdateOrder}
              asChild
            >
              <Accordion type="single" collapsible className="mb-3">
                <AccordionItem
                  onClick={(e) => e.stopPropagation()}
                  value={`lesson-${lesson.id}`}
                >
                  <AccordionTrigger
                    className={cn('space-x-4 rounded-lg')}
                    onClick={(e) => {
                      if (!lessonEdit || lessonEdit !== lesson.id) {
                        e.stopPropagation()
                        setLessonEdit(lesson.id as number)
                      }
                    }}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CircleHelp className="size-4 shrink-0" />
                        <span>
                          Bài {lesson.order}: {lesson.title}
                        </span>
                        {lesson.is_supplement === 1 && (
                          <div className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 px-2 py-0.5 text-xs font-medium text-white shadow-sm ring-1 ring-amber-500/20">
                            Bài bổ sung
                          </div>
                        )}
                      </div>
                      {isDraftOrRejected && (
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SortableDragHandle>
                                  <GripVertical />
                                </SortableDragHandle>
                              </TooltipTrigger>
                              <TooltipContent> Kéo để sắp xếp</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-destructive hover:text-destructive/80"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setLessonEdit(lesson.id as number)
                                    handleDeleteLesson(lesson.id as number)
                                  }}
                                  disabled={
                                    (isDeleting && lessonEdit === lesson.id) ||
                                    !isLessonDeletable
                                  }
                                >
                                  {isDeleting && lessonEdit === lesson.id ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    <Trash2 />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {isLessonDeletable
                                  ? 'Xóa bài học'
                                  : 'Không thể xóa bài học này'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="mt-2 space-y-4 rounded-lg p-4">
                    <LessonQuiz
                      isEdit={lessonEdit === lesson.id}
                      chapterId={chapter.id}
                      onHide={() => setLessonEdit(null)}
                      quizId={lesson.lessonable_id}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SortableItem>
          )
        })}
      </Sortable>

      {chapter?.lessons && (
        <Button
          disabled={!isDraftOrRejected}
          onClick={() => setAddNewLesson((prev) => !prev)}
          variant={addNewLesson ? 'outline' : 'default'}
        >
          <motion.div
            animate={{ rotate: addNewLesson ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {addNewLesson ? <CircleX /> : <CirclePlus />}
          </motion.div>
          {addNewLesson ? 'Đóng' : 'Thêm bài học'}
        </Button>
      )}

      {addNewLesson && (
        <div className="flex h-full flex-col justify-between space-y-4 rounded-lg border p-4">
          <LessonQuiz
            onHide={() => setAddNewLesson(false)}
            chapterId={chapter.id}
          />
        </div>
      )}
    </div>
  )
}
