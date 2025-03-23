'use client'

import { DataTable } from '@/components/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { useGetCourses } from '@/hooks/instructor/course/useCourse'
import { useDataTable } from '@/hooks/use-data-table'
import { CoursesTableToolbarActions } from '@/sections/instructor/components/course-management/courses-table-toolbar-actions'
import { DeleteCoursesDialog } from '@/sections/instructor/components/course-management/delete-courses-dialog'
import { CourseStatusMap, ICourse } from '@/types'
import { DataTableFilterField, DataTableRowAction } from '@/types/data-table'
import { useMemo, useState } from 'react'
import { getColumns } from './practical-courses-table-columns'

const filterFields: DataTableFilterField<ICourse>[] = [
  {
    id: 'name',
    label: 'Khóa học',
    placeholder: 'Tên khóa học...',
  },
  {
    id: 'status',
    label: 'Trạng thái',
    options: Object.entries(CourseStatusMap).map(([key, value]) => ({
      label: value.label,
      value: key,
    })),
  },
]

export const PracticalCoursesTable = () => {
  const { data, isLoading } = useGetCourses({
    type: 'practical-course',
  })

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
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <CoursesTableToolbarActions table={table} isPracticalCourse />
        </DataTableToolbar>
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
