import { useMutation } from '@tanstack/react-query'
import { aiApi } from '@/services/ai/ai-api'

export const useSendMessageAi = () => {
  return useMutation({
    mutationFn: aiApi.sendMessageAi,
  })
}

export const useClearChatAi = () => {
  return useMutation({
    mutationFn: aiApi.clearChatAi,
  })
}
