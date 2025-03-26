export const setLocalStorage = (key: string, value: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const getLocalStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

export const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value)
}

export const formatCurrency = (
  value: number | bigint | Intl.StringNumericLiteral | string
): string => {
  if (typeof value === 'string') value = parseFloat(value)
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

export const formatVietnameseCurrency = (value: any) => {
  if (typeof value !== 'number' || isNaN(value)) return 'Không hợp lệ'

  const units = [
    { value: 1_000_000_000, suffix: 'tỉ' },
    { value: 1_000_000, suffix: 'triệu' },
    { value: 1_000, suffix: 'ngàn' },
  ]

  for (const unit of units) {
    if (value >= unit.value) {
      const formatted = (value / unit.value).toFixed(2).replace(/\.00$/, '')
      return `${formatted} ${unit.suffix}`
    }
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

export const formatDate = (
  value: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Intl.DateTimeFormat('vi-VN', options).format(new Date(value))
}

export const formatPercentage = (value: any): string => {
  if (!value) return '0%'

  if (typeof value === 'string') value = parseFloat(value)

  return new Intl.NumberFormat('vi-VN', {
    style: 'percent',
  }).format(value / 100)
}

export const formatDuration = (
  seconds: number,
  type: 'text' | 'colon' = 'text'
) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (type === 'colon') {
    return hours > 0
      ? `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${secs
          .toString()
          .padStart(2, '0')}`
  }

  let result = ''
  if (hours > 0) result += `${hours} giờ `
  if (minutes > 0) result += `${minutes} phút `

  return result.trim()
}

export const removeVietnameseTones = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const formatStringToCurrency = (amount: number | string): string => {
  return `${Number(amount).toLocaleString('vi-VN')}đ`
}

export const timeAgo = (dataTime: string) => {
  const now = new Date()
  const time = new Date(dataTime)
  const diffInMs = now.getTime() - time.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ngày trước`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} năm trước`
}

export const generateRandomCode = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
