import { ColumnDef } from '@tanstack/react-table'
import { IMembershipsRevenueStatistics } from '@/types/Statistics'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { formatStringToCurrency } from '@/lib/common'

export const MembershipsRevenueColumns =
  (): ColumnDef<IMembershipsRevenueStatistics>[] => {
    return [
      {
        accessorKey: 'membershipPlanName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tên gói thành viên" />
        ),
        cell: ({ row }) => {
          return (
            <div className="font-semibold">
              {row.getValue('membershipPlanName')}
            </div>
          )
        },
        sortingFn: 'basic',
        enableHiding: false,
        meta: {
          label: 'Tên gói thành viên',
          className: 'pl-4',
        },
      },
      {
        accessorKey: 'membershipRevenue',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Doanh thu" />
        ),
        cell: ({ row }) => {
          const price = Number(row.getValue('membershipRevenue')) || 0

          return (
            <div className="font-medium">{formatStringToCurrency(price)}</div>
          )
        },
        sortingFn: 'alphanumeric',
        enableHiding: false,
        meta: {
          label: 'Doanh thu',
        },
      },
    ]
  }
