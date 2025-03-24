import { UniqueIdentifier } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import {
  CircleHelp,
  CirclePlay,
  CirclePlus,
  CircleX,
  FileCode2,
  GripVertical,
  Loader2,
  ScrollText,
  SquarePen,
  Trash2,
  Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import {
  useDeleteLesson,
  useUpdateOrderLesson,
} from '@/hooks/instructor/lesson/useLesson'
import { IChapter, ILesson, LessonType } from '@/types'

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
import CreateLesson from '@/sections/instructor/components/courses-update/lesson/create-lesson'
import LessonDocument from '@/sections/instructor/components/courses-update/lesson/lesson-document'
import LessonQuiz from '@/sections/instructor/components/courses-update/lesson/lesson-quiz'
import LessonVideo from '@/sections/instructor/components/courses-update/lesson/lesson-video'
import { useCourseStatusStore } from '@/stores/use-course-status-store'

export interface Props {
  chapter: IChapter
  slug: string
}

const SortableLesson = ({ chapter, slug }: Props) => {
  const router = useRouter()

  const typeIndexMap = { video: 0, document: 0, quiz: 0, coding: 0 }

  const [addNewLesson, setAddNewLesson] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<LessonType>()
  const [lessons, setLessons] = useState<ILesson[]>([])
  const [lessonEdit, setLessonEdit] = useState<number | null>(null)

  const { isDraftOrRejected } = useCourseStatusStore()

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
    <>
      <Sortable
        value={lessons.map((lesson) => ({
          id: lesson.id as UniqueIdentifier,
          value: lesson,
        }))}
        onValueChange={onValueChange}
      >
        {lessons.map((lesson) => {
          if (lesson.type) {
            typeIndexMap[lesson.type]++
          }
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
                    className={cn(
                      'space-x-4 rounded-lg py-2',
                      lesson.type === 'coding' && 'cursor-default'
                    )}
                    onClick={(e) => {
                      if (!lessonEdit || lessonEdit !== lesson.id) {
                        e.stopPropagation()
                        setLessonEdit(lesson.id as number)
                      }
                    }}
                    // disabled={lesson.type === 'coding'}
                    hideArrow={lesson.type === 'coding'}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {(() => {
                          switch (lesson?.type) {
                            case 'video':
                              return <CirclePlay className="size-4 shrink-0" />
                            case 'document':
                              return <ScrollText className="size-4 shrink-0" />
                            case 'quiz':
                              return <CircleHelp className="size-4 shrink-0" />
                            case 'coding':
                              return <FileCode2 className="size-4 shrink-0" />
                            default:
                              return <SquarePen className="size-4 shrink-0" />
                          }
                        })()}
                        <div>
                          {(() => {
                            switch (lesson?.type) {
                              case 'video':
                                return 'Bài giảng'
                              case 'document':
                                return 'Tài liệu'
                              case 'quiz':
                                return 'Câu hỏi'
                              case 'coding':
                                return 'Bài tập'
                              default:
                                return 'Bài giảng'
                            }
                          })()}{' '}
                          {lesson?.type ? typeIndexMap[lesson?.type] : ''}:{' '}
                          {lesson.title}
                        </div>
                      </div>
                      {isDraftOrRejected && (
                        <div className="flex items-center gap-2">
                          {lesson.type === 'coding' && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                router.push(
                                  `/course/${lesson.slug}/coding-exercise?coding=${lesson.lessonable_id}`
                                )
                              }}
                            >
                              <SquarePen />
                            </Button>
                          )}
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
                  {lessonEdit === lesson.id &&
                    lesson.type &&
                    lesson.type !== 'coding' && (
                      <AccordionContent className="mt-2 space-y-4 rounded-lg p-4">
                        {(() => {
                          switch (lesson.type) {
                            case 'video':
                              return (
                                <LessonVideo
                                  isEdit={lessonEdit === lesson.id}
                                  chapterId={chapter ? String(chapter.id) : ''}
                                  onHide={() => setLessonEdit(null)}
                                  lessonId={lesson?.id}
                                />
                              )
                            case 'document':
                              return (
                                <LessonDocument
                                  lessonId={lesson?.id}
                                  chapterId={chapter ? String(chapter.id) : ''}
                                  onHide={() => setLessonEdit(null)}
                                />
                              )
                            case 'quiz':
                              return (
                                <LessonQuiz
                                  isEdit={lessonEdit === lesson.id}
                                  chapterId={chapter ? String(chapter.id) : ''}
                                  onHide={() => setLessonEdit(null)}
                                  quizId={lesson.lessonable_id}
                                />
                              )
                          }
                        })()}
                      </AccordionContent>
                    )}
                </AccordionItem>
              </Accordion>
            </SortableItem>
          )
        })}
      </Sortable>

      <div className="mt-3 flex items-center gap-2">
        <Button
          disabled={!isDraftOrRejected}
          onClick={() => {
            setAddNewLesson((prev) => !prev)
            setSelectedLesson(undefined)
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
      </div>

      <div className="mt-3">
        {addNewLesson &&
          (selectedLesson ? (
            <CreateLesson
              onHide={() => {
                setSelectedLesson(undefined)
                setAddNewLesson(false)
              }}
              type={selectedLesson!}
              chapterId={String(chapter.id!)}
            />
          ) : (
            <div className="grid gap-4 rounded-lg border border-dashed p-2 md:grid-cols-2 lg:grid-cols-4 xl:gap-8">
              <Button onClick={() => setSelectedLesson('video')}>
                <Video />
                Bài giảng
              </Button>
              <Button onClick={() => setSelectedLesson('document')}>
                <ScrollText />
                Tài liệu
              </Button>
              <Button onClick={() => setSelectedLesson('quiz')}>
                <CircleHelp />
                Câu hỏi
              </Button>
              <Button onClick={() => setSelectedLesson('coding')}>
                <FileCode2 />
                Bài tập
              </Button>
            </div>
          ))}
      </div>
    </>
  )
}

export default SortableLesson
