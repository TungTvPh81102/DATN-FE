import { BadgeProps } from '@/components/ui/badge'

export enum LiveStatus {
  LIVE = 'live',
  ENDED = 'ended',
  UPCOMING = 'upcoming',
}

export const LiveStatusMap: Record<
  LiveStatus,
  { label: string; badge: BadgeProps['variant'] }
> = {
  [LiveStatus.ENDED]: { label: 'Đã kết thúc', badge: 'secondary' },
  [LiveStatus.LIVE]: { label: 'Đang phát', badge: 'success' },
  [LiveStatus.UPCOMING]: { label: 'Đã lên lịch', badge: 'info' },
}

export interface LiveSession {
  id?: string
  code?: string
  title: string
  thumbnail: string
  description?: string
  visibility: 'public' | 'private'
  status?: `${LiveStatus}`
  starts_at?: Date
  ends_at?: Date
  created_at?: Date
  updated_at?: Date
}
