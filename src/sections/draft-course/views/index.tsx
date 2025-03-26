'use client'

import ModalLoading from '@/components/common/ModalLoading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { lessonTypeIcons } from '@/configs'
import { useGetDraftCourse } from '@/hooks/learning-path/useLearningPath'
import { formatDuration } from '@/lib/common'
import { cn } from '@/lib/utils'
import { DraftLesson } from '@/types/DraftCourse'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DraftLessonContent from '../_components/draft-lesson-content'

interface Props {
  slug: string
}

const DraftCourseView = ({ slug }: Props) => {
  const router = useRouter()

  const {
    data: draftCourse,
    isLoading,
    isError,
    error,
  } = useGetDraftCourse(slug)

  const [selectedLesson, setSelectedLesson] = useState<{
    lesson: DraftLesson
    chapterIndex: number
    lessonIndex: number
  }>()

  const { chapters: draftChapters } = draftCourse ?? {}

  const getLessonDuration = (lesson: DraftLesson) => {
    switch (lesson.type) {
      case 'video':
        return lesson.duration as number
      case 'coding':
        return 300
      case 'quiz':
        return 180
      default:
        return 10
    }
  }

  const handleNextLesson = () => {
    if (selectedLesson) {
      const { chapterIndex, lessonIndex } = selectedLesson

      let nextChapterIndex = chapterIndex
      let nextLessonIndex = lessonIndex + 1

      if (
        nextLessonIndex >= (draftChapters?.[chapterIndex]?.lessons?.length ?? 0)
      ) {
        nextChapterIndex = chapterIndex + 1
        nextLessonIndex = 0
      }

      if (nextChapterIndex >= (draftChapters?.length ?? 0)) return

      const nextLesson =
        draftChapters?.[nextChapterIndex]?.lessons?.[nextLessonIndex]

      if (nextLesson) {
        setSelectedLesson({
          lesson: nextLesson,
          chapterIndex: nextChapterIndex,
          lessonIndex: nextLessonIndex,
        })
      }
    }
  }

  const handlePrevLesson = () => {
    if (selectedLesson) {
      const { chapterIndex, lessonIndex } = selectedLesson

      let prevChapterIndex = chapterIndex
      let prevLessonIndex = lessonIndex - 1

      if (prevLessonIndex < 0) {
        prevChapterIndex = chapterIndex - 1
        prevLessonIndex =
          (draftChapters?.[prevChapterIndex]?.lessons?.length ?? 1) - 1
      }

      if (prevChapterIndex < 0) return

      const prevLesson =
        draftChapters?.[prevChapterIndex]?.lessons?.[prevLessonIndex]

      if (prevLesson) {
        setSelectedLesson({
          lesson: prevLesson,
          chapterIndex: prevChapterIndex,
          lessonIndex: prevLessonIndex,
        })
      }
    }
  }

  useEffect(() => {
    if (draftChapters) {
      const firstLesson = draftChapters[0]?.lessons[0]
      if (firstLesson) {
        setSelectedLesson({
          lesson: firstLesson,
          chapterIndex: 0,
          lessonIndex: 0,
        })
      }
    }
  }, [draftChapters])

  if (isLoading) return <ModalLoading />

  if (isError && (error as any).status === 404) {
    router.replace('/not-found')
    return null
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-x-0 top-0 z-10 h-16 bg-[#292f3b] text-primary-foreground">
        <div className="mx-16 flex h-full items-center gap-4">
          <ChevronLeft
            onClick={() => router.back()}
            className="cursor-pointer"
          />
          <Image
            src="/images/Logo.png"
            className="shrink-0 rounded-md"
            alt="logo"
            width={36}
            height={36}
          />
          <p className="font-bold">{draftCourse?.title}</p>
        </div>
      </div>

      <div className="fixed inset-x-0 inset-y-16 grid grid-cols-12 overflow-hidden">
        <div className="col-span-9 overflow-y-auto">
          {selectedLesson && (
            <DraftLessonContent lesson={selectedLesson.lesson} />
          )}
        </div>

        <div className="col-span-3 overflow-y-auto border-l-2">
          <h2 className="border-b-2 p-4 font-bold">Nội dung khoá học</h2>

          <Accordion type="multiple" defaultValue={[`chapter-0`]}>
            {draftChapters?.map((chapter, chapterIndex) => {
              const duration = chapter?.lessons.reduce(
                (acc, lesson) => acc + getLessonDuration(lesson),
                0
              )
              return (
                <AccordionItem
                  key={chapterIndex}
                  value={`chapter-${chapterIndex}`}
                  className="border-b-2"
                >
                  <AccordionTrigger className="border-0 hover:bg-gray-200">
                    <div>
                      <h3 className="font-semibold">
                        {chapterIndex + 1}. {chapter.title}
                      </h3>
                      <p className="mt-1 text-xs font-light">
                        {chapter?.lessons.length} bài học |{' '}
                        {formatDuration(duration, 'colon')}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="m-0 border-0 p-0">
                    {chapter?.lessons?.map((lesson, lessonIndex) => {
                      const isSelected =
                        selectedLesson?.lesson === lesson &&
                        selectedLesson?.chapterIndex === chapterIndex &&
                        selectedLesson?.lessonIndex === lessonIndex
                      return (
                        <div
                          onClick={() => {
                            if (!isSelected)
                              setSelectedLesson({
                                lesson,
                                chapterIndex,
                                lessonIndex,
                              })
                          }}
                          className={cn(
                            `flex cursor-default items-center space-x-3 border-t-2 p-3 pr-4 transition-colors duration-300`,
                            isSelected
                              ? 'bg-orange-100'
                              : 'hover:cursor-pointer hover:bg-gray-200'
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
                        </div>
                      )
                    })}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 h-16 bg-accent">
        <div className="container mx-auto flex h-full items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-primary font-semibold text-primary hover:text-primary/80 [&_svg]:size-5"
            disabled={
              !selectedLesson?.lesson ||
              (selectedLesson?.chapterIndex === 0 &&
                selectedLesson?.lessonIndex === 0)
            }
            onClick={handlePrevLesson}
          >
            <ChevronLeft />
            BÀI TRƯỚC
          </Button>

          <Button
            size="lg"
            className="rounded-full font-semibold [&_svg]:size-5"
            disabled={
              !selectedLesson?.lesson ||
              (selectedLesson?.chapterIndex >=
                (draftChapters?.length ?? 0) - 1 &&
                selectedLesson?.lessonIndex >=
                  (draftChapters?.[selectedLesson?.chapterIndex]?.lessons
                    ?.length ?? 0) -
                    1)
            }
            onClick={handleNextLesson}
          >
            {'BÀI TIẾP THEO'}
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
export default DraftCourseView
