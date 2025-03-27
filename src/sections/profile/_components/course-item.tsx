import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatStringToCurrency } from '@/lib/common'
import { InstructorCourse } from '@/types'
import { Bookmark, Clock, FileText, Star, UserPen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type Props = {
  course: InstructorCourse
}

export const CourseItem = ({ course }: Props) => {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="absolute left-0 top-0 z-10 flex flex-col gap-2 p-3">
        {course?.is_free ? (
          <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-1 text-xs font-medium text-white shadow-lg">
            Miễn phí
          </div>
        ) : (
          +course.price_sale > 0 &&
          !course?.is_free && (
            <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-4 py-1 text-xs font-medium text-white shadow-lg">
              Giảm{' '}
              {Math.round(
                ((Number(course?.price) - Number(course?.price_sale)) /
                  Number(course?.price)) *
                  100
              )}
              %
            </div>
          )
        )}
      </div>

      <div className="relative h-52 w-full overflow-hidden">
        <Link href={`/courses/${course?.slug}`}>
          <Image
            src={course?.thumbnail ?? ''}
            alt={course?.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        <button
          className={`absolute right-3 top-3 rounded-full bg-white/90 p-2.5 shadow-md transition-all duration-300 hover:bg-white ${isBookmarked ? 'text-orange-500' : 'text-gray-600'}`}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark
            size={18}
            className={isBookmarked ? 'fill-orange-500' : ''}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-4">
          <Link
            style={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            href={`/courses/${course?.slug}`}
            className="block text-base font-semibold hover:text-orange-500"
          >
            {course?.name}
          </Link>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1">
                    <Clock size={15} className="text-blue-500" />
                    <span className="font-medium">4.5 giờ</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-blue-600 text-white"
                >
                  <p>Thời lượng khóa học</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1">
                    <FileText size={15} className="text-teal-500" />
                    <span className="font-medium">
                      {course?.lessons_count ?? 0} bài học
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-teal-600 text-white"
                >
                  <p>Số lượng bài học</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
          <div>
            {course?.is_free ? (
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-xl font-bold text-transparent">
                Miễn phí
              </span>
            ) : +course.price_sale > 0 ? (
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-xl font-bold text-transparent">
                  {formatStringToCurrency(course?.price_sale ?? 0)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatStringToCurrency(course?.price ?? 0)}
                </span>
              </div>
            ) : (
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                {formatStringToCurrency(course?.price ?? 0)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-blue-600">
              <UserPen size={16} className="text-blue-600" />
              <span className="font-medium">
                {course?.total_student?.toLocaleString() ?? 0} học viên
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-amber-600">
              <Star size={16} className="fill-amber-500" />
              <span className="font-bold">{course?.avg_rating ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
