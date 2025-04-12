import { ColumnDef } from '@tanstack/react-table'
import { IMembershipsRevenueStatistics } from '@/types/Statistics'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { formatVietnameseCurrency } from '@/lib/common'

export const MembershipsRevenueColumns =
  (): ColumnDef<IMembershipsRevenueStatistics>[] => {
    return [
      {
        accessorKey: 'month',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tháng" />
        ),
        cell: ({ row }) => {
          return (
            <div className="font-semibold">Tháng {row.getValue('month')}</div>
          )
        },
        sortingFn: 'basic',
        enableHiding: false,
        meta: {
          label: 'Tháng',
          className: 'pl-4',
        },
      },
      {
        accessorKey: 'membershipRevenue',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tổng doanh thu" />
        ),
        cell: ({ row }) => {
          const price = Number(row.getValue('membershipRevenue')) || 0

          return (
            <div className="font-medium">{formatVietnameseCurrency(price)}</div>
          )
        },
        sortingFn: 'alphanumeric',
        enableHiding: false,
        meta: {
          label: 'Tổng doanh thu',
        },
      },
      {
        accessorKey: 'membershipPlanNames',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Danh sách gói thành viên"
          />
        ),
        cell: ({ row }) => {
          const membershipList: string[] = row.getValue('membershipPlanNames')

          return <div className="font-medium">{membershipList.join(', ')}</div>
        },
        meta: {
          label: 'anh sách gói thành viên',
        },
      },
    ]
  }
