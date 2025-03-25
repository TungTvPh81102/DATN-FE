'use client'

import { DataTable } from '@/components/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { useGetCoupons } from '@/hooks/instructor/coupon/useCoupon'
import { useDataTable } from '@/hooks/use-data-table'
import { Coupon, DiscountTypeMap } from '@/types'
import { DataTableAdvancedFilterField } from '@/types/data-table'
import { useMemo } from 'react'
import { getColumns } from './coupons-table-columns'
import { CouponsTableToolbarActions } from './coupons-table-toolbar-actions'

const advancedFilterFields: DataTableAdvancedFilterField<Coupon>[] = [
  {
    id: 'code',
    label: 'Mã',
    type: 'text',
  },
  {
    id: 'name',
    label: 'Tên mã',
    type: 'text',
  },
  {
    id: 'discount_type',
    label: 'Loại mã',
    type: 'select',
    options: Object.entries(DiscountTypeMap).map(([key, value]) => ({
      label: value.label,
      value: key,
    })),
  },
  {
    id: 'discount_value',
    label: 'Giá trị',
    type: 'number',
  },
  {
    id: 'status',
    label: 'Trạng thái',
    type: 'select',
    options: [
      {
        label: 'Đang hoạt động',
        value: '1',
      },
      {
        label: 'Đã ẩn',
        value: '0',
      },
    ],
  },
  {
    id: 'created_at',
    label: 'Ngày tạo',
    type: 'date',
  },
]

export const CouponsTable = () => {
  const { data, isLoading } = useGetCoupons()

  const columns = useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow, i) => (originalRow.id ?? i).toString(),
  })

  return !isLoading ? (
    <>
      <DataTable table={table}>
        <DataTableAdvancedToolbar
          table={table}
          filterFields={advancedFilterFields}
        >
          <CouponsTableToolbarActions />
        </DataTableAdvancedToolbar>
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
