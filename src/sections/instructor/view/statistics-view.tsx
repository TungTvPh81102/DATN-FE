'use client'

import Container from '@/components/shared/container'
import OverviewStatistics from '../components/statistics/overview-statistics'
import RevenueChart from '../components/statistics/revenue-chart'
import StudentPurchaseChart from '../components/statistics/student-purchase-chart'
import { DashboardCoursesTable } from '../components/statistics/table/dashboard-courses-table'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import RatingStatistics from '@/sections/instructor/components/statistics/rating-statistics'
import FollowStatistics from '@/sections/instructor/components/statistics/follow-statistics'

const StatisticsView = () => {
  const { open } = useSidebar()

  return (
    <Container>
      <div className="flex flex-col justify-center gap-2">
        <h1 className="text-xl font-medium leading-none">
          Thống kê khóa học & doanh thu
        </h1>
        <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
          Phân tích hiệu quả khóa học của bạn
        </div>
      </div>

      <div
        className={cn(
          'grid items-stretch gap-5 lg:gap-8 xl:grid-cols-3',
          !open && 'lg:grid-cols-2'
        )}
      >
        <div className="xl:col-span-1">
          <OverviewStatistics />
        </div>
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
      </div>

      <StudentPurchaseChart />

      <DashboardCoursesTable />

      <RatingStatistics />
      <FollowStatistics />
    </Container>
  )
}
export default StatisticsView
