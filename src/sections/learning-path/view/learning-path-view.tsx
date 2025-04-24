'use client'

import LearningProcess from '@/components/common/LearningProcess'
import ModalLoading from '@/components/common/ModalLoading'
import LearningTour from '@/components/shared/learning-tour'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { lessonTypeIcons } from '@/configs'
import {
  useGetLessonDetail,
  useGetLessons,
  useLessonAccess,
  usePrefetchLessonDetail,
  useUpdateLastTime,
} from '@/hooks/learning-path/useLearningPath'
import { useCheckCourseRatingState } from '@/hooks/rating/useRating'
import { useDownloadCertificate, useGetProgress } from '@/hooks/user/useUser'
import { formatDuration } from '@/lib/common'
import { cn } from '@/lib/utils'
import AIChatAssistant from '@/sections/learning-path/_components/ai-chat-assistant'
import CommentLesson from '@/sections/learning-path/_components/comment-lesson'
import EvaluationCourse from '@/sections/learning-path/_components/evaluation-course'
import LessonContent from '@/sections/learning-path/_components/lesson-content'
import NoteList from '@/sections/learning-path/_components/note-list'
import { useCurrentTimeStore } from '@/stores/use-current-time-store'
import { Level } from '@/types'
import { LearningPathLesson } from '@/types/LearningPath'
import {
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Lock,
  Notebook,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { PracticeExercise } from '../_components/practice-exercise'
import { useQueryClient } from '@tanstack/react-query'
import QueryKey from '@/constants/query-key'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Props = {
  courseSlug: string
  lessonId: number
}

const LearningPathView = ({ courseSlug, lessonId }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const [hasAlerted, setHasAlerted] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [runTour, setRunTour] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showAccessAlert, setShowAccessAlert] = useState(false)

  const { data: lessons, isLoading: isLessonLoading } =
    useGetLessons(courseSlug)
  const {
    chapter_lessons,
    course_name,
    total_lesson,
    course_status,
    is_practical_course,
  } = lessons || {}

  const { data: lessonDetail, isLoading: isLessonDetailLoading } =
    useGetLessonDetail({ courseSlug, lessonId })
  const { data: accessData, isLoading: isAccessLoading } = useLessonAccess({
    courseSlug,
    lessonId,
  })

  const { prefetch } = usePrefetchLessonDetail({
    courseSlug,
    lessonId: lessonDetail?.next_lesson?.id,
  })

  const isCompleted = !!lessonDetail?.lesson_process?.is_completed
  const lastTimeVideo = lessonDetail?.lesson_process?.last_time_video

  const { data: progress } = useGetProgress(courseSlug)
  const { data: checkCourseRatingState } = useCheckCourseRatingState(courseSlug)
  const { data: certificateLink } = useDownloadCertificate(courseSlug, progress)

  const currentTime = useCurrentTimeStore((state) => state.currentTime)
  const { mutate: updateLastTime } = useUpdateLastTime()

  useEffect(() => {
    if (
      !isAccessLoading &&
      accessData &&
      !accessData.can_access &&
      lessons?.level === 'advanced'
    ) {
      setShowAccessAlert(true)
    }
  }, [accessData, isAccessLoading, lessons?.level])

  const handleUpdateLastTime = () => {
    const lesson = lessonDetail?.lesson

    if (lesson?.type !== 'video' || currentTime === lastTimeVideo) return

    queryClient.invalidateQueries({
      queryKey: [QueryKey.LEARNING_PATH_LESSON, courseSlug, lessonId],
    })

    updateLastTime({
      lesson_id: lesson.id,
      last_time_video: currentTime,
    })
  }

  const getLessonDuration = (lesson: LearningPathLesson) => {
    switch (lesson.type) {
      case 'video':
        return lesson.lessonable?.duration as number
      case 'coding':
        return 300
      case 'quiz':
        return (lesson?.total_questions ?? 0) * 30
      default:
        return 10
    }
  }

  const getChapterProgress = (lessons: LearningPathLesson[]) => {
    return lessons.reduce((acc, lesson) => {
      return acc + (lesson.is_completed ? 1 : 0)
    }, 0)
  }

  const courseProgress = useMemo(
    () =>
      chapter_lessons?.reduce((acc, chapter) => {
        return acc + getChapterProgress(chapter.lessons)
      }, 0),
    [chapter_lessons]
  )

  useEffect(() => {
    if (
      !hasAlerted &&
      (course_status === 'draft' || course_status === 'pending')
    ) {
      setHasAlerted(true)
      Swal.fire({
        title: 'Thông báo',
        text: 'Khoá học đang được chỉnh sửa nội dung, vui lòng quay lại sau.',
        icon: 'warning',
        confirmButtonText: 'Đồng ý',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/my-courses')
        }
      })
    }
  }, [course_status, hasAlerted, router])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (lessonDetail?.next_lesson?.id) {
      timeout = setTimeout(() => {
        prefetch()
      }, 5000)
    }

    return () => {
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonDetail?.next_lesson?.id])

  if (isLessonLoading || isLessonDetailLoading) return <ModalLoading />

  if (!lessons) {
    router.replace(`/not-found`)
    return
  }

  return (
    <>
      <LearningTour isRunning={runTour} onClose={() => setRunTour(false)} />

      <div className="fixed bottom-4 left-6 z-50">
        {progress === 100 && checkCourseRatingState && (
          <EvaluationCourse courseSlug={courseSlug} />
        )}
      </div>

      <div className="relative flex min-h-screen flex-col">
        <TooltipProvider>
          <div className="fixed inset-x-0 top-0 z-10 h-16 bg-[#292f3b] text-primary-foreground">
            <div className="flex h-full items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <Link
                  href={'/my-courses'}
                  className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                >
                  <ChevronLeft size={20} />
                </Link>
                <Image
                  src="/images/Logo.png"
                  className="rounded-md shadow-sm"
                  alt="logo"
                  width={40}
                  height={40}
                />
                <p className="course-title font-bold">{course_name}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="learning-progress flex items-center gap-2">
                  <LearningProcess value={progress ?? 0} />
                  <span className="text-sm">
                    <span className="font-bold">
                      {courseProgress}/{total_lesson}
                    </span>{' '}
                    bài học
                  </span>
                  {progress === 100 && certificateLink && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={certificateLink ?? '#'}
                          target="_blank"
                          className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-md"
                        >
                          <Award size={18} />
                          Chứng chỉ
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className="mt-2">
                        Xem chứng chỉ của bạn
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div
                  onClick={() => setIsSheetOpen(true)}
                  className="note-button flex cursor-pointer items-center gap-1 opacity-75 hover:opacity-100"
                >
                  <Notebook size={18} />
                  <span className="text-sm font-normal">Ghi chú</span>
                </div>
                <div
                  onClick={() => setRunTour(true)}
                  className="flex cursor-pointer items-center gap-1 opacity-75 hover:opacity-100"
                >
                  <CircleHelp size={18} />
                  <span className="text-sm font-normal">Hướng dẫn</span>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-x-0 inset-y-16 grid grid-cols-12 overflow-hidden">
            <div
              className={cn(
                'lesson-content overflow-y-auto transition-all duration-300',
                isSidebarCollapsed ? 'col-span-12' : 'col-span-9'
              )}
            >
              {lessonDetail &&
                (!is_practical_course ? (
                  <LessonContent
                    lesson={lessonDetail.lesson}
                    isCompleted={isCompleted}
                    lastTimeVideo={lastTimeVideo}
                  />
                ) : (
                  <PracticeExercise
                    lesson={lessonDetail.lesson}
                    isCompleted={isCompleted}
                    courseSlug={courseSlug}
                    nextLessonId={lessonDetail?.next_lesson?.id}
                  />
                ))}
            </div>

            <div
              className={cn(
                'course-content overflow-y-auto border-l-2 transition-all duration-300',
                isSidebarCollapsed ? 'hidden' : 'col-span-3'
              )}
            >
              <div className="flex items-center justify-between border-b-2 p-4">
                <h2 className="font-bold">Nội dung khoá học</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1"
                      onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                      <PanelLeftClose size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Đóng nội dung</TooltipContent>
                </Tooltip>
              </div>

              {!is_practical_course ? (
                <Accordion
                  type="multiple"
                  defaultValue={[`chapter-${lessonDetail?.lesson?.chapter_id}`]}
                >
                  {chapter_lessons?.map((chapter, chapterIndex) => {
                    const duration = chapter?.lessons.reduce(
                      (acc, lesson) => acc + getLessonDuration(lesson),
                      0
                    )
                    return (
                      <AccordionItem
                        key={chapterIndex}
                        value={`chapter-${chapter.chapter_id}`}
                        className="border-b-2"
                      >
                        <AccordionTrigger className="border-0 hover:bg-gray-200">
                          <div>
                            <h3 className="font-semibold">
                              {chapterIndex + 1}. {chapter.chapter_title}
                            </h3>
                            <p className="mt-1 text-xs font-light">
                              {getChapterProgress(chapter.lessons)}/
                              {chapter?.lessons.length} |{' '}
                              {formatDuration(duration, 'colon')}
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="m-0 border-0 p-0">
                          {chapter?.lessons?.map((lesson, lessonIndex) => {
                            const isSelected =
                              lesson?.id === lessonDetail?.lesson?.id
                            return (
                              <div
                                onClick={() => {
                                  if (lesson.is_unlocked) {
                                    handleUpdateLastTime()
                                    router.push(
                                      `/learning/${courseSlug}/lesson/${lesson?.id}`
                                    )
                                  }
                                }}
                                className={cn(
                                  `flex cursor-default items-center space-x-3 border-t-2 p-3 pr-4 transition-colors duration-300`,
                                  isSelected
                                    ? 'bg-orange-100'
                                    : lesson.is_unlocked
                                      ? 'hover:cursor-pointer hover:bg-gray-200'
                                      : 'bg-muted'
                                )}
                                key={lessonIndex}
                              >
                                <div className="ml-2 w-full flex-1 space-y-1">
                                  <h4>
                                    {chapterIndex + 1}.{lessonIndex + 1}{' '}
                                    {lesson?.title}
                                  </h4>
                                  <div className="flex items-center gap-1 text-xs font-light [&_svg]:size-3">
                                    {lessonTypeIcons[lesson?.type]}{' '}
                                    {formatDuration(
                                      getLessonDuration(lesson),
                                      'colon'
                                    )}
                                  </div>
                                </div>

                                <div className="size-5 *:size-full">
                                  {!lesson.is_unlocked ? (
                                    <Lock className="text-muted-foreground" />
                                  ) : lesson.is_completed ? (
                                    <CheckCircle className="text-green-500" />
                                  ) : null}
                                </div>
                              </div>
                            )
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              ) : (
                chapter_lessons?.[0]?.lessons?.map((lesson, lessonIndex) => {
                  const isSelected = lesson?.id === lessonDetail?.lesson?.id
                  return (
                    <div
                      onClick={() => {
                        if (lesson.is_unlocked) {
                          router.push(
                            `/learning/${courseSlug}/lesson/${lesson?.id}`
                          )
                        }
                      }}
                      className={cn(
                        `flex cursor-default items-center space-x-3 border-b-2 p-3 pr-4 transition-colors duration-300`,
                        isSelected
                          ? 'bg-orange-100'
                          : lesson.is_unlocked
                            ? 'hover:cursor-pointer hover:bg-gray-200'
                            : 'bg-muted'
                      )}
                      key={lessonIndex}
                    >
                      <div className="ml-2 w-full flex-1 space-y-1">
                        <h4 className="font-semibold">
                          {lessonIndex + 1} {lesson?.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs font-light [&_svg]:size-3">
                          {lessonTypeIcons[lesson?.type]}{' '}
                          {lesson.total_questions ?? 0} câu hỏi
                        </div>
                      </div>

                      <div className="size-5 *:size-full">
                        {!lesson.is_unlocked ? (
                          <Lock className="text-muted-foreground" />
                        ) : lesson.is_completed ? (
                          <CheckCircle className="text-green-500" />
                        ) : null}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {isSidebarCollapsed && (
            <div className="fixed right-4 top-20 z-20">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="size-10 rounded-full p-2 shadow-md"
                    onClick={() => setIsSidebarCollapsed(false)}
                  >
                    <PanelLeftOpen size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Mở nội dung</TooltipContent>
              </Tooltip>
            </div>
          )}
        </TooltipProvider>

        <div className="navigation-buttons fixed inset-x-0 bottom-0 z-10 h-16 bg-accent">
          <div className="container mx-auto flex h-full items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-primary font-semibold text-primary hover:text-primary/80 [&_svg]:size-5"
              disabled={!lessonDetail?.previous_lesson}
              onClick={() => {
                if (lessonDetail?.previous_lesson?.id) {
                  handleUpdateLastTime()
                  router.push(
                    `/learning/${courseSlug}/lesson/${lessonDetail.previous_lesson.id}`
                  )
                }
              }}
            >
              <ChevronLeft />
              BÀI TRƯỚC
            </Button>

            <Button
              size="lg"
              className="rounded-full font-semibold [&_svg]:size-5"
              disabled={
                !lessonDetail?.next_lesson ||
                (lessons.level === Level.ADVANCED && !isCompleted)
              }
              onClick={() => {
                if (lessonDetail?.next_lesson?.id) {
                  handleUpdateLastTime()
                  router.push(
                    `/learning/${courseSlug}/lesson/${lessonDetail.next_lesson.id}`
                  )
                }
              }}
            >
              {'BÀI TIẾP THEO'}
              <ChevronRight />
            </Button>
          </div>

          <AIChatAssistant
            courseName={course_name || ''}
            lessonTitle={lessonDetail?.lesson.title || ''}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-2">
            <CommentLesson lessonId={lessonId} />
          </div>
        </div>
      </div>

      <NoteList
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        courseSlug={courseSlug}
        lessonId={lessonId}
      />

      <AlertDialog open={showAccessAlert} onOpenChange={setShowAccessAlert}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-500">
              <Lock size={20} />
              Bài học chưa được mở khóa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              <div className="mb-4">
                Để đảm bảo quá trình học tập hiệu quả, bạn cần hoàn thành các
                bài học trước khi tiếp tục.
              </div>

              {accessData?.next_valid_lesson_title && (
                <Alert className="border-y-0 border-l-4 border-r-0 border-l-orange-500 bg-orange-50 p-4">
                  <AlertTitle className="text-sm font-bold">
                    Bài học tiếp theo của bạn:
                  </AlertTitle>
                  <AlertDescription className="text-sm font-medium text-orange-700">
                    {accessData.next_valid_lesson_title}
                  </AlertDescription>
                </Alert>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => router.push(`/my-courses?tab=course-all`)}
              className="w-full border-2 border-gray-300 font-medium hover:bg-gray-100 hover:text-gray-800"
            >
              Khoá học của tôi
            </Button>
            <AlertDialogAction
              className="w-full gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-md hover:shadow-orange-200"
              onClick={() => {
                if (accessData?.next_valid_lesson_id) {
                  router.push(
                    `/learning/${courseSlug}/lesson/${accessData.next_valid_lesson_id}`
                  )
                }
              }}
            >
              <ChevronRight size={18} />
              Đến bài học cần hoàn thành
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default LearningPathView
