import { ICourseFilter } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNow, FormatDistanceToNowOptions } from 'date-fns'
import { vi } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytes')
      : (sizes[i] ?? 'Bytes')
  }`
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim()
}

export const distanceToNow = (
  date: string | number | Date,
  options?: FormatDistanceToNowOptions
) => {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: vi,
    ...options,
  })
}

export const getAvatarText = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const updateCourseFilters = <K extends keyof ICourseFilter>(
  key: K,
  value: ICourseFilter[K]
) => {
  localStorage.removeItem('courseFilters')

  const updatedFilters: ICourseFilter = {
    [key]: value,
  }

  localStorage.setItem('courseFilters', JSON.stringify(updatedFilters))
  window.dispatchEvent(new Event('courseFiltersUpdated'))
}
