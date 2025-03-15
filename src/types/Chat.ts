import { IUser } from '@/types/User'

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
  }
}

export interface IChannel {
  users: IUser[]
  id: number
  name: string
  avatar: string
  owner_id?: number
  conversation_id: number
  online?: boolean
  type?: 'group' | 'direct'
  pivot?: {
    conversation_id: number
  }
  users_count: number
  online_users: number
  members: string[]
}
