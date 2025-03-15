'use client'

import Container from '@/components/shared/container'
import { Button } from '@/components/ui/button'
import { BookOpen, UserPlus, Users } from 'lucide-react'
import LearnersTable from '../components/learners-manage/learners-table'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetLearners } from '@/hooks/learner/useLearner'

const LearnerManageView = () => {
  const { data, isLoading } = useGetLearners()

  const totalLearners = data?.length || 0
  const totalCourses =
    data?.reduce(
      (sum: number, learner: any) =>
        sum + (parseInt(learner.total_courses) || 0),
      0
    ) || 0
  const averageCoursesPerLearner =
    totalLearners > 0 ? (totalCourses / totalLearners).toFixed(1) : 0

  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Quản lý học viên</h1>
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
        <CardContent className="p-4">
          <LearnersTable data={data} isLoading={isLoading} />
        </CardContent>
      </Card>
    </Container>
  )
}

export default LearnerManageView
