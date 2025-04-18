'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from 'recharts'
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Star,
} from 'lucide-react'
import { DateRangePicker } from '@/components/shared/date-range-picker'
import { IRatingStatistics } from '@/types/Statistics'

import { useGetApprovedCourses } from '@/hooks/instructor/course/useCourse'
import { useGetRatingStatistics } from '@/hooks/instructor/use-statistic'
import { DateRange } from '@/types/Common'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const COLORS = ['#E27447', '#F2A663', '#3498db', '#2ecc71', '#9b59b6']

type CustomLabelProps = {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index?: number
}

export const DEFAULT_DATE_RANGE: DateRange = {
  from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  to: new Date(),
}

export default function RatingStatistics() {
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [chartType, setChartType] = useState('pie')

  const { data: coursesData, isLoading: isLoadingCourses } =
    useGetApprovedCourses()
  const { data: ratingData, isLoading: isLoadingRatings } =
    useGetRatingStatistics(selectedCourse, dateRange)

  const isLoading = isLoadingCourses || isLoadingRatings
  const courses = coursesData || []
  const data = ratingData?.data || []
  const averageRating = ratingData?.average || 0
  const totalRatings = ratingData?.total || 0

  const handleDateRangeChange = (range: any) => {
    setDateRange(range)
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
  }: CustomLabelProps) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius * 0.8
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <span className="mr-2 font-medium">{rating.toFixed(1)}</span>
        <div className="flex text-yellow-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={18}
              fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
              className={
                star <= Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'
              }
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="border-b py-5">
        <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              Thống kê đánh giá
              {!isLoading && averageRating > 0 && (
                <Badge variant="outline" className="ml-2 bg-yellow-50">
                  {renderStarRating(averageRating)}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {isLoading ? (
                <Skeleton className="h-5 w-32" />
              ) : (
                `${totalRatings} đánh giá | Trung bình: ${averageRating} sao`
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="sm:w-50 w-full">
                <SelectValue placeholder="Tất cả khóa học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khóa học</SelectItem>
                {courses.map((course: any) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex h-72 items-center justify-center">
            <Skeleton className="size-64 rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="mb-2 text-5xl">📊</div>
              <p>Không có dữ liệu đánh giá cho khoảng thời gian này</p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="mb-4 flex justify-center">
                <Tabs
                  value={chartType}
                  onValueChange={setChartType}
                  className="w-full max-w-md"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="pie"
                      className="flex items-center gap-2"
                    >
                      <PieChartIcon size={16} />
                      <span>Biểu đồ tròn</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="bar"
                      className="flex items-center gap-2"
                    >
                      <BarChartIcon size={16} />
                      <span>Biểu đồ cột</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={120}
                      innerRadius={60}
                      paddingAngle={2}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="label"
                    >
                      {data.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} đánh giá`, name]}
                      contentStyle={{
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: 'none',
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={10}
                    />
                  </PieChart>
                ) : (
                  <BarChart
                    data={data}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    barSize={60}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.2}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#4B5563' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis
                      tick={{ fill: '#4B5563' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip
                      formatter={(value, name, props) => {
                        return [
                          `${value} đánh giá (${props.payload.percentage}%)`,
                          'Số lượng',
                        ]
                      }}
                      contentStyle={{
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: 'none',
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Số lượng"
                      radius={[4, 4, 0, 0]}
                      animationDuration={800}
                    >
                      {data.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
      {!isLoading && data.length > 0 && (
        <CardFooter className="flex flex-wrap justify-center gap-4 border-t bg-gray-50 p-4">
          {data.map((item: IRatingStatistics) => (
            <div
              key={item.rating}
              className="flex w-32 flex-col items-center rounded-lg bg-white p-2 shadow-sm"
            >
              <div className="mb-1 flex items-center text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < item.rating ? 'currentColor' : 'none'}
                    className={
                      i < item.rating ? 'text-yellow-500' : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <div className="text-xl font-bold">{item.count}</div>
              <div className="text-xs text-gray-500">{item.percentage}%</div>
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
