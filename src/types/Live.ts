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
  starts_at?: string | null
  actual_start_time?: string | null
  actual_end_time?: string | null
  instructor?: {
    code: string
    avatar: string
    name: string
  }
  liveStreamCredential?: {
    id: number
    key: string
  }
  view_counts?: number
  created_at?: Date
  updated_at?: Date
}

export interface GetLiveSessionParams {
  status: 'upcoming' | 'live' | 'all'
  page?: number
}

export interface GetLiveSessionResponse {
  live_streams: {
    current_page: number
    data: LiveSession[]
    last_page: number
    per_page: number
    total: number
  }
  counts: {
    upcoming: number
    live: number
  }
}

export interface LiveChat {
  id: number
  userId?: number | null
  userName?: string
  message: string
  timestamp: string
  userAvatar?: string
  type?: 'chat' | 'system'
}
