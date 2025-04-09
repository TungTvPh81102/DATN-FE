import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bell,
  ChevronDown,
  Download,
  FileText,
  ImageIcon,
  MessageCircle,
  UserMinus,
  UserRoundPlus,
  Users,
} from 'lucide-react'
import { IChannel, IMessage } from '@/types/Chat'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { ImagePreview } from '@/components/shared/image-preview'
import {
  useKickMemberGroupChat,
  useStartDirectChat,
} from '@/hooks/chat/useChat'
import { useQueryClient } from '@tanstack/react-query'
import QUERY_KEY from '@/constants/query-key'
import InviteMember from '@/sections/chats/_components/invite-member'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from 'react-toastify'
import { PLACEHOLDER_AVATAR } from '@/constants/common'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ChannelInfoPanelProps {
  selectedChannel: IChannel
  messages?: IMessage[]
  setSelectedChannel: (channel: IChannel | null) => void
}

export const SidebarChatInfo = ({
  selectedChannel,
  messages,
  setSelectedChannel,
}: ChannelInfoPanelProps) => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  )
  const [memberToRemove, setMemberToRemove] = useState<{
    id: number
    name: string
  } | null>(null)
  const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false)

  const { mutate: startDirectChat } = useStartDirectChat()
  const { mutate: kickGroupMember, isPending: isKickingMember } =
    useKickMemberGroupChat()

  const isGroup = selectedChannel?.type === 'group'

  const mediaMessages =
    messages?.filter(
      (msg) =>
        msg.type === 'image' || msg.type === 'video' || msg.type === 'file'
    ) || []

  const media = mediaMessages
    .filter((msg) => msg.type === 'image' || msg.type === 'video')
    .map((message) => ({
      url: `${process.env.NEXT_PUBLIC_STORAGE}/${message.meta_data?.[0]?.file_path || ''}`,
      type: message.type as 'image' | 'video',
      sender: message.sender,
    }))

  const files = mediaMessages
    .filter((msg) => msg.type === 'file')
    .map((message) => ({
      ...message,
      fileName: message.meta_data?.[0]?.file_name || 'Unknown file',
      filePath: `${process.env.NEXT_PUBLIC_STORAGE}/${message.meta_data?.[0]?.file_path || ''}`,
    }))

  const handleRemoveMember = () => {
    if (!selectedChannel?.conversation_id || !memberToRemove) return

    kickGroupMember(
      {
        conversation_id: selectedChannel.conversation_id,
        member_id: memberToRemove.id,
      },
      {
        onSuccess: async (res: any) => {
          toast.success(res.message)
          setMemberToRemove(null)
        },
        onError: (error: any) => {
          toast.error(error?.message)
        },
      }
    )
  }

  const openRemoveAlert = (memberId: number, memberName: string) => {
    setMemberToRemove({ id: memberId, name: memberName })
    setIsRemoveAlertOpen(true)
  }

  const handleStartDirectChat = (
    memberId: number,
    memberName: string,
    memberAvatar: string
  ) => {
    if (!memberId) return
    startDirectChat(
      {
        recipient_id: memberId,
      },
      {
        onSuccess: async (res: any) => {
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.GROUP_DIRECT],
          })
          if (res?.data) {
            setSelectedChannel({
              ...res.data.id,
              name: memberName,
              avatar: memberAvatar,
            })
          }
          setIsMembersDialogOpen(false)
        },
      }
    )
  }

  return (
    <>
      <div className="w-[340px] border-l p-4">
        <div className="flex flex-col items-center">
          <Avatar className="size-20">
            <AvatarImage
              src={
                isGroup
                  ? PLACEHOLDER_AVATAR
                  : user?.id === selectedChannel?.id
                    ? user?.avatar || PLACEHOLDER_AVATAR
                    : selectedChannel?.avatar || PLACEHOLDER_AVATAR
              }
            />
            <AvatarFallback>
              {isGroup
                ? 'CN'
                : user?.id === selectedChannel?.id
                  ? user?.name?.charAt(0)
                  : selectedChannel?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-2 space-y-4 text-center">
            <h4 className="font-bold">
              {isGroup
                ? selectedChannel.name
                : user?.id === selectedChannel?.id
                  ? user?.name
                  : selectedChannel?.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {isGroup
                ? 'Hí anh em, chat vui vẻ nhé. Admin online 24/7 nên đừng xạo nha 😁 Telegram: @vietnam_laravel'
                : user?.id === selectedChannel?.id
                  ? 'Đây là thông tin của bạn'
                  : `Bạn đang chat với ${selectedChannel?.name}`}
            </p>

            <div className="flex items-center justify-center gap-4 *:cursor-pointer">
              {isGroup && user?.id === selectedChannel.owner_id && (
                <div
                  className="flex size-12 items-center justify-center rounded-full bg-gray-300 p-4"
                  onClick={() => setIsInviteDialogOpen(true)}
                >
                  <UserRoundPlus size={24} />
                </div>
              )}
              <div className="flex size-12 items-center justify-center rounded-full bg-gray-300 p-4">
                <Bell size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {isGroup && (
            <div className="mb-2">
              <button
                onClick={() => setIsMembersDialogOpen(true)}
                className="flex w-full items-center justify-between rounded-md p-4 transition-colors hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Users className="size-5" />
                  <h4 className="font-medium">Thành viên nhóm</h4>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {selectedChannel.users_count || 0}
                  </span>
                </div>
              </button>
            </div>
          )}
          <Collapsible className="w-full transition-all duration-200 ease-in-out">
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-4 transition-colors hover:bg-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="size-5" />
                <h4 className="font-medium">File phương tiện, liên kết</h4>
              </div>
              <ChevronDown className="[data-state=open]:rotate-180 size-4 transition-transform duration-200" />
            </CollapsibleTrigger>

            <CollapsibleContent className="w-full overflow-hidden transition-all">
              <Tabs defaultValue="media" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
                  <TabsTrigger
                    value="media"
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <ImageIcon className="size-4" />
                    Ảnh & Video
                  </TabsTrigger>
                  <TabsTrigger
                    value="files"
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <FileText className="size-4" />
                    Tài liệu
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="media" className="mt-4">
                  {media.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {media.map((item, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square cursor-pointer overflow-hidden rounded-md ring-1 ring-gray-200"
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <div className="relative size-full">
                            <Image
                              src={item.url}
                              alt="Media"
                              fill
                              sizes="(max-width: 768px) 33vw, 20vw"
                              className="object-cover transition-all duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-xs text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                            {item.sender.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                      <ImageIcon className="size-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        Không có ảnh hoặc video nào
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="files" className="mt-4">
                  {files.length > 0 ? (
                    <div className="space-y-2">
                      {files.map((file) => (
                        <a
                          key={file.id}
                          href={file.filePath}
                          download
                          className="group flex items-center justify-between rounded-lg border p-3 transition-all hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                              <FileText className="size-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="line-clamp-1 text-sm font-medium">
                                {file.fileName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Gửi bởi {file.sender.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex size-8 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100">
                            <Download className="size-4" />
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                      <FileText className="size-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        Không có tài liệu nào
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Thành viên nhóm</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-2 py-2">
              {selectedChannel?.users?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={member.avatar || ''} />
                      <AvatarFallback>{member.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {member.name}
                        {member.id === user?.id && ' (Bạn)'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {member.id === selectedChannel.owner_id
                          ? 'Giảng viên'
                          : 'Thành viên'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user?.id !== member.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() =>
                          handleStartDirectChat(
                            member.id,
                            member.name,
                            member.avatar
                          )
                        }
                      >
                        <MessageCircle className="mr-1 size-4" />
                        <span className="text-xs">Nhắn tin</span>
                      </Button>
                    )}
                    {user?.id === selectedChannel.owner_id &&
                      member.id !== selectedChannel.owner_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() =>
                            openRemoveAlert(member.id, member.name)
                          }
                          disabled={isKickingMember}
                        >
                          <UserMinus className="mr-1 size-4" />
                          <span className="text-xs">Xóa</span>
                        </Button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {user?.id === selectedChannel.owner_id && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => {
                  setIsMembersDialogOpen(false)
                  setIsInviteDialogOpen(true)
                }}
                className="flex items-center gap-2"
              >
                <UserRoundPlus className="size-4" />
                Thêm thành viên
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isRemoveAlertOpen} onOpenChange={setIsRemoveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thành viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {memberToRemove?.name} khỏi nhóm không?
              Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToRemove(null)}>
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-500 hover:bg-red-600"
              disabled={isKickingMember}
            >
              {isKickingMember ? 'Đang xóa...' : 'Xóa thành viên'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedImageIndex !== null && (
        <ImagePreview
          isOpen={true}
          onClose={() => setSelectedImageIndex(null)}
          images={media}
          initialIndex={selectedImageIndex}
        />
      )}
      {isGroup && (
        <InviteMember
          isOpen={isInviteDialogOpen}
          channelId={selectedChannel?.conversation_id}
          onClose={() => setIsInviteDialogOpen(false)}
        />
      )}
    </>
  )
}
