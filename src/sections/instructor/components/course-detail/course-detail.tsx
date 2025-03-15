'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Award, BookOpen, Clock, Eye, Users, Video } from 'lucide-react'

import { useGetCourseListOfUser } from '@/hooks/instructor/course/useCourse'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ModalLoading from '@/components/common/ModalLoading'
import { DataTable } from '@/components/shared/data-table'
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header'
import DialogLiveStreamCreate from '@/sections/instructor/components/course-detail/_components/dialog-live-stream-create'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Container from '@/components/shared/container'

const getLocalizedLevel = (level: string) => {
  switch (level) {
    case 'advanced':
      return 'Chuyên sâu'
    case 'intermediate':
      return 'Nâng cao'
    case 'beginner':
      return 'Dễ'
    default:
      return 'Không xác định'
  }
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'advanced':
      return 'bg-red-100 text-red-800'
    case 'intermediate':
      return 'bg-blue-100 text-blue-800'
    case 'beginner':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const CourseDetailView = ({ slug }: { slug: string }) => {
  const [courseData, setCourseData] = useState<any>(null)
  const [studentData, setStudentData] = useState<any>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [openCreateLiveSteam, setIsOpenCreateLiveStream] = useState(false)

  const { data: courseListOfUser, isLoading } = useGetCourseListOfUser(slug)

  useEffect(() => {
    if (courseListOfUser) {
      setCourseData(courseListOfUser?.data.course)
      setStudentData(courseListOfUser.data.student_progress)
    }
  }, [courseListOfUser, courseData, studentData])

  const filteredData = studentData?.filter((student: any) => {
    const searchFields = ['user_name', 'progress']
    return searchFields.some((field) =>
      student[field]?.toLowerCase()?.includes(searchTerm.toLowerCase())
    )
  })

  const columns: ColumnDef<any[]>[] = [
    {
      header: 'STT',
      accessorFn: (_row, index) => index + 1,
      cell: ({ getValue }: any) => (
        <div className="text-sm font-medium text-gray-900">{getValue()}</div>
      ),
      size: 50,
    },
    {
      accessorKey: 'user_name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Học viên" />
      ),
      cell: ({ row }: any) => {
        const student = row.original
        return (
          <div className="flex items-center gap-2">
            <Image
              alt={student.user_name}
              className="rounded-full object-cover"
              src={student.user_avatar || ''}
              width={30}
              height={30}
            />
            <p className="text-sm font-medium text-gray-900">
              {student.user_name}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: 'progress_percent',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Tiến độ" />
      ),
      cell: ({ row }: any) => {
        const student = row.original
        return (
          <p className="text-sm font-medium text-gray-900">
            {student.progress_percent} %
          </p>
        )
      },
    },
    {
      accessorKey: 'enrolled_at',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Đã tham gia" />
      ),
      cell: ({ row }: any) => {
        const student = row.original
        return student.enrolled_at ? (
          <Badge variant="info">
            {format(new Date(student.enrolled_at), 'dd/MM/yyyy')}
          </Badge>
        ) : (
          <Badge variant="secondary">Chưa tham gia</Badge>
        )
      },
    },
    {
      accessorKey: 'completed_at',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Hoàn thành" />
      ),
      cell: ({ row }: any) => {
        const student = row.original
        return student.completed_at ? (
          <span className="text-sm font-medium">
            <Badge variant="success">
              {format(new Date(student.completed_at), 'dd/MM/yyyy')}
            </Badge>
          </span>
        ) : (
          <Badge variant="secondary">Chưa hoàn thành</Badge>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Hành động',
      cell: ({ row }: any) => {
        const student = row.original

        const handleView = () => {
          console.log(`Viewing details for ${student.user_name}`)
        }

        return (
          <Button onClick={handleView}>
            <Eye />
          </Button>
        )
      },
    },
  ]

  if (isLoading) {
    return <ModalLoading />
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết khoá học
            </h1>
            <p className="mt-1 text-gray-500">
              Quản lý thông tin và học viên của khoá học
            </p>
          </div>
          <div className="flex gap-3">
            <div>
              <Link href="/instructor/courses">
                <Button variant="outline">Khoá học của tôi</Button>
              </Link>
            </div>
            <Button className="rounded-lg bg-green-600 text-white shadow-sm hover:bg-green-700">
              <Users className="mr-2 size-4" />
              Tạo nhóm học tập
            </Button>
            <Button
              onClick={() => setIsOpenCreateLiveStream(true)}
              className="rounded-lg bg-[#E27447] text-white shadow-sm hover:bg-[#D06337]"
            >
              <Video className="mr-2 size-4" />
              Phát trực tiếp
            </Button>
          </div>
        </div>
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="border-b border-[#E27447]/20 bg-[#E27447]/10">
            <CardTitle className="text-xl text-gray-900">
              Thông tin khoá học
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="relative h-[180px] min-w-[240px] overflow-hidden rounded-xl shadow-md">
                  <Image
                    src={courseData?.thumbnail || '/placeholder-course.png'}
                    alt={courseData?.name}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-center text-sm text-white">
                    Mã: {courseData?.code}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                      {courseData?.name}
                    </h1>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge
                        className={`${getLevelColor(courseData?.level)} px-3 py-1 font-medium`}
                      >
                        <Award className="mr-1 size-4" />
                        {getLocalizedLevel(courseData?.level)}
                      </Badge>
                      <Badge className="bg-purple-100 px-3 py-1 font-medium text-purple-800">
                        {courseData?.category?.name}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-lg bg-[#E27447]/5 p-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[#E27447]/20">
                        <Users className="size-5 text-[#E27447]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Học viên tham gia
                        </p>
                        <p className="text-lg font-semibold">
                          {courseData?.total_student || 0} học viên
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-[#E27447]/5 p-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[#E27447]/20">
                        <BookOpen className="size-5 text-[#E27447]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Chương / Bài học
                        </p>
                        <p className="text-lg font-semibold">
                          {courseListOfUser?.data.total_chapter || 0} /{' '}
                          {courseListOfUser?.data.total_lesson || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-[#E27447]/5 p-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[#E27447]/20">
                        <Clock className="size-5 text-[#E27447]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Thời lượng</p>
                        <p className="text-lg font-semibold">
                          {courseData?.total_hours || '00:00:00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-medium">Thông tin giá</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Giá gốc:</span>
                      <span className="text-lg font-semibold">
                        {Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(courseData?.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Giá khuyến mãi:</span>
                      <span
                        className={`text-lg font-semibold ${courseData?.price_sale !== '0.00' ? 'text-green-600' : ''}`}
                      >
                        {courseData?.price_sale === '0.00'
                          ? 'Không áp dụng'
                          : Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(courseData?.price_sale)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-medium">Cài đặt khác</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="border-[#E27447] text-[#E27447] hover:bg-[#E27447] hover:text-white"
                    >
                      Chỉnh sửa khoá học
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#E27447] text-[#E27447] hover:bg-[#E27447] hover:text-white"
                    >
                      Quản lý bài học
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#E27447] text-[#E27447] hover:bg-[#E27447] hover:text-white"
                    >
                      Thiết lập giá
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="py-6">
        <h1 className="mb-4 text-xl font-bold">Danh sách học viên</h1>
        <DataTable
          isLoading={isLoading}
          columns={columns}
          onSearchChange={setSearchTerm}
          data={filteredData || []}
        />
      </div>
      {openCreateLiveSteam && (
        <DialogLiveStreamCreate
          open={openCreateLiveSteam}
          onOpenChange={setIsOpenCreateLiveStream}
        />
      )}
    </Container>
  )
}

export default CourseDetailView
