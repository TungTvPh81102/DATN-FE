'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  ChevronDown,
  ChevronUp,
  CircleHelp,
  CirclePlay,
  CircleX,
  Eye,
  FileCode2,
  Loader2,
  ScrollText,
} from 'lucide-react'
import { toast } from 'react-toastify'

import { formatCurrency, formatDuration } from '@/lib/common'
import {
  useGetCourseDetails,
  useGetCourseRatings,
  useGetCoursesOther,
  useGetCoursesRelated,
} from '@/hooks/course/useCourse'
import { useEnrollFreeCourse } from '@/hooks/transation/useTransation'

import BuyCourseModal from '@/sections/courses/_components/buy-course-modal'

import CourseSlide from '../_components/course-slide'
import { InstructorDetail } from '@/sections/courses/_components/instructorDetail'
import { LessonPreviewModal } from '@/sections/courses/_components/course-list-sidebar/preview-model'
import { IChapter } from '@/types'
import CourseSlideRelated from '@/sections/courses/_components/course-slide-related'
import { CourseItemSkeleton } from '@/components/shared/course-item-skeletion'
import { RatingsList } from '@/sections/courses/_components/ratings-list'

const lessonTypeIcons = {
  video: <CirclePlay size={16} />,
  document: <ScrollText size={16} />,
  quiz: <CircleHelp size={16} />,
  coding: <FileCode2 size={16} />,
}
const lessonTypeLabels: Record<string, string> = {
  video: 'Video Bài',
  quiz: 'Quiz',
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

const CourseDetailView = ({ slug }: { slug: string }) => {
  const router = useRouter()

  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [benefitsColumn1, setBenefitsColumn1] = useState<string[]>([])
  const [benefitsColumn2, setBenefitsColumn2] = useState<string[]>([])
  const [requirementsColumn1, setRequirementsColumn1] = useState<string[]>([])
  const [requirementsColumn2, setRequirementsColumn2] = useState<string[]>([])
  const [isOpenIntro, setIsOpenIntro] = useState<boolean>(false)
  const [isOpenBuyCourse, setIsOpenBuyCourse] = useState<boolean>(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [expandedChapters, setExpandedChapters] = useState<number[]>([])

  const { user, isAuthenticated } = useAuthStore()

  const { data: courseDetails, isLoading: isCourseDetailsLoading } =
    useGetCourseDetails(slug)
  const { data: coursesRelatedData, isLoading: isCoursesRelatedDataLoading } =
    useGetCoursesRelated(slug)
  const { data: coursesOtherData, isLoading: isCoursesOtherDataLoading } =
    useGetCoursesOther(slug)
  const { data: courseRatingsData, isLoading: isCourseRatingsDataLoading } =
    useGetCourseRatings(slug)

  const totalRatings = courseRatingsData?.data?.total_ratings

  const { mutate: enrollFreeCourse } = useEnrollFreeCourse()

  useEffect(() => {
    if (courseDetails?.updated_at) {
      const date = new Date(courseDetails.updated_at)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      setLastUpdated(`${day}/${month}/${year}`)
    }
  }, [courseDetails?.updated_at])

  useEffect(() => {
    if (courseDetails?.benefits) {
      const parsedBenefits = Array.isArray(courseDetails.benefits)
        ? courseDetails.benefits
        : JSON.parse(courseDetails.benefits)

      const halfLength = Math.ceil(parsedBenefits.length / 2)
      setBenefitsColumn1(parsedBenefits.slice(0, halfLength))
      setBenefitsColumn2(parsedBenefits.slice(halfLength))
    }

    if (courseDetails?.requirements) {
      const parsedRequirements = Array.isArray(courseDetails.requirements)
        ? courseDetails.requirements
        : JSON.parse(courseDetails.requirements)

      const halfLength = Math.ceil(parsedRequirements.length / 2)
      setRequirementsColumn1(parsedRequirements.slice(0, halfLength))
      setRequirementsColumn2(parsedRequirements.slice(halfLength))
    }
  }, [courseDetails?.benefits, courseDetails?.requirements])

  useEffect(() => {
    if (isOpenIntro) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      if (isOpenIntro) {
        document.body.classList.remove('overflow-hidden')
      }
    }
  }, [isOpenIntro])

  const handlePreviewClick = (lesson: any) => {
    setSelectedLesson(lesson)
    setIsPreviewOpen(true)
  }

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  if (isCourseDetailsLoading) {
    return (
      <div className="pb-20 pt-10">
        <div className="tf-container">
          <div className="mb-8 flex items-center space-x-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <div className="h-4 w-16 rounded bg-gray-200"></div>
                <div className="size-4 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="w-full lg:w-2/3">
              <div className="mb-4 h-10 w-3/4 rounded bg-gray-200"></div>

              <div className="mb-6 space-y-2">
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                <div className="h-4 w-4/6 rounded bg-gray-200"></div>
              </div>

              <div className="mb-8 flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-gray-200"></div>
                    <div className="h-4 w-16 rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>

              <div className="mb-10 flex items-center gap-3">
                <div className="size-12 rounded-full bg-gray-200"></div>
                <div className="h-5 w-32 rounded bg-gray-200"></div>
              </div>

              <div className="mb-8 space-y-6">
                <div>
                  <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-gray-200"></div>
                        <div className="h-4 w-full rounded bg-gray-200"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-4 h-6 w-32 rounded bg-gray-200"></div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-gray-200"></div>
                        <div className="h-4 w-full rounded bg-gray-200"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="h-6 w-48 rounded bg-gray-200"></div>
                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                      >
                        <div className="flex items-center justify-between bg-gray-50 px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="size-8 rounded-full bg-gray-100"></div>
                            <div>
                              <div className="h-5 w-48 rounded bg-gray-200"></div>
                              <div className="mt-1 flex gap-2">
                                <div className="h-4 w-16 rounded bg-gray-200"></div>
                                <div className="h-4 w-16 rounded bg-gray-200"></div>
                              </div>
                            </div>
                          </div>
                          <div className="size-5 rounded bg-gray-200"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 w-full lg:mt-0 lg:w-1/3">
              <div className="sticky top-20 rounded-lg bg-white p-6 shadow-md">
                <div className="mb-6 aspect-video w-full rounded-lg bg-gray-200"></div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="h-8 w-24 rounded bg-gray-200"></div>
                  <div className="h-5 w-16 rounded bg-gray-200"></div>
                </div>

                <div className="mb-6 h-12 w-full rounded-lg bg-gray-200"></div>

                <div>
                  <div className="mb-3 h-5 w-32 rounded bg-gray-200"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="size-5 rounded-full bg-gray-200"></div>
                        <div className="h-4 w-full rounded bg-gray-200"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="pt-0">
        <section className="section-page-title page-title style-5">
          <div className="tf-container">
            <div className="row">
              <div className="col-lg-8">
                <div className="content">
                  <ul className="breadcrumbs mb-[60px] flex items-center justify-start gap-[10px]">
                    <li>
                      <Link href="/" className="flex">
                        <i className="icon-home" />
                      </Link>
                    </li>
                    <li>
                      <i className="icon-arrow-right" />
                    </li>
                    <li>Khoá học</li>
                    <li>
                      <i className="icon-arrow-right" />
                    </li>
                    <li>{courseDetails?.name}</li>
                  </ul>
                  <h2 className="fw-7">{courseDetails?.name}</h2>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: courseDetails?.description || '',
                    }}
                  ></p>

                  <ul className="entry-meta mt-4">
                    {(courseDetails?.ratings_count ?? 0) > 0 && (
                      <li>
                        <div className="ratings">
                          <div className="number">
                            {courseDetails?.avg_rating}
                          </div>
                          {Array.from({ length: 5 }, (_, index) => (
                            <i
                              key={index}
                              className={`icon-star-1 ${
                                index <
                                Math.round(
                                  Number(courseDetails?.avg_rating ?? 0)
                                )
                                  ? 'text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            ></i>
                          ))}
                          <p className="total fs-15">
                            {' '}
                            {courseDetails?.ratings_count} đánh giá
                          </p>
                        </div>
                      </li>
                    )}
                    <li>
                      <i className="flaticon-book" />
                      <p>{courseDetails?.chapters_count}</p>
                    </li>
                    <li>
                      <i className="flaticon-user" />
                      <p>{courseDetails?.total_student} Học viên</p>
                    </li>
                    <li>
                      <i className="flaticon-clock" />
                      <p>Cập nhật ngày {lastUpdated}</p>
                    </li>
                  </ul>
                  <div className="author-item">
                    <div className="author-item-img">
                      <Image
                        width="50"
                        height={50}
                        src={courseDetails?.user.avatar || ''}
                        alt=""
                      />
                    </div>
                    <div className="text">
                      <span className="text-1">By </span>
                      <Link href={`/profile/${courseDetails?.user.code}`}>
                        {courseDetails?.user?.name}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /section page title */}
        {/*section page inner*/}
        <section className="section-page-course">
          <div className="tf-container">
            <div className="row">
              <div className="col-lg-8">
                <div className="course-single-inner">
                  <div className="page-learn">
                    <h2
                      className="learn-head text-22 fw-5 wow fadeInUp"
                      data-wow-delay="0s"
                    >
                      Bạn sẽ học được gì?
                    </h2>
                    <div className="learn-inner">
                      <ul className="learn-list">
                        {benefitsColumn1?.length > 0 &&
                          benefitsColumn1?.map((benefit, index) => (
                            <li key={index} className="item">
                              <i className="flaticon-check" />
                              {benefit}
                            </li>
                          ))}
                      </ul>
                      <ul className="learn-list">
                        {benefitsColumn2?.map((benefit, index) => (
                          <li key={index} className="item">
                            <i className="flaticon-check" />
                            {truncateText(benefit, 50)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="page-learn">
                    <h2
                      className="text-22 fw-5 wow fadeInUp"
                      data-wow-delay="0s"
                    >
                      Yêu cầu
                    </h2>
                    <div className="learn-inner">
                      <ul className="learn-list">
                        {requirementsColumn1?.map((requirement, index) => (
                          <li key={index} className="item">
                            <i className="flaticon-check" />
                            {truncateText(requirement, 50)}
                          </li>
                        ))}
                      </ul>
                      <ul className="learn-list">
                        {requirementsColumn2?.map((requirement, index) => (
                          <li key={index} className="item">
                            <i className="flaticon-check" />
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="container mx-auto px-4 py-8">
                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                      <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900">
                          Nội dung khóa học
                        </h2>
                        <div className="text-sm text-gray-500">
                          {courseDetails?.chapters?.length || 0} chương học
                        </div>
                      </div>
                      <div className="space-y-4">
                        {courseDetails?.chapters?.map(
                          (chapter: IChapter, chapterIndex) => (
                            <div
                              key={chapter.id}
                              className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 ease-in-out"
                            >
                              <button
                                onClick={() => toggleChapter(chapter.id!)}
                                className="flex w-full items-center justify-between bg-gray-50 px-6 py-4 transition hover:bg-gray-100"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-orange-500">
                                    {chapterIndex + 1}
                                  </span>
                                  <div className="text-left">
                                    <h3 className="text-lg font-medium text-gray-900">
                                      {chapter.title}
                                    </h3>
                                    <div className="flex gap-2">
                                      <p className="text-sm text-gray-500">
                                        {chapter.lessons_count} bài học
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {formatDuration(
                                          chapter.total_video_duration ?? 0
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {expandedChapters.includes(chapter.id!) ? (
                                  <ChevronUp className="size-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="size-5 text-gray-400" />
                                )}
                              </button>

                              {expandedChapters.includes(chapter.id!) && (
                                <div className="divide-y divide-gray-100">
                                  {chapter.lessons?.map(
                                    (lesson, lessonIndex) => (
                                      <div
                                        key={lesson.id}
                                        className="flex items-center gap-4 px-6 py-4 transition hover:bg-gray-50"
                                      >
                                        <div className="flex min-w-0 flex-1 items-center gap-4">
                                          <span className="text-sm font-medium text-gray-400">
                                            {lessonIndex + 1}
                                          </span>
                                          {lessonTypeIcons[lesson.type]}
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                              <h4 className="truncate text-base font-medium text-gray-900">
                                                {lesson.title}
                                              </h4>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                              {lessonTypeLabels[lesson.type]}
                                            </p>
                                          </div>
                                        </div>

                                        {lesson.is_free_preview === 1 && (
                                          <button
                                            onClick={() =>
                                              handlePreviewClick(lesson)
                                            }
                                            className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-orange-600 transition hover:bg-blue-100"
                                          >
                                            <Eye size={16} />
                                            Xem trước
                                          </button>
                                        )}
                                        <div>
                                          {lesson.type === 'video' &&
                                            lesson.lessonable?.duration && (
                                              <span className="text-sm text-gray-500">
                                                {formatDuration(
                                                  lesson.lessonable.duration
                                                )}
                                              </span>
                                            )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <LessonPreviewModal
                      isOpen={isPreviewOpen}
                      onClose={() => setIsPreviewOpen(false)}
                      lesson={selectedLesson}
                    />
                  </div>
                  {coursesOtherData?.profile_instructor && (
                    <InstructorDetail
                      instructorDetail={coursesOtherData.profile_instructor}
                    />
                  )}
                  <div className="page-my-course">
                    <div className="heading-section">
                      <h6
                        className="fw-5 text-22 wow fadeInUp"
                        data-wow-delay="0s"
                      >
                        Khoá học khác
                      </h6>
                    </div>
                    {isCoursesOtherDataLoading ? (
                      <div className="gap-6lg:grid-cols-3 mt-8 grid grid-cols-1">
                        {[...Array(4)].map((_, index) => (
                          <CourseItemSkeleton key={`skeleton-${index}`} />
                        ))}
                      </div>
                    ) : (
                      coursesOtherData?.get_other_courses && (
                        <CourseSlide
                          courses={coursesOtherData.get_other_courses}
                        />
                      )
                    )}
                  </div>
                  <div className="review-wrap">
                    <div className="review-title flex items-center justify-between">
                      <div
                        className="text-22 fw-5 wow fadeInUp"
                        data-wow-delay="0s"
                      >
                        Đánh giá
                      </div>
                      <div
                        className="review-rating wow fadeInUp"
                        data-wow-delay="0.1s"
                      >
                        <div className="course-rating">
                          <i className="icon-star-1" />
                          <div className="fs-15">
                            {courseRatingsData?.data?.average_rating} course
                            rating
                          </div>
                        </div>
                        <div className="rating relative">
                          <div className="fs-15">
                            {`${totalRatings || 0} ${totalRatings && totalRatings > 1 ? 'ratings' : 'rating'}`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isCourseRatingsDataLoading ? (
                      <div className="flex h-40 items-center justify-center">
                        <Loader2 className="size-8 animate-spin" />
                      </div>
                    ) : (
                      <RatingsList
                        data={courseRatingsData?.data?.ratings ?? []}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="sidebar-course course-single-v2">
                  <div className="widget-video">
                    {courseDetails?.intro ? (
                      <>
                        <div className="relative inline-block cursor-pointer">
                          <img
                            src={courseDetails?.thumbnail ?? ''}
                            alt="Video thumbnail"
                            className="w-full max-w-md rounded-lg shadow-lg transition-opacity hover:opacity-50"
                            onClick={() => setIsOpenIntro(true)}
                          />

                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            onClick={() => setIsOpenIntro(true)}
                          >
                            <CirclePlay
                              size={36}
                              className="text-white opacity-80 hover:opacity-100"
                            />
                          </div>
                        </div>

                        {isOpenIntro && (
                          <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                            onClick={() => setIsOpenIntro(false)}
                          >
                            <div
                              className="flex w-full max-w-2xl flex-col space-y-4 rounded-lg bg-white p-6 shadow-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-2xl font-bold">Intro</p>

                                <button
                                  onClick={() => setIsOpenIntro(false)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <CircleX color="#321a1a" />
                                </button>
                              </div>
                              <video controls className="w-full">
                                <source
                                  src={courseDetails.intro}
                                  type="video/mp4"
                                />
                                Trình duyệt của bạn không hỗ trợ video.
                              </video>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <img
                        src={courseDetails?.thumbnail ?? ''}
                        alt={courseDetails?.name}
                      />
                    )}
                  </div>
                  <div className="sidebar-course-content">
                    <div className="course-price">
                      {courseDetails?.is_free === 1 ? (
                        <div className="price">
                          <h3 className="fw-5">Miễn phí</h3>
                        </div>
                      ) : Number(courseDetails?.price_sale) > 0 ? (
                        <>
                          <div className="price">
                            <h3 className="fw-5">
                              {formatCurrency(courseDetails?.price_sale ?? 0)}
                            </h3>
                            <h6 className="fs-15">
                              {formatCurrency(courseDetails?.price ?? 0)}
                            </h6>
                          </div>
                          <p className="sale-off">
                            {courseDetails?.price &&
                              Math.round(
                                ((Number(courseDetails.price) -
                                  Number(courseDetails.price_sale)) /
                                  Number(courseDetails.price)) *
                                  100
                              )}
                            % OFF
                          </p>
                        </>
                      ) : Number(courseDetails?.price) > 0 ? (
                        <div className="price">
                          <h3 className="fw-5">
                            {formatCurrency(courseDetails?.price ?? 0)}
                          </h3>
                        </div>
                      ) : (
                        <div className="price">
                          <h3 className="fw-5">Miễn phí</h3>
                        </div>
                      )}
                    </div>
                    <button
                      disabled={
                        courseDetails?.user_id === user?.id ||
                        courseDetails?.is_enrolled
                      }
                      onClick={() => {
                        if (!user || !isAuthenticated) {
                          router.push('/sign-in')
                          return
                        }

                        if (
                          courseDetails?.user_id === user?.id ||
                          courseDetails?.is_enrolled
                        ) {
                          router.push('/my-courses')
                          return
                        }

                        if (courseDetails?.is_free === 1) {
                          import('sweetalert2').then((Swal) => {
                            Swal.default
                              .fire({
                                title: 'Xác nhận tham gia khoá học',
                                text: 'Bạn có chắc chắn muốn tham gia khoá học này?',
                                icon: 'question',
                                showCancelButton: true,
                                confirmButtonText: 'Tham gia ',
                                cancelButtonText: 'Huỷ',
                              })
                              .then((result) => {
                                if (result.isConfirmed) {
                                  enrollFreeCourse(String(courseDetails?.id), {
                                    onSuccess: (res: any) => {
                                      toast.success(res.message)
                                      router.push('/my-courses')
                                    },
                                  })
                                }
                              })
                          })
                        } else {
                          setIsOpenBuyCourse(true)
                        }
                      }}
                      type="button"
                      className="tf-btn add-to-cart cursor-pointer"
                    >
                      {courseDetails?.user_id === user?.id
                        ? 'Đây là khoá học của bạn'
                        : courseDetails?.is_enrolled
                          ? 'Đã sở hữu khoá học'
                          : courseDetails?.is_free === 1
                            ? 'Tham gia ngay'
                            : 'Mua khoá học'}
                      <i className="icon-shopcart fs-18"></i>
                    </button>
                    <div className="course-list">
                      <h5 className="fw-5">Khoá học gồm có:</h5>
                      <ul className="course-benefit-list">
                        {(courseDetails?.total_video_duration ?? 0) > 0 && (
                          <li className="course-benefit-item">
                            <i className="flaticon-play-1" />
                            <p>
                              {formatDuration(
                                courseDetails?.total_video_duration ?? 0
                              )}
                            </p>
                          </li>
                        )}
                        <li className="course-benefit-item">
                          <i className="flaticon-document" />
                          <p>{courseDetails?.lessons_count} bài học</p>
                        </li>
                        <li className="course-benefit-item">
                          <i className="icon-extremely" />
                          <p>Truy cập chọn đời</p>
                        </li>
                        <li className="course-benefit-item">
                          <i className="flaticon-medal" />
                          <p>Cấp chứng chỉ khi hoàn thành</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="course-social">
                    <h6 className="fw-5">Chia sẻ khoá học đến với mọi người</h6>
                    <ul>
                      <li>
                        <a href="#">
                          <i className="flaticon-facebook-1" />
                        </a>
                      </li>
                      <li className="course-social-item">
                        <a href="#">
                          <i className="icon-twitter" />
                        </a>
                      </li>
                      <li className="course-social-item">
                        <a href="#">
                          <i className="flaticon-instagram" />
                        </a>
                      </li>
                      <li className="course-social-item">
                        <a href="#">
                          <i className="flaticon-linkedin-1" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* / section page inner */}
        {/* section courses*/}
        <section className="tf-spacing-9 section-course pt-0">
          <div className="tf-container">
            <div className="row">
              <div className="col-12">
                <div className="heading-section">
                  <h2 className="fw-7 wow fadeInUp" data-wow-delay="0s">
                    Khoá học có thể phù hợp với bạn
                  </h2>
                  <div className="flex flex-wrap items-center justify-between gap-[10px]">
                    <div className="sub fs-15 wow fadeInUp" data-wow-delay="0s">
                      Những khoá học tương tự dành cho bạn
                    </div>
                    <Link
                      href="/courses"
                      className="tf-btn-arrow wow fadeInUp"
                      data-wow-delay="0.1s"
                    >
                      Xem thêm <i className="icon-arrow-top-right" />
                    </Link>
                  </div>
                </div>
                {coursesRelatedData?.related_courses && (
                  <CourseSlideRelated
                    courses={coursesRelatedData?.related_courses}
                    isLoading={isCoursesRelatedDataLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <BuyCourseModal
        course={courseDetails as any}
        isOpen={isOpenBuyCourse}
        onClose={() => setIsOpenBuyCourse(false)}
      />
    </>
  )
}

export default CourseDetailView
