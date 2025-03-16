import type { Table } from '@tanstack/react-table'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTablePagination } from './data-table-pagination'

interface DataTableFooterProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
}

export function DataTableFooter<TData>({
  table,
  // pageSizeOptions = [10, 20, 30, 40, 50],
  pageSizeOptions = [1, 10, 20, 30, 40, 50],
}: DataTableFooterProps<TData>) {
  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        Đã chọn {table.getFilteredSelectedRowModel().rows.length}/
        {table.getFilteredRowModel().rows.length} hàng
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">
            Số hàng trên mỗi trang
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[4.5rem]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
