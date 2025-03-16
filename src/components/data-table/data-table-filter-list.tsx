'use client'

import type {
  DataTableAdvancedFilterField,
  Filter,
  StringKeyOf,
} from '@/types/data-table'
import type { Table } from '@tanstack/react-table'
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  ListFilter,
  Trash2,
} from 'lucide-react'
import { customAlphabet } from 'nanoid'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  FacetedFilter,
  FacetedFilterContent,
  FacetedFilterEmpty,
  FacetedFilterGroup,
  FacetedFilterInput,
  FacetedFilterItem,
  FacetedFilterList,
  FacetedFilterTrigger,
} from '@/components/ui/faceted-filter'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { formatDate } from '@/lib/common'
import { cn } from '@/lib/utils'
import { vi } from 'date-fns/locale'

interface DataTableFilterListProps<TData> {
  table: Table<TData>
  filterFields: DataTableAdvancedFilterField<TData>[]
  debounceMs: number
}

export function DataTableFilterList<TData>({
  table,
  filterFields,
  debounceMs,
}: DataTableFilterListProps<TData>) {
  const id = React.useId()

  const [filters, setFilters] = React.useState<any[]>([])

  const debouncedSetFilters = useDebouncedCallback(setFilters, debounceMs)

  function addFilter() {
    const filterField = filterFields.find(
      (field) => !filters.find((filter) => filter.id === field.id)
    )

    if (!filterField) return

    void setFilters([
      ...filters,
      {
        id: filterField.id,
        value: '',
        type: filterField.type,
        rowId: customAlphabet(
          '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
          6
        )(),
      },
    ])
  }

  function updateFilter({
    rowId,
    field,
    debounced = false,
  }: {
    rowId: string
    field: Omit<Partial<Filter<TData>>, 'rowId'>
    debounced?: boolean
  }) {
    const updateFunction = debounced ? debouncedSetFilters : setFilters

    if (Array.isArray(field.value) && field.value.length === 0) {
      field.value = ''
    }

    updateFunction((prevFilters) => {
      const updatedFilters = prevFilters.map((filter) => {
        if (filter.rowId === rowId) {
          return { ...filter, ...field }
        }
        return filter
      })
      return updatedFilters
    })
  }

  function removeFilter(rowId: string) {
    const updatedFilters = filters.filter((filter) => filter.rowId !== rowId)
    void setFilters(updatedFilters)
  }

  function renderFilterInput({
    filter,
    inputId,
  }: {
    filter: Filter<TData>
    inputId: string
  }) {
    const filterField = filterFields.find((f) => f.id === filter.id)

    if (!filterField) return null

    switch (filter.type) {
      case 'text':
        return (
          <Input
            id={inputId}
            type={filter.type}
            aria-label={`${filterField.label} filter value`}
            aria-describedby={`${inputId}-description`}
            placeholder={filterField.placeholder ?? 'Nhập giá trị...'}
            className="h-8 w-full rounded"
            defaultValue={
              typeof filter.value === 'string' ? filter.value : undefined
            }
            onChange={(event) =>
              updateFilter({
                rowId: filter.rowId,
                field: { value: event.target.value },
                debounced: true,
              })
            }
          />
        )
      case 'number':
        return (
          <div className="flex items-center gap-2">
            <Input
              id={inputId}
              type={filter.type}
              aria-label={`${filterField.label} filter value`}
              aria-describedby={`${inputId}-description`}
              placeholder={filterField.placeholder ?? 'Từ...'}
              className="h-8 w-full rounded"
              defaultValue={
                typeof filter.value[0] === 'string'
                  ? filter.value[0]
                  : undefined
              }
              onChange={(event) =>
                updateFilter({
                  rowId: filter.rowId,
                  field: { value: [event.target.value, filter.value[1]] },
                  debounced: true,
                })
              }
            />

            <Input
              id={inputId}
              type={filter.type}
              aria-label={`${filterField.label} filter value`}
              aria-describedby={`${inputId}-description`}
              placeholder={filterField.placeholder ?? 'Đến...'}
              className="h-8 w-full rounded"
              defaultValue={
                typeof filter.value[1] === 'string'
                  ? filter.value[1]
                  : undefined
              }
              onChange={(event) => {
                updateFilter({
                  rowId: filter.rowId,
                  field: { value: [filter.value[0], event.target.value] },
                  debounced: true,
                })
              }}
            />
          </div>
        )
      case 'select':
        return (
          <FacetedFilter>
            <FacetedFilterTrigger asChild>
              <Button
                id={inputId}
                variant="outline"
                size="sm"
                aria-label={`${filterField.label} filter value`}
                aria-controls={`${inputId}-listbox`}
                className="h-8 w-full justify-between gap-2 rounded px-3 text-left text-muted-foreground hover:text-muted-foreground"
              >
                {filter.value && typeof filter.value === 'string' ? (
                  <Badge variant="secondary" className="rounded-sm font-normal">
                    {filterField?.options?.find(
                      (option) => option.value === filter.value
                    )?.label || filter.value}
                  </Badge>
                ) : (
                  <>
                    {filterField.placeholder ?? 'Chọn giá trị...'}
                    <ChevronsUpDown className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </FacetedFilterTrigger>
            <FacetedFilterContent
              id={`${inputId}-listbox`}
              className="w-[12.5rem] origin-[var(--radix-popover-content-transform-origin)]"
            >
              <FacetedFilterInput
                placeholder={filterField?.label ?? 'Tìm kiếm...'}
                aria-label={`Search ${filterField?.label} options`}
              />
              <FacetedFilterList>
                <FacetedFilterEmpty>Không có kết quả</FacetedFilterEmpty>
                <FacetedFilterGroup>
                  {filterField?.options?.map((option) => (
                    <FacetedFilterItem
                      key={option.value}
                      value={option.value}
                      selected={filter.value === option.value}
                      onSelect={(value) => {
                        updateFilter({ rowId: filter.rowId, field: { value } })
                        setTimeout(() => {
                          document.getElementById(inputId)?.click()
                        }, 0)
                      }}
                    >
                      {option.icon && (
                        <option.icon
                          className="mr-2 size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span>{option.label}</span>
                      {option.count && (
                        <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                          {option.count}
                        </span>
                      )}
                    </FacetedFilterItem>
                  ))}
                </FacetedFilterGroup>
              </FacetedFilterList>
            </FacetedFilterContent>
          </FacetedFilter>
        )
      case 'multi-select': {
        const selectedValues = new Set(
          Array.isArray(filter.value) ? filter.value : []
        )

        return (
          <FacetedFilter>
            <FacetedFilterTrigger asChild>
              <Button
                id={inputId}
                variant="outline"
                size="sm"
                aria-label={`${filterField.label} filter values`}
                aria-controls={`${inputId}-listbox`}
                className="h-8 w-full justify-between gap-2 rounded px-3 text-left text-muted-foreground hover:text-muted-foreground"
              >
                {selectedValues.size === 0 && (
                  <>
                    {filterField.placeholder ?? ' Chọn giá trị...'}
                    <ChevronsUpDown className="size-4" aria-hidden="true" />
                  </>
                )}
                {selectedValues?.size > 0 && (
                  <div className="flex items-center">
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal lg:hidden"
                    >
                      {selectedValues.size}
                    </Badge>
                    <div className="hidden min-w-0 gap-1 lg:flex">
                      {selectedValues.size > 2 ? (
                        <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-normal"
                        >
                          {selectedValues.size} được chọn
                        </Badge>
                      ) : (
                        filterField?.options
                          ?.filter((option) => selectedValues.has(option.value))
                          .map((option) => (
                            <Badge
                              variant="secondary"
                              key={option.value}
                              className="truncate rounded-sm px-1 font-normal"
                            >
                              {option.label}
                            </Badge>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </Button>
            </FacetedFilterTrigger>
            <FacetedFilterContent
              id={`${inputId}-listbox`}
              className="w-[12.5rem] origin-[var(--radix-popover-content-transform-origin)]"
            >
              <FacetedFilterInput
                aria-label={`Search ${filterField?.label} options`}
                placeholder={filterField?.label ?? 'Search options...'}
              />
              <FacetedFilterList>
                <FacetedFilterEmpty>Không có kết quả</FacetedFilterEmpty>
                <FacetedFilterGroup>
                  {filterField?.options?.map((option) => (
                    <FacetedFilterItem
                      key={option.value}
                      value={option.value}
                      selected={selectedValues.has(option.value)}
                      onSelect={(value) => {
                        const currentValue = Array.isArray(filter.value)
                          ? filter.value
                          : []
                        const newValue = currentValue.includes(value)
                          ? currentValue.filter((v) => v !== value)
                          : [...currentValue, value]
                        updateFilter({
                          rowId: filter.rowId,
                          field: { value: newValue },
                        })
                      }}
                    >
                      {option.icon && (
                        <option.icon
                          className="mr-2 size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span>{option.label}</span>
                      {option.count && (
                        <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                          {option.count}
                        </span>
                      )}
                    </FacetedFilterItem>
                  ))}
                </FacetedFilterGroup>
              </FacetedFilterList>
            </FacetedFilterContent>
          </FacetedFilter>
        )
      }
      case 'date': {
        const dateValue = Array.isArray(filter.value)
          ? filter.value.filter(Boolean)
          : [filter.value, filter.value].filter(Boolean)

        const displayValue = dateValue[0]
          ? dateValue[1]
            ? `${formatDate(dateValue[0])} - ${formatDate(dateValue[1])}`
            : formatDate(dateValue[0])
          : 'Chọn ngày'

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={inputId}
                variant="outline"
                size="sm"
                aria-label={`${filterField.label} date filter`}
                aria-controls={`${inputId}-calendar`}
                className={cn(
                  'h-8 w-full justify-start gap-2 rounded text-left font-normal',
                  !filter.value && 'text-muted-foreground'
                )}
              >
                <CalendarIcon
                  className="size-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate">{displayValue}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              id={`${inputId}-calendar`}
              align="start"
              className="w-auto p-0"
            >
              <Calendar
                locale={vi}
                id={`${inputId}-calendar`}
                mode="range"
                aria-label={`Select ${filterField.label} date range`}
                selected={{
                  from: filter.value[0] ? new Date(filter.value[0]) : undefined,
                  to: filter.value[1] ? new Date(filter.value[1]) : undefined,
                }}
                onSelect={(date) => {
                  updateFilter({
                    rowId: filter.rowId,
                    field: {
                      value: date
                        ? [
                            date.from?.toISOString() ?? '',
                            date.to?.toISOString() ?? '',
                          ]
                        : [],
                    },
                  })
                }}
                initialFocus
                numberOfMonths={2}
                defaultMonth={
                  dateValue[0] ? new Date(dateValue[0]) : new Date()
                }
              />
            </PopoverContent>
          </Popover>
        )
      }
      case 'boolean': {
        if (Array.isArray(filter.value)) return null

        return (
          <Select
            value={filter.value}
            onValueChange={(value) =>
              updateFilter({ rowId: filter.rowId, field: { value } })
            }
          >
            <SelectTrigger
              id={inputId}
              aria-label={`${filterField.label} boolean filter`}
              aria-controls={`${inputId}-listbox`}
              className="h-8 w-full rounded bg-transparent"
            >
              <SelectValue placeholder={filter.value ? 'Có' : 'Không'} />
            </SelectTrigger>
            <SelectContent id={`${inputId}-listbox`}>
              <SelectItem value="true">Có</SelectItem>
              <SelectItem value="false">Không</SelectItem>
            </SelectContent>
          </Select>
        )
      }
      default:
        return null
    }
  }

  React.useEffect(() => {
    table.setColumnFilters(
      filters.map((filter) => ({
        id: filter.id,
        value: filter.value,
      }))
    )
  }, [filters])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Open filters"
          aria-controls={`${id}-filter-dialog`}
        >
          <ListFilter className="size-3" aria-hidden="true" />
          Bộ lọc
          {filters.length > 0 && (
            <Badge
              variant="secondary"
              className="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono text-[0.65rem] font-normal"
            >
              {filters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        id={`${id}-filter-dialog`}
        align="start"
        collisionPadding={16}
        className={cn(
          'flex w-[25rem] min-w-72 origin-[var(--radix-popover-content-transform-origin)] flex-col p-4',
          filters.length > 0 ? 'gap-3.5' : 'gap-2'
        )}
      >
        {filters.length > 0 ? (
          <h4 className="font-medium leading-none">Bộ lọc</h4>
        ) : (
          <div className="flex flex-col gap-2">
            <h4 className="font-medium leading-none">Chưa áp dụng bộ lọc</h4>
            <p className="text-sm text-muted-foreground">
              Thêm bộ lọc để lọc kết quả
            </p>
          </div>
        )}
        <div className="flex max-h-40 flex-col gap-2 overflow-y-auto py-0.5 pr-1">
          {filters.map((filter, index) => {
            const filterId = `${id}-filter-${filter.rowId}`
            const fieldListboxId = `${filterId}-field-listbox`
            const fieldTriggerId = `${filterId}-field-trigger`
            const inputId = `${filterId}-input`

            return (
              <div className="flex items-center gap-2 pl-1" key={filter.rowId}>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <Button
                      id={fieldTriggerId}
                      variant="outline"
                      size="sm"
                      role="combobox"
                      aria-label="Select filter field"
                      aria-controls={fieldListboxId}
                      className="h-8 w-32 justify-between gap-2 rounded focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0"
                    >
                      <span className="truncate">
                        {filterFields.find((field) => field.id === filter.id)
                          ?.label ?? 'Select field'}
                      </span>
                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    id={fieldListboxId}
                    align="start"
                    className="w-40 p-0"
                    onCloseAutoFocus={() =>
                      document.getElementById(fieldTriggerId)?.focus({
                        preventScroll: true,
                      })
                    }
                  >
                    <Command>
                      <CommandInput placeholder="Tìm kiếm..." />
                      <CommandList>
                        <CommandEmpty>Không có kết quả</CommandEmpty>
                        <CommandGroup>
                          {filterFields
                            .filter(
                              (f) => !filters.find((fil) => fil.id === f.id)
                            )
                            .map((field) => (
                              <CommandItem
                                key={field.id}
                                value={field.id}
                                onSelect={(value) => {
                                  const filterField = filterFields.find(
                                    (col) => col.id === value
                                  )

                                  if (!filterField) return

                                  updateFilter({
                                    rowId: filter.rowId,
                                    field: {
                                      id: value as StringKeyOf<TData>,
                                      type: filterField.type,
                                      value: '',
                                    },
                                  })

                                  document
                                    .getElementById(fieldTriggerId)
                                    ?.click()
                                }}
                              >
                                <span className="mr-1.5 truncate">
                                  {field.label}
                                </span>
                                <Check
                                  className={cn(
                                    'ml-auto size-4 shrink-0',
                                    field.id === filter.id
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="min-w-36 flex-1">
                  {renderFilterInput({ filter, inputId })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`Remove filter ${index + 1}`}
                  className="size-8 shrink-0 rounded"
                  onClick={() => removeFilter(filter.rowId)}
                >
                  <Trash2 className="!size-3.5" aria-hidden="true" />
                </Button>
              </div>
            )
          })}
        </div>
        <div className="flex w-full items-center gap-2">
          <Button
            size="sm"
            className="h-[1.85rem] rounded"
            onClick={addFilter}
            disabled={filterFields.length === filters.length}
          >
            Thêm bộ lọc
          </Button>
          {filters.length > 0 ? (
            <Button
              size="sm"
              variant="outline"
              className="rounded"
              onClick={() => {
                void setFilters([])
              }}
            >
              Đặt lại
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
