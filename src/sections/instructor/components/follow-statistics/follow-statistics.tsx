'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
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
  ChartTooltipContent,
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

  const totalFollows = chartData.reduce(
    (sum: number, item: IFollowStatistics) => sum + item.count,
    0
  )

  return (
    <Card>
      <CardHeader className="flex items-center gap-4 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Thống kê người theo dõi</CardTitle>
          <CardDescription>
            {totalFollows} lượt theo dõi trong năm {year}. Phân tích số lượng
            người theo dõi hàng tháng để hiểu rõ hơn về hiệu suất của bạn theo
            thời gian.
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
              <BarChart
                data={chartData}
                margin={{ right: 24, left: 8, bottom: 8, top: 8 }}
                barCategoryGap={8}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={16}
                  tickFormatter={(value) => {
                    return `Tháng ${value}`
                  }}
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => `Tháng ${value}`}
                  formatter={(value) => (
                    <div className="flex w-full flex-wrap items-stretch gap-2">
                      <div className="w-1 shrink-0 rounded-[2px] bg-[--color-follows]" />
                      <div className="flex flex-1 items-end justify-between gap-2 leading-none">
                        <div className="grid gap-1.5">
                          <span className="text-muted-foreground">
                            Người theo dõi
                          </span>
                        </div>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {value}
                        </span>
                      </div>
                    </div>
                  )}
                />
                <Bar
                  dataKey="follows"
                  fill="var(--color-follows)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )
          ) : (
            <Skeleton className="size-full" />
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <>Số liệu người theo dõi {year}</>
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Thống kê người theo dõi năm {year}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
