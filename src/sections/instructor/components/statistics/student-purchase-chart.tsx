'use client'

import { useMemo, useState } from 'react'
import CountUp from 'react-countup'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetStudentPurchaseStatistics } from '@/hooks/instructor/use-statistic'

const chartConfig = {
  purchase: {
    label: 'Lượt mua mới',
    color: 'hsl(var(--primary))',
  },
  student: {
    label: 'Học viên mới',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

const StudentPurchaseChart = () => {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear + '')

  const { data, isLoading } = useGetStudentPurchaseStatistics(+year)

  const chartData = useMemo(
    () =>
      data
        ? Object.entries(data).map(([key, value]) => ({
            month: key,
            purchase: value.total_purchases,
            student: value.total_students,
          }))
        : [],
    [data]
  )

  const total = useMemo(
    () => ({
      purchase: chartData.reduce((acc, curr) => acc + curr.purchase, 0),
      student: chartData.reduce((acc, curr) => acc + curr.student, 0),
    }),
    [chartData]
  )

  return (
    <Card>
      <CardHeader className="flex items-center gap-4 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Số lượng học viên & lượt mua</CardTitle>
          <CardDescription>
            Biểu đồ thống kê số học viên đăng ký và lượt mua mới hàng tháng
          </CardDescription>
        </div>
        <div className="flex">
          {['purchase', 'student'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <div
                key={chart}
                className="relative z-30 flex flex-col justify-center gap-1 border-r px-4 py-2 text-left sm:px-6 sm:py-4"
              >
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  <CountUp end={total[key as keyof typeof total]} />
                </span>
              </div>
            )
          })}
          <div className="relative z-30 flex items-center py-2 pl-4 sm:py-4 sm:pl-6">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger
                className="w-fit rounded-lg"
                aria-label="Chọn năm"
                hideArrow
              >
                <SelectValue placeholder={currentYear} />
              </SelectTrigger>
              <SelectContent className="min-w-fit" align="end">
                {Array.from({ length: 5 }, (_, i) => currentYear - i).map(
                  (y) => (
                    <SelectItem key={y} value={y + ''} className="rounded-lg">
                      {y}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-4 sm:pt-6">
        {!isLoading ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[350px] w-full"
          >
            <BarChart data={chartData} margin={{ right: 0, left: 0 }}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={16}
                tickFormatter={(value) => {
                  return `Thg ${value}`
                }}
              />

              <Bar dataKey="purchase" fill="var(--color-purchase)" radius={4} />
              <Bar dataKey="student" fill="var(--color-student)" radius={4} />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `Tháng ${value}`}
              />

              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        ) : (
          <ChartSkeleton />
        )}
      </CardContent>
    </Card>
  )
}

export default StudentPurchaseChart

function generateFakeData() {
  const data: {
    [key: number]: { col1: number; col2: number }
  } = {}

  for (let i = 1; i <= 12; i++) {
    data[i] = {
      col1: Math.floor(Math.random() * 100),
      col2: Math.floor(Math.random() * 100),
    }
  }

  return data
}

const chartSkeletonConfig = {
  col1: {
    label: 'Cột 1',
    color: 'rgb(0 0 0 / 0.1)',
  },
  col2: {
    label: 'Cột 2',
    color: 'rgb(0 0 0 / 0.2)',
  },
} satisfies ChartConfig

export function ChartSkeleton() {
  const chartData = useMemo(() => {
    return Object.entries(generateFakeData()).map(([key, value]) => ({
      month: key,
      ...value,
    }))
  }, [])

  return (
    <ChartContainer
      config={chartSkeletonConfig}
      className="aspect-auto h-[350px] w-full"
    >
      <BarChart data={chartData} margin={{ right: 0, left: 0, bottom: 28 }}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={16}
          tickFormatter={(value) => {
            return `Thg ${value}`
          }}
        />

        <Bar
          dataKey="col1"
          fill="var(--color-col1)"
          radius={4}
          className="animate-pulse"
        />
        <Bar
          dataKey="col2"
          fill="var(--color-col2)"
          radius={4}
          className="animate-pulse"
        />
      </BarChart>
    </ChartContainer>
  )
}
