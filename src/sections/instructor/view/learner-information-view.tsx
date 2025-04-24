'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, CartesianGrid } from 'recharts'
import { useGetLearnerProcess } from '@/hooks/learner/useLearner'
import {
  Award,
  Book,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  GraduationCap,
  LineChart,
  Loader2,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/common'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import Container from '@/components/shared/container'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface CourseOverview {
  total_courses: number
  completed_courses: number
  ongoing_courses: number
  average_progress: number
}

interface RecentLesson {
  name: string
  completed_at: string | undefined
}

interface Course {
  course_id: string
  name: string
  progress: number
  status: 'completed' | 'ongoing'
  enrolled_at: string
  recent_lesson?: RecentLesson
}

const chartConfig = {
  hours: {
    label: 'Số giờ',
    color: '#EA580C',
  },
} satisfies ChartConfig

const TIME_RANGES = [
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày qua', value: '7days' },
  { label: '2 tuần gần đây', value: '2weeks' },
  { label: '1 tháng gần đây', value: '1month' },
  { label: '3 tháng gần đây', value: '3months' },
  { label: '6 tháng gần đây', value: '6months' },
]

const LearnerInformationView = ({ code }: { code: string }) => {
  const [courseList, setCourseList] = useState<Course[]>([])
  const [courseOverView, setCourseOverView] = useState<CourseOverview | null>(
    null
  )
  const [timeRange, setTimeRange] = useState<string>('7days')
  const params = useMemo(() => {
    const endDate = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case '7days':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '2weeks':
        startDate.setDate(startDate.getDate() - 14)
        break
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    return {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    }
  }, [timeRange])

  const { data: learnerProcess, isLoading } = useGetLearnerProcess(code, params)

  useEffect(() => {
    if (learnerProcess?.data) {
      setCourseOverView(learnerProcess.data.overview)
      setCourseList(learnerProcess.data.courses)
    }
  }, [learnerProcess])

  return (
    <Container>
      <div className="mb-8 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 p-6 shadow-md">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 border-2 border-white shadow-lg">
              <AvatarImage
                src={learnerProcess?.data?.user?.avatar || ''}
                alt={learnerProcess?.data?.user?.name || 'Học viên'}
              />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                {learnerProcess?.data?.user?.name?.charAt(0) || 'H'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {learnerProcess?.data?.user?.name || 'Học viên'}
              </h1>
              <p className="text-gray-500">Mã học viên: {code}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group overflow-hidden border-none shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="h-1.5 bg-gradient-to-r from-orange-400 to-[#E27447]"></div>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-orange-100 p-3 shadow-md transition-all duration-300 group-hover:bg-orange-200 group-hover:shadow-lg">
                <Book className="size-6 text-[#E27447]" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-[#E27447] transition-all duration-300 group-hover:scale-110">
                  {courseOverView?.total_courses || 0}
                </h3>
                <p className="mt-2 font-medium text-gray-600">
                  Tổng số khóa học
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-none shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="h-1.5 bg-gradient-to-r from-green-400 to-green-600"></div>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-green-100 p-3 shadow-md transition-all duration-300 group-hover:bg-green-200 group-hover:shadow-lg">
                <CheckCircle className="size-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-green-600 transition-all duration-300 group-hover:scale-110">
                  {courseOverView?.completed_courses || 0}
                </h3>
                <p className="mt-2 font-medium text-gray-600">
                  Khóa học đã hoàn thành
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-none shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-blue-100 p-3 shadow-md transition-all duration-300 group-hover:bg-blue-200 group-hover:shadow-lg">
                <Clock className="size-6 text-blue-600" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-600 transition-all duration-300 group-hover:scale-110">
                  {courseOverView?.ongoing_courses || 0}
                </h3>
                <p className="mt-2 font-medium text-gray-600">
                  Khóa học đang học
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-none shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="h-1.5 bg-gradient-to-r from-purple-400 to-purple-600"></div>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-purple-100 p-3 shadow-md transition-all duration-300 group-hover:bg-purple-200 group-hover:shadow-lg">
                <LineChart className="size-6 text-purple-600" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-purple-600 transition-all duration-300 group-hover:scale-110">
                  {courseOverView?.average_progress || 0}%
                </h3>
                <p className="mt-2 font-medium text-gray-600">
                  Tiến độ trung bình
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="mb-6 flex w-full justify-start gap-2 rounded-lg border-none bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="rounded-full border border-gray-200 bg-white px-6 py-2.5 data-[state=active]:border-[#E27447] data-[state=active]:bg-[#E27447] data-[state=active]:text-white"
            >
              <Book className="mr-2 size-4" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger
              value="lessons"
              className="rounded-full border border-gray-200 bg-white px-6 py-2.5 data-[state=active]:border-[#E27447] data-[state=active]:bg-[#E27447] data-[state=active]:text-white"
            >
              <GraduationCap className="mr-2 size-4" />
              Bài học & Chứng chỉ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="col-span-1 overflow-hidden border-none shadow-md lg:col-span-2">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-[#E27447]">
                      <Clock className="size-5" />
                      Thời gian học
                    </CardTitle>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger
                        className="w-fit border-[#E27447] bg-white text-[#E27447]"
                        aria-label="Chọn khoảng thời gian"
                        hideArrow
                      >
                        <SelectValue placeholder="Chọn khoảng thời gian" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl" align="end">
                        {TIME_RANGES.map((range) => (
                          <SelectItem
                            key={range.value}
                            value={range.value}
                            className="rounded-lg"
                          >
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <CardDescription>Thời gian học tập gần đây</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart
                      data={learnerProcess?.data?.study_time?.weeklyData || []}
                      accessibilityLayer
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="week"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="hours"
                        fill="#EA580C"
                        radius={8}
                        name="Số giờ học"
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="leading-none text-[#E27447]">
                    Thông kê thời gian học tập của học viên
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-medium text-[#E27447]">
                      Tổng thời gian học:{' '}
                      <span className="font-bold">
                        {learnerProcess?.data?.study_time?.totalHours || 0} giờ
                      </span>
                    </span>
                  </div>
                </CardFooter>
              </Card>
              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100 pb-4">
                  <CardTitle className="flex items-center gap-2 text-[#E27447]">
                    <Book className="size-5" />
                    Danh sách khóa học
                  </CardTitle>
                  <CardDescription>
                    Các khóa học đã đăng ký và tiến độ học tập
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {courseList?.map((course) => (
                      <div
                        key={course.course_id}
                        className="group rounded-lg p-3 transition-all hover:bg-orange-50"
                      >
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm font-medium group-hover:text-[#E27447]">
                            {course.name}
                          </span>
                          <span className="text-sm font-medium text-[#E27447]">
                            {course.progress}%
                          </span>
                        </div>
                        <Progress
                          value={course.progress}
                          className="mt-2 h-2"
                        />
                        <div className="mt-3 flex justify-between">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              course.status === 'completed'
                                ? 'border-green-200 bg-green-100 text-green-700'
                                : 'border-orange-200 bg-orange-100 text-[#E27447]'
                            }`}
                          >
                            {course.status === 'completed'
                              ? 'Đã hoàn thành'
                              : 'Đang học'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Ngày đăng ký: {formatDate(course.enrolled_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lessons">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="col-span-1 border-none shadow-md lg:col-span-2">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100 pb-4">
                  <CardTitle className="flex items-center gap-2 text-[#E27447]">
                    <Award className="size-5" />
                    Chứng chỉ đã đạt được
                  </CardTitle>
                  <CardDescription>
                    Danh sách chứng chỉ sau khi hoàn thành khóa học
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-12">
                      <Loader2 className="size-10 animate-spin text-[#E27447]" />
                      <p className="text-sm text-gray-500">
                        Đang tải dữ liệu chứng chỉ...
                      </p>
                    </div>
                  ) : learnerProcess?.data?.certificate &&
                    learnerProcess.data.certificate.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-gray-100">
                      <Table>
                        <TableHeader className="bg-orange-50">
                          <TableRow>
                            <TableHead className="font-medium text-[#E27447]">
                              Tên khóa học
                            </TableHead>
                            <TableHead className="font-medium text-[#E27447]">
                              Mã chứng chỉ
                            </TableHead>
                            <TableHead className="font-medium text-[#E27447]">
                              Ngày cấp
                            </TableHead>
                            <TableHead className="font-medium text-[#E27447]">
                              Chứng chỉ
                            </TableHead>
                            <TableHead className="text-right font-medium text-[#E27447]">
                              Thao tác
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {learnerProcess.data.certificate.map((cert: any) => (
                            <TableRow
                              key={cert.id}
                              className="transition-colors hover:bg-orange-50"
                            >
                              <TableCell className="font-medium">
                                {cert.course_name}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {cert.code}
                              </TableCell>
                              <TableCell>
                                {formatDate(cert.issued_at)}
                              </TableCell>
                              <TableCell className="cursor-pointer">
                                <Dialog>
                                  <DialogTrigger>
                                    <div className="relative h-20 w-28 cursor-pointer overflow-hidden rounded-md border border-gray-200 transition-all hover:border-[#E27447]">
                                      <div className="absolute inset-0 animate-pulse rounded bg-orange-100" />
                                      <Image
                                        src={cert.file_path.replace(
                                          '.pdf',
                                          '.jpg'
                                        )}
                                        alt={cert.course_name}
                                        fill
                                        className="rounded object-contain"
                                        onLoad={(e) => {
                                          const target = e.target as HTMLElement
                                          target.previousElementSibling?.remove()
                                        }}
                                      />
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl border-none p-1 shadow-xl">
                                    <div className="relative h-[80vh] w-full">
                                      <Image
                                        src={cert.file_path.replace(
                                          '.pdf',
                                          '.jpg'
                                        )}
                                        alt={cert.course_name}
                                        fill
                                        className="rounded-lg object-contain"
                                        priority
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                              <TableCell className="text-right">
                                <Link
                                  href={cert.file_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex h-9 items-center justify-center rounded-md bg-[#E27447] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#c15a33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E27447] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                >
                                  Xem chứng chỉ
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg bg-orange-50 py-12 text-center">
                      <div className="mb-4 rounded-full bg-white p-4 shadow-md">
                        <Award className="size-8 text-[#E27447]" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#E27447]">
                        Chưa có chứng chỉ
                      </h3>
                      <p className="mt-2 max-w-md text-sm text-gray-600">
                        Hoàn thành các khóa học để nhận chứng chỉ. Mỗi khóa học
                        hoàn thành sẽ cấp cho bạn một chứng chỉ giá trị.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-gray-100 bg-orange-50">
                  <CardTitle className="flex items-center gap-2 text-[#E27447]">
                    <Clock className="size-5" />
                    Bài học gần đây
                  </CardTitle>
                  <CardDescription>
                    Các bài học bạn đã hoàn thành gần đây
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {courseList && courseList.length > 0 ? (
                    <div className="space-y-3">
                      {courseList
                        .filter((course) => course.recent_lesson)
                        .map((course) => (
                          <div
                            key={course.course_id}
                            className="flex items-start space-x-4 rounded-lg border border-gray-100 p-4 transition-all hover:border-[#E27447] hover:bg-orange-50 hover:shadow-sm"
                          >
                            <div className="shrink-0 rounded-full bg-orange-100 p-3">
                              <Clock className="size-5 text-[#E27447]" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {course.recent_lesson?.name}
                              </p>
                              <p className="text-sm text-[#E27447]">
                                {course.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Hoàn thành:{' '}
                                {course.recent_lesson?.completed_at
                                  ? formatDate(
                                      course.recent_lesson.completed_at
                                    )
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
                              {course.status === 'completed'
                                ? 'Đã hoàn thành'
                                : 'Đang học'}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex h-[200px] flex-col items-center justify-center rounded-lg bg-orange-50">
                      <Clock className="mb-3 size-10 text-[#E27447] opacity-75" />
                      <p className="text-sm font-medium text-[#E27447]">
                        Chưa có bài học nào được hoàn thành
                      </p>
                      <p className="mt-2 text-xs text-gray-600">
                        Hãy bắt đầu học để xem lịch sử của bạn
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}

export default LearnerInformationView
