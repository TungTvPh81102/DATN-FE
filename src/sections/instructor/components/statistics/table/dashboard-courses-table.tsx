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
import { useMemo } from 'react'
import { getColumns } from './dashboard-courses-table-columns'
import { DashboardCoursesTableToolbarActions } from './dashboard-courses-table-toolbar-actions'

const filterFields: DataTableFilterField<CourseRevenueStatistics>[] = [
  {
    id: 'name',
    label: 'Khóa học',
    placeholder: 'Tên khóa học...',
  },
]

export const DashboardCoursesTable = () => {
  const { data, isLoading } = useGetCourseRevenueStatistics()

  const columns = useMemo(() => getColumns(), [])

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
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-4 sm:pt-6">
        {!isLoading ? (
          <DataTable table={table}>
            <DataTableToolbar table={table} filterFields={filterFields}>
              <DashboardCoursesTableToolbarActions table={table} />
            </DataTableToolbar>
          </DataTable>
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
