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
  useStartChatWithSystem,
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
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SystemMessagePayload, systemMessageSchema } from '@/validations/chat'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

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

  const getGroupChat = isInstructor ? useGetGroupChats : useGetGroupStudent

  const { data: groupChatData, isLoading: isLoadingGroupChat } = getGroupChat()
  const { data: directChatData, isLoading: isLoadingDirectChatData } =
    useGetDirectChats()
  const { mutate: startChatWithSystem, isPending } = useStartChatWithSystem()

  const systemMessageReasons = [
    'Hỗ trợ kỹ thuật',
    'Yêu cầu thanh toán',
    'Vấn đề tài khoản',
    'Đăng ký khóa học',
    'Khác',
  ]

  const reasonDetails = {
    'Hỗ trợ kỹ thuật': [
      'Lỗi đăng nhập',
      'Ứng dụng bị treo',
      'Sự cố phát video',
      'Lỗi tải tài liệu',
      'Vấn đề kỹ thuật khác',
    ],
    'Yêu cầu thanh toán': [
      'Thanh toán chưa xử lý',
      'Yêu cầu hoàn tiền',
      'Lỗi hóa đơn',
      'Vấn đề đăng ký gói',
      'Vấn đề thanh toán khác',
    ],
    'Vấn đề tài khoản': [
      'Không truy cập được tài khoản',
      'Lỗi cập nhật hồ sơ',
      'Vấn đề về quyền hạn',
      'Xác minh tài khoản',
      'Vấn đề tài khoản khác',
    ],
    'Đăng ký khóa học': [
      'Không thể đăng ký khóa học',
      'Không hiển thị khóa học',
      'Hết hạn đăng ký',
      'Vấn đề chứng chỉ',
      'Vấn đề đăng ký khác',
    ],
    Khác: [
      'Câu hỏi chung',
      'Góp ý',
      'Yêu cầu tính năng',
      'Báo lỗi',
      'Câu hỏi khác',
    ],
  }

  const form = useForm<SystemMessagePayload>({
    resolver: zodResolver(systemMessageSchema),
    defaultValues: {
      reason: '',
      details: '',
      description: '',
    },
  })

  const handleChannelSelect = (channel: IChannel) => {
    setSelectedChannel(channel)
    setLocalStorage(StorageKey.CHANNEL, channel)
  }

  const handleSystemMessageClick = () => {
    form.reset()
    setIsSystemMessageModalOpen(true)
  }

  const onSubmit = (values: SystemMessagePayload) => {
    startChatWithSystem(values, {
      onSuccess: () => {
        setIsSystemMessageModalOpen(false)
      },
    })
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
                    key={channel.conversation_id}
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

                <ScrollArea className="h-[300px]">
                  {!isLoadingGroupChat ? (
                    groupChatData?.map((channel) => (
                      <ChatItem
                        key={channel.conversation_id}
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
                </ScrollArea>
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
            <DialogTitle>Gửi tin nhắn đến hệ thống</DialogTitle>
            <DialogDescription>
              Vui lòng chọn loại vấn đề và chi tiết để hỗ trợ bạn tốt hơn
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại vấn đề</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue('details', '')
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại vấn đề" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {systemMessageReasons.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chi tiết vấn đề</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!form.getValues('reason')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chi tiết vấn đề" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {form.getValues('reason') &&
                          reasonDetails[
                            form.getValues(
                              'reason'
                            ) as keyof typeof reasonDetails
                          ]?.map((detail) => (
                            <SelectItem key={detail} value={detail}>
                              {detail}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả thêm (không bắt buộc)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập thêm thông tin về vấn đề của bạn..."
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSystemMessageModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
