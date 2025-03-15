/* eslint-disable @typescript-eslint/no-unused-vars */
import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    headClassName?: string
    cellClassName?: string
    label?: string
  }
}
