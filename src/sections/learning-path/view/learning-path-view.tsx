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
  usePrefetchLessonDetail,
} from '@/hooks/learning-path/useLearningPath'
import { useCheckCourseRatingState } from '@/hooks/rating/useRating'
import { useDownloadCertificate, useGetProgress } from '@/hooks/user/useUser'
import { formatDuration } from '@/lib/common'
import { cn } from '@/lib/utils'
import CommentLesson from '@/sections/learning-path/_components/comment-lesson'
import EvaluationCourse from '@/sections/learning-path/_components/evaluation-course'
import LessonContent from '@/sections/learning-path/_components/lesson-content'
import NoteList from '@/sections/learning-path/_components/note-list'
import { LearningPathLesson } from '@/types/LearningPath'
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Lock,
  Notebook,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { PracticeExercise } from '../_components/practice-exercise'
import { Level } from '@/types'

type Props = {
  courseSlug: string
  lessonId: number
}

const LearningPathView = ({ courseSlug, lessonId }: Props) => {
  const router = useRouter()

  const [hasAlerted, setHasAlerted] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [runTour, setRunTour] = useState(false)

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

  const { prefetch } = usePrefetchLessonDetail({
    courseSlug,
    lessonId: lessonDetail?.next_lesson?.id,
  })

  const isCompleted = !!lessonDetail?.lesson_process?.is_completed
  const lastTimeVideo = lessonDetail?.lesson_process?.last_time_video

  const { data: progress } = useGetProgress(courseSlug)
  const { data: checkCourseRatingState } = useCheckCourseRatingState(courseSlug)
  const { data: downloadCertificate } = useDownloadCertificate(
    courseSlug,
    progress
  )

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

      <div className="relative flex min-h-screen flex-col">
        <div className="fixed inset-x-0 top-0 z-10 h-16 bg-[#292f3b] text-primary-foreground">
          <div className="mx-16 flex h-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={'/my-courses'}>
                <ChevronLeft />
              </Link>
              <Image
                src="/images/Logo.png"
                className="shrink-0 rounded-md"
                alt="logo"
                width={36}
                height={36}
              />
              <p className="course-title font-bold">{course_name}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="learning-progress flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <LearningProcess value={progress ?? 0} />
                    </TooltipTrigger>
                    {progress === 100 && (
                      <TooltipContent
                        className="cursor-pointer"
                        onClick={() => {
                          window.open(downloadCertificate, '_blank')
                        }}
                      >
                        Nhận chứng chỉ
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm">
                  <span className="font-bold">
                    {courseProgress}/{total_lesson}
                  </span>{' '}
                  bài học
                </span>
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
          <div className="lesson-content col-span-9 overflow-y-auto">
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
                />
              ))}
          </div>

          <div className="course-content col-span-3 overflow-y-auto border-l-2">
            <h2 className="border-b-2 p-4 font-bold">Nội dung khoá học</h2>

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
                                if (lesson.is_unlocked)
                                  router.push(
                                    `/learning/${courseSlug}/lesson/${lesson?.id}`
                                  )
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
                      if (lesson.is_unlocked)
                        router.push(
                          `/learning/${courseSlug}/lesson/${lesson?.id}`
                        )
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

        <div className="navigation-buttons fixed inset-x-0 bottom-0 z-10 h-16 bg-accent">
          <div className="container mx-auto flex h-full items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-primary font-semibold text-primary hover:text-primary/80 [&_svg]:size-5"
              disabled={!lessonDetail?.previous_lesson}
              onClick={() => {
                if (lessonDetail?.previous_lesson?.id)
                  router.push(
                    `/learning/${courseSlug}/lesson/${lessonDetail.previous_lesson.id}`
                  )
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
                if (lessonDetail?.next_lesson?.id)
                  router.push(
                    `/learning/${courseSlug}/lesson/${lessonDetail.next_lesson.id}`
                  )
              }}
            >
              {'BÀI TIẾP THEO'}
              <ChevronRight />
            </Button>
          </div>

          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-2">
            {progress === 100 && !checkCourseRatingState && (
              <EvaluationCourse courseSlug={courseSlug} />
            )}
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
    </>
  )
}

export default LearningPathView
