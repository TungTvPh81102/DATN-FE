'use client'

import type { ExtendedSortingState } from '@/types/data-table'
import {
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

const ARRAY: any[] = []

interface UseDataTableProps<TData>
  extends Omit<TableOptions<TData>, 'state' | 'getCoreRowModel' | 'data'> {
  data?: TData[]

  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    // Extend to make the sorting id typesafe
    sorting?: ExtendedSortingState<TData>
  }
}

export function useDataTable<TData>({
  data,
  initialState,
  ...props
}: UseDataTableProps<TData>) {
  const memoData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return ARRAY
    }

    return data
  }, [data])

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {}
  )

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? 10,
  })

  const [sorting, setSorting] = useState<SortingState>(
    initialState?.sorting ?? []
  )

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const onPaginationChange = (updaterOrValue: Updater<PaginationState>) => {
    if (typeof updaterOrValue === 'function') {
      const newPagination = updaterOrValue(pagination)
      void setPagination(newPagination)
    } else {
      void setPagination(updaterOrValue)
    }
  }

  // Sort
  const onSortingChange = (updaterOrValue: Updater<SortingState>) => {
    if (typeof updaterOrValue === 'function') {
      const newSorting = updaterOrValue(sorting) as ExtendedSortingState<TData>
      void setSorting(newSorting)
    } else {
      setSorting(updaterOrValue)
    }
  }

  const onColumnFiltersChange = (
    updaterOrValue: Updater<ColumnFiltersState>
  ) => {
    console.log('onColumnFiltersChange')
    setColumnFilters((prev) => {
      const next =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(prev)
          : updaterOrValue

      void setPagination({ pageIndex: 0, pageSize: pagination.pageSize })

      return next
    })
  }

  const table = useReactTable({
    ...props,
    data: memoData,
    initialState,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return { table }
}
