import ChatView from '@/sections/chats/view/chat-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trò chuyện',
  description:
    'Giảng viên dễ dàng trò chuyện và hỗ trợ học viên trong quá trình học tập, trao đổi thông tin nhanh chóng và hiệu quả.',
}

const ChatPage = () => {
  return <ChatView />
}
export default ChatPage
