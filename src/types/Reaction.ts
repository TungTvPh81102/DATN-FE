export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'

export interface ReactionUser {
  avatar: string
  user_name: string
  react_type: ReactionType
}

export const reactionEmojis = [
  { emoji: '👍', name: 'Thích', type: 'like' },
  { emoji: '❤️', name: 'Yêu thích', type: 'love' },
  { emoji: '😆', name: 'Haha', type: 'haha' },
  { emoji: '😮', name: 'Wow', type: 'wow' },
  { emoji: '😢', name: 'Buồn', type: 'sad' },
  { emoji: '😡', name: 'Phẫn nộ', type: 'angry' },
]

export interface ReactionData {
  like_count: number
  love_count: number
  haha_count: number
  wow_count: number
  sad_count: number
  angry_count: number
  totalReactions: number
  reactions: ReactionUser[]
}
