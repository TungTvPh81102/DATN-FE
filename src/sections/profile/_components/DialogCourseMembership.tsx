import { useState } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { formatDuration } from '@/lib/common'

type MembershipCoursesDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  courses: any
  membershipName: string
}

const DialogCourseMembership = ({
  isOpen,
  onOpenChange,
  courses,
  membershipName,
}: MembershipCoursesDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = courses.filter((course: any) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-5xl overflow-hidden p-0">
        <div className="relative">
          <div className="bg-gradient-to-r from-brand to-brand/80 p-6">
            <div className="flex items-center justify-between">
              <div>
                <AlertDialogHeader className="space-y-1 p-0">
                  <AlertDialogTitle className="text-2xl font-bold text-white">
                    Danh sách khoá học
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-white/80">
                    {membershipName} • {courses.length} khóa học
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>
              <Button
                variant="ghost"
                className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-5 text-white" />
              </Button>
            </div>
          </div>

          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
            <div className="relative w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="size-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button className="flex items-center gap-1 border-gray-300">
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
                Sắp xếp
              </Button>
              <Button className="bg-brand text-white hover:bg-brand/90">
                Bắt đầu học
              </Button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {filteredCourses.map((course: any) => (
                <div
                  key={course.id}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={course.thumbnail}
                      alt={course.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Button
                        className="bg-white text-brand hover:bg-white/90"
                        onClick={() =>
                          (window.location.href = `/courses/${course.slug}`)
                        }
                      >
                        Xem trước
                      </Button>
                    </div>
                    {course.total_duration && (
                      <div className="absolute right-3 top-3 flex items-center rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                        <svg
                          className="mr-1 size-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatDuration(course.total_duration)}
                      </div>
                    )}
                  </div>

                  <div className="flex grow flex-col p-4">
                    <Link
                      className="font-bold text-gray-900"
                      style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      href={`/courses/${course.slug}`}
                    >
                      {course.name}
                    </Link>

                    <div className="mt-auto border-t border-gray-100 pt-3">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <i className="flaticon-calendar"></i>
                          <span>{course.lessons_count || 0} bài học</span>
                        </div>
                        <div className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                          Đã bao gồm
                        </div>
                      </div>

                      <Button
                        className="w-full bg-brand text-white hover:bg-brand/90"
                        onClick={() =>
                          course.current_lesson
                            ? (window.location.href = `/learning/${course.slug}/lesson/${course.current_lesson.id}`)
                            : (window.location.href = `/courses/${course.slug}`)
                        }
                      >
                        Học ngay
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DialogCourseMembership
