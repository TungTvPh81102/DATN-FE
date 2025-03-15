'use client'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableFilterField } from '@/types/data-table'
import { Learner } from '@/types/learner'
import { useMemo } from 'react'
import { getColumns } from './learners-table-columns'
import { LearnersTableToolbarActions } from './learners-table-toolbar-actions'

const filterFields: DataTableFilterField<Learner>[] = [
  {
    id: 'name',
    label: 'Học viên',
    placeholder: 'Tên học viên...',
  },
]

interface Props {
  data?: Learner[]
  isLoading?: boolean
}

const LearnersTable = ({ data = [], isLoading = false }: Props) => {
  const columns = useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    initialState: {
      sorting: [{ id: 'enrolled_at', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id?.toString() ?? '',
  })

  return !isLoading ? (
    <>
      <DataTable table={table} className="w-">
        <DataTableToolbar table={table} filterFields={filterFields}>
          <LearnersTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
    </>
  ) : (
    <DataTableSkeleton
      columnCount={6}
      searchableColumnCount={1}
      cellWidths={['2.5rem', '20rem', '15rem', '15rem', '15rem', '2.5rem']}
      shrinkZero
    />
  )
}

export default LearnersTable
