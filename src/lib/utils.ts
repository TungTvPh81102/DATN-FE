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

export const getProgressStyle = (percent: number) => {
  if (percent < 25) {
    return 'bg-gradient-to-r from-red-500 to-orange-500'
  } else if (percent < 50) {
    return 'bg-gradient-to-r from-orange-400 to-yellow-400'
  } else if (percent < 75) {
    return 'bg-gradient-to-r from-yellow-300 to-green-400'
  } else {
    return 'bg-gradient-to-r from-green-400 to-emerald-500'
  }
}

export const handleDownload = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const link = document.createElement('a')

    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Lỗi khi tải chứng chỉ:', error)
  }
}
