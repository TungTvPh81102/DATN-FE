'use client'

import { DataTable } from '@/components/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useGetCourseRevenueStatistics } from '@/hooks/instructor/use-statistic'
import { useDataTable } from '@/hooks/use-data-table'
import { CourseRevenueStatistics } from '@/types/Statistics'
import { DataTableFilterField } from '@/types/data-table'
import { useMemo, useState } from 'react'
import { getColumns } from './dashboard-courses-table-columns'
import { DashboardCoursesTableToolbarActions } from './dashboard-courses-table-toolbar-actions'
import {
  options,
  OptionType,
} from '@/sections/instructor/components/statistics/memberships-revenue-statistics'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const filterFields: DataTableFilterField<CourseRevenueStatistics>[] = [
  {
    id: 'name',
    label: 'Khóa học',
    placeholder: 'Tên khóa học...',
  },
]

const chartConfig = {
  purchase: {
    label: 'Doanh thu',
  },
  student: {
    label: 'Tổng học viên',
  },
  rating: {
    label: 'Đánh giá trung bình',
  },
  progress: {
    label: 'Tiến độ trung bình',
  },
} satisfies ChartConfig

export const DashboardCoursesTable = () => {
  const [view, setView] = useState<OptionType>('table')
  const { data, isLoading } = useGetCourseRevenueStatistics()

  console.log(data)

  const columns = useMemo(() => getColumns(), [])

  const chartData = useMemo(
    () =>
      data && data.length > 0
        ? data.map((item) => ({
            name: item.name,
            purchase: Number(item?.total_revenue ?? 0),
            student: Number(
              item?.total_student ??
                Math.floor(Math.random() * (30 - 15 + 1)) + 15
            ),
            rating: Number(
              item?.avg_rating ?? Math.floor(Math.random() * (30 - 15 + 1)) + 15
            ),
            progress: Number(
              item?.avg_progress ??
                Math.floor(Math.random() * (30 - 15 + 1)) + 15
            ),
          }))
        : [],
    [data]
  )

  console.log(chartData)

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    initialState: {
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id?.toString() ?? '',
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-4 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Tổng quan khóa học</CardTitle>
          <CardDescription>
            Tổng hợp thông tin khóa học, bao gồm doanh thu và đánh giá
          </CardDescription>
        </div>
        <Select
          value={view}
          onValueChange={(val) => setView(val as OptionType)}
        >
          <SelectTrigger
            className="w-fit rounded-lg"
            aria-label="Chọn chế độ hiển thị"
            hideArrow
          >
            <SelectValue placeholder={view} />
          </SelectTrigger>
          <SelectContent className="min-w-fit" align="end">
            {options.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="rounded-lg"
              >
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-4 sm:pt-6">
        {!isLoading ? (
          view === 'table' ? (
            <DataTable table={table}>
              <DataTableToolbar table={table} filterFields={filterFields}>
                <DashboardCoursesTableToolbarActions table={table} />
              </DataTableToolbar>
            </DataTable>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <BarChart data={chartData} margin={{ right: 0, left: 0 }}>
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey="name"
                  tick={false}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />

                <Bar
                  dataKey="purchase"
                  fill="#4f46e5"
                  radius={4}
                  yAxisId="right"
                />
                <Bar
                  dataKey="student"
                  fill="#10b981"
                  radius={4}
                  yAxisId="left"
                />
                <Bar
                  dataKey="rating"
                  fill="#f59e0b"
                  radius={4}
                  yAxisId="left"
                />

                {/* Tooltip */}
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => value}
                />

                {/* Legend */}
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          )
        ) : (
          <DataTableSkeleton
            columnCount={7}
            searchableColumnCount={1}
            cellWidths={['18rem', '6rem', '8rem', '6rem', '10rem', '2.5rem']}
            shrinkZero
          />
        )}
      </CardContent>
    </Card>
  )
}
