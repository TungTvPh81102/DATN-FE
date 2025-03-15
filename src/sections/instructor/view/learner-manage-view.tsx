'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import {
  Eye,
  MoreVertical,
  Users,
  UserPlus,
  BookOpen,
  Calendar,
  Mail,
} from 'lucide-react'

import { formatDate } from '@/lib/common'
import { useGetLearners } from '@/hooks/learner/useLearner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ModalLoading from '@/components/common/ModalLoading'
import { DataTable } from '@/components/shared/data-table'
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header'

const LearnerManageView = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: learnerData, isLoading } = useGetLearners()

  const filteredData = learnerData?.data?.filter((learner: any) => {
    const searchFields = ['name', 'email']
    return searchFields.some((field) =>
      learner[field]?.toLowerCase()?.includes(searchTerm.toLowerCase())
    )
  })

  const totalLearners = filteredData?.length || 0
  const totalCourses =
    filteredData?.reduce(
      (sum: number, learner: any) =>
        sum + (parseInt(learner.total_courses) || 0),
      0
    ) || 0
  const averageCoursesPerLearner =
    totalLearners > 0 ? (totalCourses / totalLearners).toFixed(1) : 0

  const columns: ColumnDef<any>[] = [
    {
      id: 'STT',
      accessorFn: (_row, index) => index + 1,
      cell: ({ getValue }: any) => (
        <div className="w-10 rounded-md bg-gray-50 px-3 py-2 text-center text-sm font-semibold text-gray-700">
          {getValue()}
        </div>
      ),
      size: 50,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Học viên" />
      ),
      cell: ({ row }) => {
        const learner = row.original
        return (
          <div className="flex min-w-80 items-center gap-4">
            <div className="relative size-12 overflow-hidden rounded-lg border-2 border-[#E27447]/20">
              <Image
                alt={learner.name ?? ''}
                className="rounded-lg object-cover"
                fill
                sizes="48px"
                src={learner?.avatar ?? '/placeholder-avatar.png'}
              />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="line-clamp-2 font-semibold text-gray-900">
                {learner.name}
              </h3>
              <div className="flex items-center text-xs text-gray-500">
                <Mail className="mr-1 size-3" />
                {learner.email}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'total_courses',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Khoá học đã sở hữu" />
      ),
      cell: ({ row }) => {
        const learner = row.original
        const courseCount = parseInt(learner.total_courses) || 0

        return (
          <div className="flex items-center">
            <div className="mr-3 flex size-9 items-center justify-center rounded-full bg-[#E27447]/10">
              <BookOpen className="size-5 text-[#E27447]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {courseCount} khoá học
              </h3>
              <p className="text-xs text-gray-500">
                {courseCount > 2 ? 'Học viên tích cực' : 'Học viên mới'}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'enrolled_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đã tham gia" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.enrolled_at)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return (
          <div className="flex items-center">
            <div className="mr-3 flex size-9 items-center justify-center rounded-full bg-[#E27447]/10">
              <Calendar className="size-5 text-[#E27447]" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {formatDate(row.original.enrolled_at, {
                  dateStyle: 'medium',
                })}
              </div>
              <p className="text-xs text-gray-500">{diffDays} ngày trước</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const learner = row.original
        const courseCount = parseInt(learner.total_courses) || 0

        let status, badgeStyle
        if (courseCount > 5) {
          status = 'VIP'
          badgeStyle = 'bg-amber-100 text-amber-800 border-amber-300'
        } else if (courseCount > 2) {
          status = 'Thành viên'
          badgeStyle = 'bg-green-100 text-green-800 border-green-300'
        } else {
          status = 'Mới'
          badgeStyle = 'bg-blue-100 text-blue-800 border-blue-300'
        }

        return (
          <Badge className={`border px-3 py-1 ${badgeStyle}`}>{status}</Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const learner = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="size-8 rounded-full p-0 hover:bg-[#E27447]/10 hover:text-[#E27447]"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  asChild
                  className="flex cursor-pointer items-center py-2"
                >
                  <Link
                    href={`/instructor/learner-manage/info/${learner.code}`}
                  >
                    <Eye className="mr-2 size-4 text-[#E27447]" /> Chi tiết học
                    viên
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex cursor-pointer items-center py-2">
                  <Mail className="mr-2 size-4 text-[#E27447]" /> Gửi email
                </DropdownMenuItem>
                <DropdownMenuItem className="flex cursor-pointer items-center py-2">
                  <Users className="mr-2 size-4 text-[#E27447]" /> Thêm vào nhóm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      meta: {
        className: 'sticky right-0 bg-background',
      },
    },
  ]

  if (isLoading) return <ModalLoading />

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-6">
      <div className="mt-2 space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý học viên
            </h1>
            <p className="mt-1 text-gray-500">
              Quản lý và theo dõi danh sách học viên của bạn
            </p>
          </div>
          <Button className="flex items-center gap-2 rounded-lg bg-[#E27447] text-white shadow-sm hover:bg-[#D06337]">
            <UserPlus className="size-4" />
            Tạo nhóm hỗ trợ học tập
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="mr-4 flex size-12 items-center justify-center rounded-lg bg-[#E27447]/10">
                <Users className="size-6 text-[#E27447]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số học viên</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {totalLearners}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="mr-4 flex size-12 items-center justify-center rounded-lg bg-[#E27447]/10">
                <BookOpen className="size-6 text-[#E27447]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng khóa học đã bán</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {totalCourses}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="mr-4 flex size-12 items-center justify-center rounded-lg bg-[#E27447]/10">
                <div className="text-lg font-bold text-[#E27447]">Ø</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Trung bình khóa học/học viên
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {averageCoursesPerLearner}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="border-b border-[#E27447]/20 bg-[#E27447]/10 py-4">
            <CardTitle className="text-xl text-gray-900">
              Danh sách học viên
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4">
              <DataTable
                columns={columns}
                data={filteredData || []}
                isLoading={isLoading}
                onSearchChange={setSearchTerm}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LearnerManageView
