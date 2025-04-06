import { BadgeProps } from '@/components/ui/badge'
import { ICategory } from './Category'
import { IUser } from './User'

export enum PostStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
  PRIVATE = 'private',
}

export const PostStatusMap: Record<
  PostStatus,
  { label: string; badge: BadgeProps['variant'] }
> = {
  [PostStatus.DRAFT]: { label: 'Bản nháp', badge: 'secondary' },
  [PostStatus.PENDING]: { label: 'Chờ duyệt', badge: 'info' },
  [PostStatus.PUBLISHED]: { label: 'Công khai', badge: 'success' },
  [PostStatus.PRIVATE]: { label: 'Riêng tư', badge: 'warning' },
}

export interface IPost {
  id: number
  user_id?: number
  category_id?: number
  title: string
  slug?: string
  description?: string
  content?: string
  thumbnail?: string
  status: PostStatus
  view?: number
  isHot?: 0 | 1
  published_at?: Date | null
  deleted_at?: Date | null
  created_at?: Date | null
  updated_at?: Date | null
  user: IUser
  category: ICategory
}

export interface ILikePost {
  id?: number
  userId?: number
  postId?: number
  likeType?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface ITopPost {
  id: number
  title: string
  slug: string
  thumbnail?: string | null
  created_at: Date | string
  user: {
    name: string
    avatar: string
    code: string
  }
  category: {
    name: string
    slug: string
  }
  views: number
  comments_count: number
}

export interface ITopPostResponse {
  message: string
  data: ITopPost[]
}
