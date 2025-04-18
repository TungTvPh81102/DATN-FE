export interface MessageAi {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatAiSendMessageRequest {
  message: string
  context: string
  course_name?: string
  lesson_title?: string
}

export interface ChatAiMessageResponse {
  reply: string
  time: string
  status?: string
  message?: string
}
