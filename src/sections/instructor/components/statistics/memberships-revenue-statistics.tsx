import { useGetMonthlyMembershipRevenueStatistics } from '@/hooks/instructor/use-statistic'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTable } from '@/components/data-table'
import { MembershipsRevenueColumns } from '@/sections/instructor/components/statistics/table/memberships-revenue-columns'
import { useMemo, useState } from 'react'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { ChartConfig } from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RevenueEachMonthChart } from '@/sections/instructor/components/statistics/revenue-each-month-chart'

const chartConfig = {
  purchase: {
    label: 'Doanh thu theo tháng',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export type OptionType = 'table' | 'chart'

export const options: { value: OptionType; title: string }[] = [
  {
    value: 'table',
    title: 'Bảng',
  },
  {
    value: 'chart',
    title: 'Biểu đồ',
  },
]

export const MembershipsRevenueStatistics = () => {
  const [view, setView] = useState<OptionType>('chart')
  const { data, isLoading } = useGetMonthlyMembershipRevenueStatistics()

  const columns = useMemo(() => MembershipsRevenueColumns(), [])

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    initialState: {
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id?.toString() ?? '',
  })

  const chartData = useMemo(
    () =>
      data && data.length > 0
        ? data.map((item) => ({
            month: item.membershipPlanName,
            purchase: item.membershipRevenue ?? 0,
          }))
        : [],
    [data]
  )

  return (
    <Card>
      <CardHeader className="flex items-center gap-4 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Tổng quan doanh thu gói thành viên</CardTitle>
          <CardDescription>
            Tổng hợp thông tin về doanh thu gói thành viên theo tháng trong năm
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
        {isLoading ? (
          <DataTableSkeleton
            columnCount={2}
            searchableColumnCount={1}
            cellWidths={['50%', '50%']}
            shrinkZero
          />
        ) : view === 'table' ? (
          <DataTable table={table} />
        ) : (
          <RevenueEachMonthChart
            chartConfig={chartConfig}
            chartData={chartData}
          />
        )}
      </CardContent>
    </Card>
  )
}
