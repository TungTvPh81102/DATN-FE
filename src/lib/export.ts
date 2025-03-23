import { toSentenceCase } from '@/lib/utils'
import type { Table } from '@tanstack/react-table'
import * as XLSX from 'xlsx'

export function exportTableToXLSX<TData>(
  /**
   * The table to export.
   * @type Table<TData>
   */
  table: Table<TData>,
  opts: {
    /**
     * The filename for the XLSX file.
     * @default "table"
     * @example "courses"
     */
    filename?: string
    /**
     * The columns to exclude from the XLSX file.
     * @default []
     * @example ["select", "actions"]
     */
    excludeColumns?: (keyof TData | 'select' | 'actions')[]

    /**
     * Whether to export only the selected rows.
     * @default false
     */
    onlySelected?: boolean

    formatHeader?: boolean
  } = {}
): void {
  const {
    filename = 'table',
    excludeColumns = [],
    onlySelected = false,
    formatHeader = true,
  } = opts

  const headers = table
    .getAllLeafColumns()
    .map((column) => ({
      id: column.id,
      label: formatHeader
        ? (column.columnDef.meta?.label ?? toSentenceCase(column.id))
        : column.id,
    }))
    .filter(({ id }) => !excludeColumns.includes(id as keyof TData))

  const formatDate = (value: any) => {
    if (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        return XLSX.SSF.format('dd/mm/yyyy hh:mm:ss', date)
      }
    }
    return value
  }

  const data = (
    onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
  ).map((row) =>
    headers.reduce(
      (acc, header) => {
        acc[header.label] = formatDate(row.getValue(header.id))
        return acc
      },
      {} as Record<string, any>
    )
  )

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: headers.map((h) => h.label),
  })

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}
