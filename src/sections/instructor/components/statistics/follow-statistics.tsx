'use client'

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetFollowStatistics } from '@/hooks/instructor/use-statistic'
import { IFollowStatistics } from '@/types/Statistics'

const MONTHS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
]

const chartConfig = {
  follows: {
    label: 'Người theo dõi',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export default function FollowStatistics() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

  const { data: dataFollow, isLoading } = useGetFollowStatistics(year)
  const chartData =
    dataFollow?.data?.map((item: IFollowStatistics) => ({
      month: item.month.toString(),
      monthName: MONTHS[item.month - 1],
      follows: item.count,
    })) || []

  const calculatePercentChange = () => {
    if (chartData.length >= 2) {
      const currentMonth = chartData[chartData.length - 1]
      const previousMonth = chartData[chartData.length - 2]
      if (previousMonth.follows > 0) {
        const percentChange =
          ((currentMonth.follows - previousMonth.follows) /
            previousMonth.follows) *
          100
        return {
          value: parseFloat(percentChange.toFixed(1)),
          isUp: percentChange > 0,
        }
      }
    }
    return null
  }

  const percentChange = calculatePercentChange()

  return (
    <Card>
      <CardHeader className="flex items-center gap-4 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Thống kê người theo dõi</CardTitle>
          <CardDescription>
            Phân tích số lượng người theo dõi hàng tháng để hiểu rõ hơn về hiệu
            suất của bạn theo thời gian.
          </CardDescription>
        </div>
        <Select
          value={year.toString()}
          onValueChange={(value) => setYear(parseInt(value))}
        >
          <SelectTrigger
            className="w-fit rounded-lg"
            aria-label="Chọn năm"
            hideArrow
          >
            <SelectValue placeholder={currentYear.toString()} />
          </SelectTrigger>
          <SelectContent className="min-w-fit" align="end">
            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
              <SelectItem
                key={y}
                value={y.toString()}
                className="cursor-pointer rounded-lg"
              >
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
            chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Không có dữ liệu người theo dõi cho năm này
              </div>
            ) : (
              <LineChart
                data={chartData}
                margin={{ right: 24, left: 8, bottom: 8, top: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={16}
                  tickFormatter={(value) => `T${value}`}
                />
                <ChartTooltip
                  cursor={{ stroke: 'var(--border)', strokeDasharray: '5 5' }}
                  content={(props) => {
                    const { active, payload, label } = props
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <div className="mb-2 font-medium">Tháng {label}</div>
                          <div className="flex w-full flex-wrap items-stretch gap-2">
                            <div className="w-1 shrink-0 rounded-[2px] bg-[--color-follows]" />
                            <div className="flex flex-1 items-end justify-between gap-2 leading-none">
                              <div className="grid gap-1.5">
                                <span className="text-muted-foreground">
                                  Người theo dõi
                                </span>
                              </div>
                              <span className="font-mono font-medium tabular-nums text-foreground">
                                {payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  dataKey="follows"
                  type="monotone"
                  stroke="var(--color-follows)"
                  strokeWidth={2}
                  dot={{
                    fill: 'var(--color-follows)',
                  }}
                  activeDot={{
                    r: 6,
                  }}
                >
                  <LabelList
                    dataKey="follows"
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            )
          ) : (
            <Skeleton className="size-full" />
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {percentChange && (
          <div className="flex gap-2 font-medium leading-none">
            {percentChange.isUp ? 'Tăng' : 'Giảm'}{' '}
            {Math.abs(percentChange.value)}% trong tháng này{' '}
            <TrendingUp
              className={`size-4 ${percentChange.isUp ? '' : 'rotate-180'}`}
            />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Hiển thị tổng số người theo dõi trong năm {year}
        </div>
      </CardFooter>
    </Card>
  )
}
