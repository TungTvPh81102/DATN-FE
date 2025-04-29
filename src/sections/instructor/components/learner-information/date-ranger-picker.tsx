import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[280px] justify-start border-[#E27447] bg-white text-left font-normal',
              !dateRange && 'text-muted-foreground',
              dateRange && 'text-[#E27447]'
            )}
          >
            <CalendarIcon className="mr-2 size-4 text-[#E27447]" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd/MM/yyyy')} -{' '}
                  {format(dateRange.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(dateRange.from, 'dd/MM/yyyy')
              )
            ) : (
              <span>Chọn khoảng thời gian</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
          <div className="border-b border-gray-100 bg-white p-3">
            <h3 className="text-sm font-medium text-gray-800">
              Chọn khoảng thời gian
            </h3>
            <p className="text-xs text-gray-500">
              Chọn ngày bắt đầu và kết thúc
            </p>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            className="rounded-b-lg border-t border-gray-100 p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
