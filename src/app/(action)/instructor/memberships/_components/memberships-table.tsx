'use client'

import { DataTable } from '@/components/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import {
  useGetMemberships,
  useSendMembershipRequest,
  useToggleStatusMembership,
} from '@/hooks/instructor/use-membership'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTableFilterField, DataTableRowAction } from '@/types/data-table'
import { Membership, MembershipStatusMap } from '@/types/membership'
import { useMemo, useState } from 'react'
import { MembershipsTableFloatingBar } from './memberships-table-floating-bar'
import { getColumns } from './memberships-table-columns'
import { MembershipsTableToolbarActions } from './memberships-table-toolbar-actions'
import { UpdateMembershipSheet } from './update-membership-sheet'

const filterFields: DataTableFilterField<Membership>[] = [
  {
    id: 'name',
    label: 'Tên gói',
    placeholder: 'Tên gói...',
  },
  {
    id: 'status',
    label: 'Trạng thái',
    options: Object.entries(MembershipStatusMap).map(([key, value]) => ({
      label: value.label,
      value: key,
    })),
  },
]

export const MembershipsTable = () => {
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<Membership> | null>(null)

  const { data, isLoading } = useGetMemberships()
  const { mutate: toggleStatus } = useToggleStatusMembership()
  const { mutate: sendRequest } = useSendMembershipRequest()

  const columns = useMemo(
    () =>
      getColumns({
        setRowAction,
        toggleStatus,
        sendRequest,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

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
        floatingBar={<MembershipsTableFloatingBar table={table} />}
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <MembershipsTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <UpdateMembershipSheet
        open={rowAction?.type === 'update'}
        onOpenChange={() => setRowAction(null)}
        code={rowAction?.row.original.code ?? null}
      />
    </>
  ) : (
    <DataTableSkeleton
      columnCount={7}
      searchableColumnCount={1}
      filterableColumnCount={1}
      cellWidths={[
        '2.5rem',
        '12rem',
        '12rem',
        '12rem',
        '12rem',
        '12rem',
        '2.5rem',
      ]}
    />
  )
}
