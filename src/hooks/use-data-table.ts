'use client'

import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
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
import { useCallback, useMemo, useState } from 'react'

interface UseDataTableProps<TData>
  extends Omit<TableOptions<TData>, 'state' | 'getCoreRowModel' | 'data'> {
  data?: TData[]

  /**
   * Debounce time (ms) for filter updates to enhance performance during rapid input.
   * @default 300
   */
  debounceMs?: number

  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    // Extend to make the sorting id typesafe
    sorting?: ExtendedSortingState<TData>
  }
}

export function useDataTable<TData>({
  data = [],
  debounceMs = 300,
  initialState,
  ...props
}: UseDataTableProps<TData>) {
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

  const [filterValues, setFilterValues] = useState<ColumnFiltersState>([])

  const debouncedSetFilterValues = useDebouncedCallback(
    setFilterValues,
    debounceMs
  )

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

  // Filter
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    return Object.entries(filterValues).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        if (value !== null) {
          filters.push({
            id: key,
            value: Array.isArray(value) ? value : [value],
          })
        }
        return filters
      },
      []
    )
  }, [filterValues])

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters)

  const onColumnFiltersChange = useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(prev)
            : updaterOrValue

        void setPagination({ pageIndex: 0, pageSize: pagination.pageSize })

        return next
      })
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSetFilterValues, setPagination]
  )

  const table = useReactTable({
    ...props,
    data,
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
