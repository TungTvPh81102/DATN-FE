import { type Table as TanstackTable, flexRender } from '@tanstack/react-table'
import type * as React from 'react'

import { DataTableFooter } from '@/components/data-table/data-table-footer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCommonPinningStyles } from '@/lib/data-table'
import { cn } from '@/lib/utils'
import { Sortable, SortableItem } from '../ui/sortable'
import { UniqueIdentifier } from '@dnd-kit/core'

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null

  /**
   * Callback to set the data when the order is changed.
   * @default () => {}
   * @type (data: TData[]) => void
   */
  setData?: (data: TData[]) => void
}

export function DataTable<TData>({
  table,
  setData = () => {},
  floatingBar = null,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn('w-full space-y-2.5 overflow-auto', className)}
      {...props}
    >
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                      }}
                      className={cn(
                        'font-semibold',
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.headClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <Sortable
              value={table
                .getRowModel()
                .rows.map((row) => row.original as { id: UniqueIdentifier })}
              onValueChange={
                setData as (data: { id: UniqueIdentifier }[]) => void
              }
              overlay={
                <Table>
                  <TableBody>
                    <TableRow>
                      <div className="h-12 w-full bg-accent/10" />
                    </TableRow>
                  </TableBody>
                </Table>
              }
            >
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <SortableItem
                    key={row.id}
                    value={(row.original as { id: string }).id}
                    asChild
                  >
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles({ column: cell.column }),
                          }}
                          className={cn(
                            cell.column.columnDef.meta?.className,
                            cell.column.columnDef.meta?.cellClassName
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </SortableItem>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </Sortable>
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTableFooter table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
      </div>
    </div>
  )
}
