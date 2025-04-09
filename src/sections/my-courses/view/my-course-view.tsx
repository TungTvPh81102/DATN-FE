import { AlertTriangle, Crown, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useGetMyCourses } from '@/hooks/user/useUser'
import { formatDuration } from '@/lib/common'

import { Button } from '@/components/ui/button'
import CourseSummary from '@/sections/my-courses/_components/course-summany'
import React, { useEffect, useState } from 'react'
import { getProgressStyle } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const MyCourseView = () => {
  const [course, setMyCourse] = useState<any[]>([])
  const [summary, setSummary] = useState(null)

  const router = useRouter()
  const { user } = useAuthStore()

  const { data: myCourseList, isLoading: myCourseListLoading } =
    useGetMyCourses()

  useEffect(() => {
    if (!myCourseListLoading && myCourseList) {
      setMyCourse(myCourseList?.data.courses)
      setSummary(myCourseList?.data.summary)
    }
  }, [myCourseList, myCourseListLoading])

  const handleNavigate = (code: string) => {
    const targetPath = user?.code === code ? '/me' : `/profile/${code}`
    router.push(targetPath)
  }

  if (myCourseListLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2
            className="size-10 animate-spin"
            style={{ color: '#E27447' }}
          />
          <p className="text-sm" style={{ color: '#E27447' }}>
            Đang tải...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="section-inner mt-10">
        {summary && <CourseSummary summary={summary} />}

        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-brand sm:text-3xl">
            Danh sách khoá học
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Danh sách khoá học và tiến độ học tập của bạn.
          </p>
        </div>

        <div className="row">
          {course?.length == 0 ? (
            <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
              <AlertTriangle className="mb-3 size-10 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Danh sách khoá học của bạn trống
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Bạn chưa tham gia khoá học nào
              </p>
              <Link
                href="/courses"
                className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-all hover:shadow-md"
              >
                Khám phá khóa học
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {course?.map((course: any) => (
                <div key={course.id} className="mb-4">
                  <div className="course-item hover-img wow fadeInUp relative overflow-hidden rounded-lg border shadow-md">
                    <div className="absolute left-0 top-0 h-1 w-full bg-gray-200">
                      <div
                        className={`h-full ${getProgressStyle(course.progress_percent)}`}
                        style={{ width: `${course.progress_percent}%` }}
                      ></div>
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        overflow: 'hidden',
                      }}
                      className="features image-wrap"
                    >
                      <Image
                        className="lazyload"
                        src={course.thumbnail || ''}
                        alt=""
                        width={270}
                        height={160}
                        style={{
                          objectFit: 'cover',
                        }}
                      />

                      <div className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-sm text-white">
                        {course.progress_percent}%
                      </div>

                      {course.source === 'membership' && (
                        <div className="absolute left-2 top-2 rounded-md bg-[#E27447] px-2 py-1 text-xs font-medium text-white">
                          <div className="flex items-center justify-center">
                            <Crown className="mr-1 size-4" />
                            Hội viên
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="content p-4">
                      <div className="meta">
                        <div className="meta-item">
                          <i className="flaticon-calendar"></i>
                          <p>{course.lessons_count || ''} bài học</p>
                        </div>
                        <div className="meta-item">
                          <i className="flaticon-clock"></i>
                          <p>
                            {formatDuration(course.total_video_duration || '')}
                          </p>
                        </div>
                      </div>
                      <h6 className="fw-5 line-clamp-2">
                        <Link
                          href={`/courses/${course.slug}`}
                          style={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {course.name || ''}
                        </Link>
                      </h6>

                      <div className="my-3">
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-medium">Tiến độ học tập</span>
                          <span
                            className={`font-bold ${course.progress_percent >= 75 ? 'text-green-600' : course.progress_percent >= 50 ? 'text-orange-500' : course.progress_percent >= 25 ? 'text-orange-600' : 'text-red-600'}`}
                          >
                            {course.progress_percent}%
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-3 rounded-full ${course.progress_percent === 100 ? 'bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600' : getProgressStyle(course.progress_percent)} relative transition-all duration-500 ease-out`}
                            style={{ width: `${course.progress_percent}%` }}
                          >
                            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                          </div>
                        </div>
                      </div>

                      <div className="ratings pb-30">
                        {course.ratings?.count > 0 ? (
                          <>
                            <div className="stars flex items-center">
                              {Array.from({ length: 5 }, (_, index) => (
                                <i
                                  key={index}
                                  className={`icon-star-1 ${
                                    index < Math.round(course.ratings.average)
                                      ? 'text-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                ></i>
                              ))}
                            </div>
                            <div className="total text-sm text-gray-500">
                              ({course.ratings.count} lượt đánh giá)
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Chưa có lượt đánh giá
                          </div>
                        )}
                      </div>
                      <Link
                        className="author flex items-center gap-2 space-x-1"
                        href={`/profile/${course?.user?.code}`}
                        onClick={(e) => {
                          e.preventDefault()
                          handleNavigate(course?.user?.code)
                        }}
                      >
                        <Avatar className="size-5">
                          <AvatarImage
                            src={course.user.avatar}
                            alt={course.user.name}
                          />
                          <AvatarFallback>{course.user.name}</AvatarFallback>
                        </Avatar>
                        {course.user.name || ''}
                      </Link>
                      <div className="mt-4">
                        <Button
                          asChild
                          variant={
                            course.progress_percent === 100
                              ? 'success'
                              : course?.status === 'draft'
                                ? 'warning'
                                : 'default'
                          }
                          className="!text-primary-foreground"
                        >
                          <a
                            href={`/learning/${course.slug}/lesson/${course.current_lesson.id}`}
                          >
                            {course?.status === 'draft'
                              ? 'Đang sửa đổi nội dung'
                              : course.progress_percent === 100
                                ? 'Đã hoàn thành'
                                : course.progress_percent === 0
                                  ? 'Bắt đầu học'
                                  : 'Tiếp tục học'}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default MyCourseView
