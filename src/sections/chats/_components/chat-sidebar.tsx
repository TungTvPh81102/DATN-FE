'use client'

import { MessageCircleQuestion, Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Role } from '@/constants/role'
import StorageKey from '@/constants/storage-key'
import {
  useGetDirectChats,
  useGetGroupChats,
  useGetGroupStudent,
} from '@/hooks/chat/useChat'
import { setLocalStorage } from '@/lib/common'
import { useAuthStore } from '@/stores/useAuthStore'
import { IChannel } from '@/types/Chat'
import { ChatItem, ChatSkeleton, GroupChatSkeleton } from './chat-item'
import DialogAddGroupChat from './dialog-add-group-chat'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const ChatSidebar = ({
  selectedChannel,
  setSelectedChannel,
}: {
  selectedChannel: IChannel | null
  setSelectedChannel: React.Dispatch<React.SetStateAction<IChannel | null>>
}) => {
  const { role } = useAuthStore()
  const isInstructor = role === Role.INSTRUCTOR

  const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats')
  const [addGroupChat, setAddGroupChat] = useState(false)
  const [isSystemMessageModalOpen, setIsSystemMessageModalOpen] =
    useState(false)
  const [systemMessageReason, setSystemMessageReason] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const getGroupChat = isInstructor ? useGetGroupChats : useGetGroupStudent

  const { data: groupChatData, isLoading: isLoadingGroupChat } = getGroupChat()
  const { data: directChatData, isLoading: isLoadingDirectChatData } =
    useGetDirectChats()

  console.log(groupChatData)

  const systemMessageReasons = [
    'Technical Support',
    'Billing Inquiry',
    'Account Issue',
    'Other',
  ]

  const employees = [
    { id: '1', name: 'John Doe', department: 'Support' },
    { id: '2', name: 'Jane Smith', department: 'Billing' },
    { id: '3', name: 'Mike Johnson', department: 'Admin' },
  ]

  const handleChannelSelect = (channel: IChannel) => {
    setSelectedChannel(channel)
    setLocalStorage(StorageKey.CHANNEL, channel)
  }

  const handleSystemMessageClick = () => {
    setIsSystemMessageModalOpen(true)
  }

  return (
    <>
      <div className="flex w-80 flex-col border-r">
        <div className="border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Liên hệ</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSystemMessageClick}
              className="text-muted-foreground"
              title="Create System Message"
            >
              <MessageCircleQuestion className="size-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm..." className="pl-8" />
          </div>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'chats'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('chats')}
          >
            Nhóm của tôi
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'contacts'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('contacts')}
          >
            Học viên
          </button>
        </div>

        <ScrollArea className="flex-1">
          {activeTab === 'chats' ? (
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Liên hệ gần đây
                </h3>
              </div>

              {!isLoadingDirectChatData ? (
                directChatData?.map((channel) => (
                  <ChatItem
                    key={channel.id}
                    channel={channel}
                    isSelected={channel.conversation_id === selectedChannel?.id}
                    onClick={() => handleChannelSelect(channel)}
                  />
                ))
              ) : (
                <ChatSkeleton />
              )}

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Nhóm của tôi
                  </h3>
                  {isInstructor && (
                    <Button
                      onClick={() => setAddGroupChat(true)}
                      size="icon"
                      variant="ghost"
                      className="size-4"
                    >
                      <Plus className="size-4" />
                    </Button>
                  )}
                </div>

                {!isLoadingGroupChat ? (
                  groupChatData?.map((channel) => (
                    <ChatItem
                      key={channel.id}
                      channel={channel}
                      isSelected={
                        channel.conversation_id === selectedChannel?.id
                      }
                      onClick={() => handleChannelSelect(channel)}
                    />
                  ))
                ) : (
                  <GroupChatSkeleton />
                )}
              </div>
            </div>
          ) : (
            <div className="p-4"></div>
          )}
        </ScrollArea>
      </div>

      <Dialog
        open={isSystemMessageModalOpen}
        onOpenChange={setIsSystemMessageModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create System Message</DialogTitle>
            <DialogDescription>
              Select a reason and assign an employee to handle this issue.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block">Reason for System Message</label>
              <Select
                value={systemMessageReason}
                onValueChange={setSystemMessageReason}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {systemMessageReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block">Assign to Employee</label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              disabled={!systemMessageReason || !selectedEmployee}
            >
              Submit System Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isInstructor && (
        <DialogAddGroupChat
          onClose={() => setAddGroupChat(false)}
          open={addGroupChat}
        />
      )}
    </>
  )
}
