export interface IMessage {
  id: number
  senderId: number
  timestamp: string
  text: string
  content: string
  type: 'text' | 'image' | 'file' | 'video' | 'audio'
  meta_data?: {
    file_path: string
    [key: string]: any
  }
  parent?: {
    id: number
    senderId: number
    text: string
    sender: {
      name: string
      avatar: string
    }
  } | null
  sender: {
    name: string
    avatar: string
    id?: number
  }
}

export interface IChannel {
  avatar: string
  conversation_id: number
  id: number
  is_online: boolean
  name: string

  // Group chat
  online_users?: number
  owner_id?: number
  status?: 0 | 1
  type?: 'group' | 'direct'
  update_at?: string | Date
  users?: {
    id: number
    name: string
    avatar: string
    pivot: {
      conversation_id: number
      user_id: number
    }
  }[]
  users_count?: number
}
