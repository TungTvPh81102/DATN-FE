import ChatView from '@/sections/chats/view/chat-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trò chuyện',
}

const ChatPage = () => {
  return <ChatView />
}
export default ChatPage
