import React from 'react'
import {
  Check,
  BookOpen,
  Award,
  BarChart3,
  TrendingUp,
  Target,
} from 'lucide-react'
import { ISummary } from '@/types/Common'

interface CourseSummaryProps {
  summary: ISummary
}

const CourseSummary = ({ summary }: CourseSummaryProps) => {
  return (
    <div className="mb-10 overflow-hidden rounded-2xl border bg-gradient-to-br from-white to-gray-50">
      <div className="relative bg-gradient-to-r from-[#E27447] to-[#F08A60] px-8 py-6">
        <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -right-4 -top-4 size-20 rounded-full bg-white/10 blur-xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 *:text-white">
            <Target className="size-5" />
            <h3 className="text-2xl font-bold tracking-tight">
              Tổng quan học tập của bạn
            </h3>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <TrendingUp className="size-4" />
            <span>Tiến trình</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-8 *:cursor-pointer sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#E27447]/30 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-[#E27447]/5 blur-2xl"></div>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#E27447]/20 to-[#E27447]/10 p-3">
              <BookOpen className="size-8 text-[#E27447]" />
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#E27447]/10 to-[#E27447]/5 text-sm font-semibold text-[#E27447]">
              #{summary.total_courses > 0 ? 1 : 0}
            </div>
          </div>
          <p className="mb-1 text-sm font-medium uppercase tracking-wider text-gray-500">
            Tổng số khóa học
          </p>
          <div className="flex items-baseline">
            <p className="text-4xl font-extrabold text-gray-900">
              {summary.total_courses}
            </p>
            <p className="ml-2 text-sm font-medium text-gray-500">khóa học</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-green-100/50 blur-2xl"></div>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-200 to-green-100 p-3">
              <Check className="size-8 text-green-600" />
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-50 text-sm font-semibold text-green-600">
              #{parseInt(summary.completed_lessons.split('/')[0]) > 0 ? 2 : 0}
            </div>
          </div>
          <p className="mb-1 text-sm font-medium uppercase tracking-wider text-gray-500">
            Bài học đã hoàn thành
          </p>
          <div className="flex items-baseline">
            <p className="text-4xl font-extrabold text-gray-900">
              {summary.completed_lessons.split('/')[0]}
            </p>
            <p className="ml-2 text-sm font-medium text-gray-500">
              / {summary.completed_lessons.split('/')[1]}
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#E27447]/30 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-[#E27447]/5 blur-2xl"></div>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#E27447]/20 to-[#E27447]/10 p-3">
              <BarChart3 className="size-8 text-[#E27447]" />
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#E27447]/10 to-[#E27447]/5 text-sm font-semibold text-[#E27447]">
              #{summary.average_progress > 0 ? 3 : 0}
            </div>
          </div>
          <p className="mb-1 text-sm font-medium uppercase tracking-wider text-gray-500">
            Tiến độ trung bình
          </p>
          <div className="mt-2 flex flex-col space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-4xl font-extrabold text-gray-900">
                {summary.average_progress}%
              </p>
              <p className="text-sm font-medium text-gray-500">hoàn thành</p>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#E27447] to-[#F08A60]"
                style={{
                  width: `${summary.average_progress}%`,
                  transition: 'all 1s ease-out',
                }}
              >
                <div className="size-full animate-pulse bg-white opacity-30"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-purple-100/50 blur-2xl"></div>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-200 to-purple-100 p-3">
              <Award className="size-8 text-purple-600" />
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-50 text-sm font-semibold text-purple-600">
              #{summary.completed_courses > 0 ? 4 : 0}
            </div>
          </div>
          <p className="mb-1 text-sm font-medium uppercase tracking-wider text-gray-500">
            Khóa học đã hoàn thành
          </p>
          <div className="flex items-baseline">
            <p className="text-4xl font-extrabold text-gray-900">
              {summary.completed_courses}
            </p>
            <p className="ml-2 text-sm font-medium text-gray-500">khóa học</p>
          </div>
          {summary.completed_courses > 0 && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                <Check className="mr-1 size-3" /> Đã hoàn thành
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseSummary
