'use client'

import { DataTable } from '@/components/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import {
  useGetCoursesFromTrash,
  useRestoreCourses,
} from '@/hooks/instructor/course/useCourse'
import { useDataTable } from '@/hooks/use-data-table'
import { ITrashCourse } from '@/types'
import { DataTableFilterField } from '@/types/data-table'
import { useMemo } from 'react'
import { getColumns } from './trash-courses-table-columns'
import { TrashCoursesTableToolbarActions } from './trash-courses-table-toolbar-actions'

const filterFields: DataTableFilterField<ITrashCourse>[] = [
  {
    id: 'name',
    label: 'Khóa học',
    placeholder: 'Tên khóa học...',
  },
]

export const TrashCoursesTable = () => {
  const { data, isLoading } = useGetCoursesFromTrash()

  const { mutate: restore, isPending: isRestoring } = useRestoreCourses()

  const columns = useMemo(
    () =>
      getColumns({
        restore,
        isRestoring,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const { table } = useDataTable({
    data,
    columns,
    initialState: {
      sorting: [{ id: 'deleted_at', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow, i) => (originalRow.id ?? i).toString(),
  })

  return !isLoading ? (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <TrashCoursesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  ) : (
    <DataTableSkeleton
      columnCount={5}
      filterableColumnCount={2}
      cellWidths={['2.5rem', '15rem', '6rem', '6rem', '2.5rem']}
      shrinkZero
    />
  )
}
