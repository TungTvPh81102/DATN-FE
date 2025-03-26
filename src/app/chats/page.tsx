import ProtectedRoute from '@/components/shared/protected-route'
import ChatView from '@/sections/chats/view/chat-view'
import { ChatHeader } from './_component/chat-header'
import { cookies } from 'next/headers'
import { Role } from '@/constants/role'
import { redirect } from 'next/navigation'

const ChatUserPage = () => {
  const cookieStore = cookies()
  const role = cookieStore.get('role')

  if (role?.value === Role.INSTRUCTOR) {
    redirect('/instructor/chats')
  }

  return (
    <ProtectedRoute>
      <ChatHeader />
      <div className="h-[calc(100svh-4rem)] overflow-y-auto">
        <ChatView />
      </div>
    </ProtectedRoute>
  )
}
export default ChatUserPage
