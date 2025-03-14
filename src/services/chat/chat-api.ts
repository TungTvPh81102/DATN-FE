import api from '@/configs/api'
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
    return await api.get(`${prefixDirectChat}/get-direct-chats`)
  },
  getGroupChats: async () => {
    return await api.get(`${prefixGroupChat}/get-group-chats`)
  },
  getGroupStudent: async () => {
    return await api.get(`${prefixGroupChat}/get-group-chats-student`)
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
      formData.append('file', data.file[0].blob)
      formData.append('type', data.file[0].type)
    }

    return await api.post(`${prefix}/send-message`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
