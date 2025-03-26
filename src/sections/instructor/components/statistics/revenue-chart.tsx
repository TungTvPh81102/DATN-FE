'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

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
import { useGetMonthlyRevenueStatistics } from '@/hooks/instructor/use-statistic'
import { formatCurrency } from '@/lib/common'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

const RevenueChart = () => {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear + '')

  const { data: monthlyRevenue, isLoading } =
    useGetMonthlyRevenueStatistics(+year)

  const chartData = monthlyRevenue
    ? Object.entries(monthlyRevenue).map(([key, value]) => ({
        month: key,
        revenue: value ?? 0,
      }))
    : []

  return (
    <Card>
      <CardHeader className="flex items-center gap-4 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Doanh thu hàng tháng</CardTitle>
          <CardDescription>
            Phân tích doanh thu hàng tháng để hiểu rõ hơn về hiệu suất kinh
            doanh của bạn theo thời gian
          </CardDescription>
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger
            className="w-fit rounded-lg"
            aria-label="Chọn năm"
            hideArrow
          >
            <SelectValue placeholder={currentYear} />
          </SelectTrigger>
          <SelectContent className="min-w-fit" align="end">
            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
              <SelectItem key={y} value={y + ''} className="rounded-lg">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-4 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {!isLoading ? (
            <AreaChart
              data={chartData}
              margin={{ right: 24, left: 32, bottom: 8 }}
            >
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
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

              <YAxis
                tickLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `Tháng ${value}`}
                formatter={(value) => (
                  <div className="flex w-full flex-wrap items-stretch gap-2">
                    <div className="w-1 shrink-0 rounded-[2px] bg-[--color-revenue]" />

                    <div
                      className={
                        'flex flex-1 items-end justify-between gap-2 leading-none'
                      }
                    >
                      <div className="grid gap-1.5">
                        <span className="text-muted-foreground">Doanh thu</span>
                      </div>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {formatCurrency(+value)}
                      </span>
                    </div>
                  </div>
                )}
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                stackId="a"
              />
            </AreaChart>
          ) : (
            <Skeleton className="size-full" />
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default RevenueChart
