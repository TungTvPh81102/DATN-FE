'use client'

import { DataTable } from '@/components/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { CoursePreview } from '@/types'
import { DataTableFilterField } from '@/types/data-table'
import { Table } from '@tanstack/react-table'

const filterFields: DataTableFilterField<CoursePreview>[] = [
  {
    id: 'name',
    label: 'Tên khóa học',
    placeholder: 'Tên khóa học...',
  },
]

interface Props {
  table: Table<CoursePreview>
  isLoading: boolean
}

const ApprovedCoursesTable = ({ table, isLoading }: Props) => {
  return !isLoading ? (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields} />
      </DataTable>
    </>
  ) : (
    <DataTableSkeleton
      columnCount={7}
      filterableColumnCount={2}
      cellWidths={['2.5rem', '15rem', '6rem', '6rem', '6rem', '6rem', '2.5rem']}
      shrinkZero
    />
  )
}

export default ApprovedCoursesTable
