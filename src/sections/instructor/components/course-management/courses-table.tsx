'use client'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { useGetCourses } from '@/hooks/instructor/course/useCourse'
import { useDataTable } from '@/hooks/use-data-table'
import { CourseStatusMap, ICourse } from '@/types'
import {
  DataTableAdvancedFilterField,
  DataTableRowAction,
} from '@/types/data-table'
import { useMemo, useState } from 'react'
import { getColumns } from './courses-table-columns'
import { CoursesTableFloatingBar } from './courses-table-floating-bar'
import { CoursesTableToolbarActions } from './courses-table-toolbar-actions'
import { DeleteCoursesDialog } from './delete-courses-dialog'

const advancedFilterFields: DataTableAdvancedFilterField<ICourse>[] = [
  {
    id: 'name',
    label: 'Tên',
    type: 'text',
  },
  {
    id: 'created_at',
    label: 'Ngày tạo',
    type: 'date',
  },
  {
    id: 'price',
    label: 'Giá',
    type: 'number',
  },
  {
    id: 'total_student',
    label: 'Số học viên',
    type: 'number',
  },
  {
    id: 'status',
    label: 'Trạng thái',
    type: 'multi-select',
    options: Object.entries(CourseStatusMap).map(([key, value]) => ({
      label: value.label,
      value: key,
    })),
  },
]

const CoursesTable = () => {
  const { data, isLoading } = useGetCourses()

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<ICourse> | null>(null)

  const columns = useMemo(() => getColumns({ setRowAction }), [])

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id?.toString() ?? '',
  })

  return !isLoading ? (
    <>
      <DataTable
        table={table}
        floatingBar={<CoursesTableFloatingBar table={table} />}
      >
        <DataTableAdvancedToolbar
          table={table}
          filterFields={advancedFilterFields}
        >
          <CoursesTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>

      <DeleteCoursesDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        courses={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
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

export default CoursesTable
