'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface DateTimePickerProps {
  value?: Date | undefined
  onChange?: (date: Date) => void
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (value) {
      setDate(value)
    }
  }, [value])

  const getStartOfToday = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  }

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const updatedDate = new Date(newDate)
      if (date) {
        updatedDate.setHours(date.getHours())
        updatedDate.setMinutes(date.getMinutes())
      } else {
        const now = new Date()
        updatedDate.setHours(now.getHours())
        updatedDate.setMinutes(Math.ceil(now.getMinutes() / 5) * 5)
      }

      setDate(updatedDate)
      onChange?.(updatedDate)
    }
  }

  const handleTimeChange = (type: 'hour' | 'minute', value: number) => {
    if (date) {
      const newDate = new Date(date)
      if (type === 'hour') {
        newDate.setHours(value)
      } else {
        newDate.setMinutes(value)
      }
      setDate(newDate)
      onChange?.(newDate)
    } else {
      const now = new Date()
      if (type === 'hour') {
        now.setHours(value)
      } else {
        now.setMinutes(value)
      }
      setDate(now)
      onChange?.(now)
    }
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const formatDateInVNTimezone = (date: Date | undefined) => {
    if (!date) return null

    return format(date, 'dd/MM/yyyy HH:mm')
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? formatDateInVNTimezone(date) : <span>MM/DD/YYYY hh:mm</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            disabled={(date) => {
              const startOfToday = getStartOfToday()
              return date < startOfToday
            }}
          />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {hours.map((hour) => {
                  const isToday =
                    date &&
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() &&
                    date.getFullYear() === new Date().getFullYear()

                  const isPastHour = isToday && hour < new Date().getHours()

                  return (
                    <Button
                      key={hour}
                      variant={
                        date && date.getHours() === hour ? 'default' : 'ghost'
                      }
                      className={cn(
                        'aspect-square shrink-0 sm:w-full',
                        isPastHour && 'cursor-not-allowed opacity-50'
                      )}
                      disabled={isPastHour}
                      onClick={() => handleTimeChange('hour', hour)}
                    >
                      {hour.toString().padStart(2, '0')}:00
                    </Button>
                  )
                })}
              </div>
              <ScrollBar />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {minutes.map((minute) => {
                  const isToday =
                    date &&
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() &&
                    date.getFullYear() === new Date().getFullYear()

                  const isPastMinute =
                    isToday &&
                    date &&
                    date.getHours() === new Date().getHours() &&
                    minute < new Date().getMinutes()

                  const isPastHour =
                    isToday && date && date.getHours() < new Date().getHours()

                  const isDisabled = isPastMinute || isPastHour

                  return (
                    <Button
                      key={minute}
                      variant={
                        date && date.getMinutes() === minute
                          ? 'default'
                          : 'ghost'
                      }
                      className={cn(
                        'aspect-square shrink-0 sm:w-full',
                        isDisabled && 'cursor-not-allowed opacity-50'
                      )}
                      disabled={isDisabled}
                      onClick={() => handleTimeChange('minute', minute)}
                    >
                      {minute.toString().padStart(2, '0')} phút
                    </Button>
                  )
                })}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
