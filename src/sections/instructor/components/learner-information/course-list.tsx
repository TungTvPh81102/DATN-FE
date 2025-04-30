'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Book,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Clock,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/common'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const CourseList = ({ courseList }: any) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const totalPages = Math.ceil(courseList?.length / itemsPerPage)

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return courseList?.slice(startIndex, endIndex)
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
    <Card className="flex min-h-[600px] flex-col overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-orange-100 py-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 p-2.5 text-white shadow-md">
            <Book className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              Danh sách khóa học
            </CardTitle>
            <CardDescription className="mt-1 text-gray-600">
              Các khóa học đã đăng ký và tiến độ học tập
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grow px-6 pt-6">
        <div className="space-y-4">
          {getCurrentPageItems()?.map((course: any) => (
            <div
              key={course.course_id}
              className="group rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {course.status === 'completed' ? (
                    <GraduationCap className="size-4 text-green-500" />
                  ) : (
                    <Clock className="size-4 text-orange-500" />
                  )}
                  <span className="text-sm font-medium transition-colors group-hover:text-[#E27447]">
                    {(course.name ?? '').slice(0, 30)}
                    {course.name?.length > 30 ? '...' : ''}
                  </span>
                </div>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-sm font-semibold text-[#E27447]">
                  {course.progress}%
                </span>
              </div>

              <div className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
                <Progress
                  value={course.progress}
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                  style={{
                    background:
                      course.status === 'completed'
                        ? 'linear-gradient(to right, #34d399, #10b981)'
                        : 'linear-gradient(to right, #fb923c, #e27447)',
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    course.status === 'completed'
                      ? 'border-green-200 bg-green-100 text-green-700'
                      : 'border-orange-200 bg-orange-100 text-[#E27447]'
                  }`}
                >
                  {course.status === 'completed' ? 'Đã hoàn thành' : 'Đang học'}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="hidden sm:inline">Ngày đăng ký:</span>{' '}
                  {formatDate(course.enrolled_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

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
    </Card>
  )
}

export default CourseList
