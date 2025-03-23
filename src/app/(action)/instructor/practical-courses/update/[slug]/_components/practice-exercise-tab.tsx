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
import LessonQuiz from '@/sections/instructor/components/courses-update/lesson/lesson-quiz'
import { useCourseStatusStore } from '@/stores/use-course-status-store'

export interface Props {
  chapter: IChapter
  slug: string
}

export const PracticeExerciseTab = ({ chapter, slug }: Props) => {
  const { isDraftOrRejected } = useCourseStatusStore()

  const [addNewLesson, setAddNewLesson] = useState(false)
  const [lessons, setLessons] = useState<ILesson[]>([])
  const [lessonEdit, setLessonEdit] = useState<number | null>(null)

  const { mutate: updateLessonOrder, isPending: isUpdateOrder } =
    useUpdateOrderLesson()
  const { mutate: deleteLesson, isPending: isDeleting } = useDeleteLesson()

  useEffect(() => {
    setLessons(chapter?.lessons || [])
  }, [chapter.lessons])

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
        <h1 className="text-xl font-bold">Bài tập thực hành</h1>
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
                      </div>
                      {isDraftOrRejected && (
                        <div className="flex items-center gap-2">
                          <SortableDragHandle>
                            <GripVertical />
                          </SortableDragHandle>

                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive/80"
                            onClick={(e) => {
                              e.stopPropagation()
                              setLessonEdit(lesson.id as number)
                              handleDeleteLesson(lesson.id as number)
                            }}
                            disabled={isDeleting && lessonEdit === lesson.id}
                          >
                            {isDeleting && lessonEdit === lesson.id ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Trash2 />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="mt-2 space-y-4 rounded-lg p-4">
                    <LessonQuiz
                      isEdit={lessonEdit === lesson.id}
                      chapterId={chapter ? String(chapter.id) : ''}
                      onHide={() => setLessonEdit(null)}
                      quizId={lesson.lessonable_id as string | undefined}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SortableItem>
          )
        })}
      </Sortable>

      <Button
        disabled={!isDraftOrRejected}
        onClick={() => {
          setAddNewLesson((prev) => !prev)
        }}
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

      {addNewLesson && (
        <div className="flex h-full flex-col justify-between space-y-4 rounded-lg border p-4">
          <LessonQuiz
            onHide={() => setAddNewLesson(false)}
            chapterId={chapter ? String(chapter.id) : ''}
          />
        </div>
      )}
    </div>
  )
}
