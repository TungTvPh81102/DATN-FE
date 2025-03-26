'use client'

import { CircleDollarSign, Folder, Star, UsersRound } from 'lucide-react'
import CountUp from 'react-countup'

import { Card, CardContent } from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import { useGetOverviewStatistics } from '@/hooks/instructor/use-statistic'
import { formatVietnameseCurrency } from '@/lib/common'
import { cn } from '@/lib/utils'

const OverviewStatistics = () => {
  const { data: overviewStatistics } = useGetOverviewStatistics()
  const { open } = useSidebar()

  return (
    <div
      className={cn(
        'grid h-full items-stretch gap-3 lg:gap-5',
        open
          ? 'md:grid-cols-2 lg:grid-cols-4'
          : 'md:grid-cols-4 lg:grid-cols-2',
        'xl:grid-cols-2'
      )}
    >
      <Card className="channel-stats-bg flex h-full flex-col justify-between gap-6 bg-cover bg-[left_top_-1.7rem] bg-no-repeat">
        <div className="ms-5 mt-4 inline-flex size-14 items-center justify-center rounded-xl bg-primary/15">
          <Folder className="text-primary" />
        </div>

        <CardContent className="flex flex-col gap-1">
          <span className="text-2xl font-semibold">
            <CountUp end={overviewStatistics?.totalCourse ?? 0} />
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
        <CardContent className="flex flex-col gap-1 p-5 pt-0">
          <CountUp
            end={
              overviewStatistics?.totalRevenue
                ? +overviewStatistics?.totalRevenue
                : 0
            }
            formattingFn={formatVietnameseCurrency}
            className="truncate text-2xl font-semibold"
          />
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
          <CountUp
            end={overviewStatistics?.totalEnrollments ?? 0}
            separator="."
            className="text-2xl font-semibold"
          />
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
          <CountUp
            end={
              overviewStatistics?.averageRating
                ? +overviewStatistics.averageRating
                : 0
            }
            decimals={1}
            decimal=","
            className="text-2xl font-semibold"
          />
          <span className="text-sm font-normal text-muted-foreground">
            Đánh giá trung bình
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
export default OverviewStatistics
