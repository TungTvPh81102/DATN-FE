import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useGetMyCourses } from '@/hooks/user/useUser'
import { formatDuration } from '@/lib/common'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MyCourseView = () => {
  const { data: myCourseList, isLoading: myCourseListLoading } =
    useGetMyCourses()

  const getProgressStyle = (percent: number) => {
    if (percent < 25) {
      return 'bg-gradient-to-r from-red-500 to-orange-500'
    } else if (percent < 50) {
      return 'bg-gradient-to-r from-orange-400 to-yellow-400'
    } else if (percent < 75) {
      return 'bg-gradient-to-r from-yellow-300 to-green-400'
    } else {
      return 'bg-gradient-to-r from-green-400 to-emerald-500'
    }
  }

  return (
    <>
      {myCourseListLoading && (
        <div className="mt-20">
          <Loader2 className="mx-auto size-8 animate-spin" />
        </div>
      )}
      <section className="section-inner mt-10">
        <div className="row mb-[50px]">
          {myCourseList?.data.map((course: any) => (
            <div className="col-xl-3 mb-10" key={course.id}>
              <div className="course-item hover-img wow fadeInUp relative">
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

                  <div className="absolute right-2 top-2 rounded-md bg-black bg-opacity-70 px-2 py-1 text-sm text-white">
                    {course.progress_percent}%
                  </div>
                </div>

                <div className="content">
                  <div className="meta">
                    <div className="meta-item">
                      <i className="flaticon-calendar"></i>
                      <p>{course.lessons_count || ''} Bài bài học</p>
                    </div>
                    <div className="meta-item">
                      <i className="flaticon-clock"></i>
                      <p>{formatDuration(course.total_video_duration || '')}</p>
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
                  <div className="author">
                    Người hướng dẫn:
                    <a href="#" className="author">
                      {course.user.name || ''}
                    </a>
                  </div>
                  <div className="mt-4">
                    <Button
                      className={cn(
                        'text-white',
                        course.progress_percent === 100 &&
                          'bg-green-500 hover:bg-green-500/80',
                        course?.status === 'draft' &&
                          'bg-yellow-500 hover:bg-yellow-500/80'
                      )}
                      onClick={() => {
                        window.location.href = `/learning/${course.slug}/lesson/${course.current_lesson.id}`
                      }}
                    >
                      {course?.status === 'draft'
                        ? 'Đang sửa đổi nội dung'
                        : course.progress_percent === 100
                          ? 'Đã hoàn thành'
                          : course.progress_percent === 0
                            ? 'Bắt đầu học'
                            : 'Tiếp tục học'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default MyCourseView
