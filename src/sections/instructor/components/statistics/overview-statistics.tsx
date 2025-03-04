'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useGetOverviewStatistics } from '@/hooks/instructor/use-statistic'
import { formatCurrency } from '@/lib/common'
import { CircleDollarSign, Folder, Star, UsersRound } from 'lucide-react'

const OverviewStatistics = () => {
  const { data: overviewStatistics } = useGetOverviewStatistics()

  return (
    <div className="grid h-full grid-cols-2 items-stretch gap-5 lg:gap-8">
      <Card className="channel-stats-bg flex h-full flex-col justify-between gap-6 bg-cover bg-[left_top_-1.7rem] bg-no-repeat">
        <div className="ms-5 mt-4 inline-flex size-14 items-center justify-center rounded-xl bg-primary/15">
          <Folder className="text-primary" />
        </div>

        <CardContent className="flex flex-col gap-1">
          <span className="text-2xl font-semibold">
            {overviewStatistics?.totalCourse}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            Tổng số khóa học
          </span>
        </CardContent>
      </Card>

      <Card className="channel-stats-bg flex h-full flex-col justify-between gap-6 bg-cover bg-[left_top_-1.7rem] bg-no-repeat">
        <div className="ms-5 mt-4 inline-flex size-14 items-center justify-center rounded-xl bg-primary/15">
          <CircleDollarSign className="text-primary" />
        </div>
        <CardContent className="flex flex-col gap-1">
          <span className="text-2xl font-semibold">
            {formatCurrency(
              overviewStatistics?.totalRevenue
                ? +overviewStatistics.totalRevenue
                : 0
            )}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            Tổng doanh thu
          </span>
        </CardContent>
      </Card>

      <Card className="channel-stats-bg flex h-full flex-col justify-between gap-6 bg-cover bg-[left_top_-1.7rem] bg-no-repeat">
        <div className="ms-5 mt-4 inline-flex size-14 items-center justify-center rounded-xl bg-primary/15">
          <UsersRound className="text-primary" />
        </div>

        <CardContent className="flex flex-col gap-1">
          <span className="text-2xl font-semibold">
            {overviewStatistics?.totalEnrollments}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            Số học viên
          </span>
        </CardContent>
      </Card>

      <Card className="channel-stats-bg flex h-full flex-col justify-between gap-6 bg-cover bg-[left_top_-1.7rem] bg-no-repeat">
        <div className="ms-5 mt-4 inline-flex size-14 items-center justify-center rounded-xl bg-primary/15">
          <Star className="text-primary" />
        </div>

        <CardContent className="flex flex-col gap-1">
          <span className="text-2xl font-semibold">
            {overviewStatistics?.averageRating}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            Đánh giá trung bình
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
export default OverviewStatistics
