import api from '@/configs/api'

export interface IReactionPayload {
  comment_id: string
  type: string
}

export const reactionApi = {
  toggleReaction: async (data: IReactionPayload) => {
    return await api.post(`/reactions`, data)
  },
  getReactionWithComment: async (commentId: string) => {
    return await api.get(`/reactions/${commentId}`)
  },
}
