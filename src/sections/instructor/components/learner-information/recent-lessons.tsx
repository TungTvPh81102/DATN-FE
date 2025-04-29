'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const RecentLessons = ({ courseList }: any) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 2

  const coursesWithRecentLessons =
    courseList?.filter((course: any) => course.recent_lesson) || []

  const totalPages = Math.ceil(coursesWithRecentLessons.length / itemsPerPage)

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return coursesWithRecentLessons.slice(startIndex, endIndex)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPageButtons = 2

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
      let endPage = startPage + maxPageButtons - 1

      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPageButtons + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }
    }

    return pageNumbers
  }

  return (
    <Card className="flex min-h-[500px] flex-col overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-orange-100 py-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 p-2.5 text-white shadow-md">
            <Clock className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              Bài học gần đây
            </CardTitle>
            <CardDescription className="mt-1 text-gray-600">
              Các bài học bạn đã hoàn thành gần đây
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grow px-6 pt-6">
        {coursesWithRecentLessons.length > 0 ? (
          <div className="space-y-4">
            {getCurrentPageItems().map((course: any) => (
              <div
                key={course.course_id}
                className="hover:boder-orange-200 group flex items-start space-x-4 rounded-xl border border-gray-100 p-4 transition-all hover:border-[#E27447] hover:bg-orange-50/50 hover:shadow-md"
              >
                <div className="shrink-0 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 p-5 shadow-sm transition-all group-hover:from-orange-300 group-hover:to-orange-400">
                  <BookOpen className="size-5 text-white" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <p className="text-sm font-medium leading-tight text-gray-800 transition-colors group-hover:text-[#E27447]">
                    {course.recent_lesson?.name}
                  </p>
                  <p className="mt-2 w-full text-sm text-[#E27447]">
                    {course.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Hoàn thành:{' '}
                    {course.recent_lesson?.completed_at
                      ? formatDate(course.recent_lesson.completed_at)
                      : ''}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-auto shrink-0 ${
                    course.status === 'completed'
                      ? 'border-green-200 bg-green-100 text-green-700'
                      : 'border-orange-200 bg-orange-100 text-[#E27447]'
                  }`}
                >
                  {course.status === 'completed' ? 'Đã hoàn thành' : 'Đang học'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[300px] flex-col items-center justify-center rounded-xl border border-orange-100 bg-gradient-to-b from-orange-50 to-orange-100/50 shadow-inner">
            <div className="mb-5 rounded-full border border-orange-100 bg-white p-4 shadow-md">
              <Clock className="size-12 text-[#E27447] opacity-80" />
            </div>
            <p className="text-base font-semibold text-[#E27447]">
              Chưa có bài học nào được hoàn thành
            </p>
            <p className="mt-2 max-w-xs text-center text-sm text-gray-600">
              Hãy bắt đầu học để xem lịch sử của bạn. Các bài học hoàn thành sẽ
              xuất hiện ở đây.
            </p>
            <button className="mt-5 rounded-lg bg-[#E27447] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#D26437]">
              Bắt đầu học ngay
            </button>
          </div>
        )}
      </CardContent>

      {coursesWithRecentLessons.length > 0 && (
        <CardFooter className="mt-auto flex items-center justify-between border-t border-orange-100 bg-gradient-to-r from-orange-50/50 to-orange-100/50 px-6 py-5">
          <div className="rounded-md border border-orange-100 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm">
            Trang {currentPage} / {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="size-9 rounded-lg border-orange-200 p-0 text-gray-700 transition-all hover:bg-orange-100 hover:text-[#E27447] disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">Trang trước</span>
            </Button>

            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageClick(page)}
                className={`size-9 rounded-lg p-0 font-medium transition-all ${
                  currentPage === page
                    ? 'bg-[#E27447] text-white shadow-md hover:bg-[#D26437]'
                    : 'border-orange-200 text-gray-700 hover:bg-orange-100 hover:text-[#E27447]'
                }`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="size-9 rounded-lg border-orange-200 p-0 text-gray-700 transition-all hover:bg-orange-100 hover:text-[#E27447] disabled:opacity-50"
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">Trang sau</span>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default RecentLessons
