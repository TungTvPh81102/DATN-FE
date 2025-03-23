'use client'

import { DataTable } from '@/components/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { useGetPosts } from '@/hooks/instructor/post/usePost'
import { useDataTable } from '@/hooks/use-data-table'
import { IPost, PostStatusMap } from '@/types'
import { DataTableAdvancedFilterField } from '@/types/data-table'
import { useMemo } from 'react'
import { PostsTableToolbarActions } from './posts-table-toolbar-actions'
import { getColumns } from './posts-table-columns'
import { PostsTableFloatingBar } from './posts-table-floating-bar'

const advancedFilterFields: DataTableAdvancedFilterField<IPost>[] = [
  {
    id: 'title',
    label: 'Tiêu đề',
    type: 'text',
  },
  {
    id: 'created_at',
    label: 'Ngày tạo',
    type: 'date',
  },
  {
    id: 'view',
    label: 'Lượt xem',
    type: 'number',
  },
  {
    id: 'status',
    label: 'Trạng thái',
    type: 'multi-select',
    options: Object.entries(PostStatusMap).map(([key, value]) => ({
      label: value.label,
      value: key,
    })),
  },
]

export const PostsTable = () => {
  const { data, isLoading } = useGetPosts()

  const columns = useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data,
    columns,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id?.toString(),
  })

  return !isLoading ? (
    <>
      <DataTable
        table={table}
        floatingBar={<PostsTableFloatingBar table={table} />}
      >
        <DataTableAdvancedToolbar
          table={table}
          filterFields={advancedFilterFields}
        >
          <PostsTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>
    </>
  ) : (
    <DataTableSkeleton
      columnCount={6}
      searchableColumnCount={1}
      filterableColumnCount={1}
      cellWidths={['10rem', '18rem', '6rem', '6rem', '6rem', '6rem']}
      shrinkZero
    />
  )
}
