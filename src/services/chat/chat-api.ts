import api from '@/configs/api'
import { IChannel } from '@/types/Chat'
import {
  AddMemberGroupChatPayload,
  CreateGroupChatPayload,
  MessagePayload,
} from '@/validations/chat'

const prefix = '/chats'
const prefixGroupChat = '/chats/group'
const prefixDirectChat = '/chats/direct'

export const chatApi = {
  getDirectChats: async () => {
    const { data } = await api.get(`${prefixDirectChat}/get-direct-chats`)
    return data as IChannel[]
  },
  getGroupChats: async () => {
    const { data } = await api.get(`${prefixGroupChat}/get-group-chats`)
    return data as IChannel[]
  },
  getGroupStudent: async () => {
    const { data } = await api.get(`${prefixGroupChat}/get-group-student`)
    return data as IChannel[]
  },
  getInfoGroupChat: async (id: string) => {
    return await api.get(`${prefixGroupChat}/info-group-chat/${id}`)
  },
  getRemainingMembers: async (channelId: number) => {
    return await api.get(`${prefixGroupChat}/${channelId}/remaining-members`)
  },
  getMessages: async (conversation_id: number) => {
    const response = await api.get(`${prefix}/get-message/${conversation_id}`)
    return response.data
  },
  createGroupChat: async (data: CreateGroupChatPayload) => {
    return await api.post(`${prefixGroupChat}/create-group-chat`, data)
  },
  addMemberGroupChat: async (id: number, data: AddMemberGroupChatPayload) => {
    return await api.post(
      `${prefixGroupChat}/add-member-group-chat/${id}`,
      data
    )
  },
  startDirectChat: async (recipient_id: number) => {
    return await api.post(`${prefixDirectChat}/start-direct-chat`, {
      recipient_id,
    })
  },
  sendMessage: async (data: MessagePayload) => {
    const formData = new FormData()

    if (data.conversation_id) {
      formData.append('conversation_id', data.conversation_id.toString())
    }

    if (data.content) {
      formData.append('content', data.content)
    }

    if (data.type) {
      formData.append('type', data.type)
    }

    if (data.parent_id) {
      formData.append('parent_id', data.parent_id.toString())
    }

    if (data.file && data.file.length > 0) {
      const fileType = data.file[0].type
      const allSameType = data.file.every((file: any) => file.type === fileType)

      if (!allSameType) {
        throw new Error('Chỉ được phép gửi các file cùng loại')
      }

      data.file.forEach((file: any, index: number) => {
        formData.append(`files[${index}]`, file.blob)
      })

      formData.append('type', fileType)
    }

    return await api.post(`${prefix}/send-message`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  kickMemberGroupChat: async (data: {
    conversation_id: number
    member_id: number
  }) => {
    return await api.delete(`${prefixGroupChat}/kick-member-group-chat`, {
      data: data,
    })
  },
}
