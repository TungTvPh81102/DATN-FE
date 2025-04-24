import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

type Props = {
  chartConfig: ChartConfig
  chartData: { month: string; purchase: string }[]
}

export const RevenueEachMonthChart = ({ chartConfig, chartData }: Props) => {
  return (
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

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
          labelFormatter={(_, value) => {
            return `Tháng ${value[0].payload.month}`
          }}
        />

        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}
