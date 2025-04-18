import api from '@/configs/api'
import { ChatAiMessageResponse, ChatAiSendMessageRequest } from '@/types/Ai'

const prefix = 'chat-box'

export const aiApi = {
  sendMessageAi: async (
    data: ChatAiSendMessageRequest
  ): Promise<ChatAiMessageResponse> => {
    const res = await api.post(prefix, data)
    return res.data
  },
  clearChatAi: async (): Promise<ChatAiMessageResponse> => {
    const res = await api.post(prefix, { clear_history: true })
    return res.data
  },
}
