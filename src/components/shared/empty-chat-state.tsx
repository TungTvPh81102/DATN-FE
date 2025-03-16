import React from 'react'
import { MessageSquare } from 'lucide-react'

interface EmptyChatStateProps {
  conversationName?: string
}

const EmptyChatState: React.FC<EmptyChatStateProps> = ({
  conversationName,
}) => {
  return (
    <div className="flex size-full flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-orange-100">
          <MessageSquare className="size-8 text-orange-500" />
        </div>

        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-medium text-gray-800">
            {conversationName
              ? `Bắt đầu cuộc trò chuyện với "${conversationName}"`
              : 'Chưa có tin nhắn nào'}
          </h3>

          <p className="text-gray-500">
            Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmptyChatState
