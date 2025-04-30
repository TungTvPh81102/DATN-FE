import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IChannel, IMessage } from '@/types/Chat'
import {
  Ban,
  Bell,
  Download,
  FileText,
  ImageIcon,
  Link as LinkIcon,
  MessageCircle,
  Shield,
  UserMinus,
  UserRoundPlus,
  Users,
} from 'lucide-react'

import { ImagePreview } from '@/components/shared/image-preview'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PLACEHOLDER_AVATAR } from '@/constants/common'
import QUERY_KEY from '@/constants/query-key'
import {
  useKickMemberGroupChat,
  useStartDirectChat,
  useToggleBlockMemberInChat,
} from '@/hooks/chat/useChat'
import InviteMember from '@/sections/chats/_components/invite-member'
import { useAuthStore } from '@/stores/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'react-toastify'

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
  const [memberToBlock, setMemberToBlock] = useState<{
    is_blocked: string
    id: number
    name: string
  } | null>(null)
  const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false)
  const [isBlockAlertOpen, setIsBlockAlertOpen] = useState(false)

  const { mutate: startDirectChat } = useStartDirectChat()
  const { mutate: kickGroupMember, isPending: isKickingMember } =
    useKickMemberGroupChat()
  const { mutate: blockMember, isPending: isBlockingMember } =
    useToggleBlockMemberInChat()

  const isGroup = selectedChannel?.type === 'group'
  const isOwner = user?.id === selectedChannel.owner_id
  const isCurrentUser = user?.id === selectedChannel?.id

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

  const openRemoveAlert = (memberId: number, memberName: string) => {
    setMemberToRemove({ id: memberId, name: memberName })
    setIsRemoveAlertOpen(true)
  }

  const openBlockAlert = (
    memberId: number,
    memberName: string,
    is_blocked: string
  ) => {
    setMemberToBlock({ is_blocked, id: memberId, name: memberName })
    setIsBlockAlertOpen(true)
  }

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

  const handleBlockMember = () => {
    if (!selectedChannel?.conversation_id || !memberToBlock) return

    const action = memberToBlock.is_blocked ? 'unblock' : 'block'

    blockMember(
      {
        conversation_id: selectedChannel.conversation_id,
        member_id: memberToBlock.id,
        action: action,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.GROUP_DIRECT],
          })

          const updatedUsers = selectedChannel.users?.map((user) => {
            if (user.id === memberToBlock.id) {
              return {
                ...user,
                is_blocked: !memberToBlock.is_blocked,
              }
            }
            return user
          })

          if (setSelectedChannel) {
            setSelectedChannel({
              ...selectedChannel,
              users: updatedUsers,
            })
          }

          setMemberToBlock(null)
        },
      }
    )
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
      <div className="w-[340px] border-l bg-slate-50/50 pt-4 shadow-sm">
        <div className="sticky top-0 z-10 border-b border-l bg-white p-4 pb-3">
          <div className="flex flex-col items-center">
            <Avatar className="size-20 ring-2 ring-primary/20 ring-offset-2">
              <AvatarImage
                src={
                  isGroup
                    ? PLACEHOLDER_AVATAR
                    : user?.id === selectedChannel?.id
                      ? user?.avatar || PLACEHOLDER_AVATAR
                      : selectedChannel?.avatar || PLACEHOLDER_AVATAR
                }
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {isGroup
                  ? 'CN'
                  : user?.id === selectedChannel?.id
                    ? user?.name?.charAt(0)
                    : selectedChannel?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="mt-3 space-y-1 text-center">
              <h4 className="text-lg font-bold">
                {isGroup
                  ? selectedChannel.name
                  : user?.id === selectedChannel?.id
                    ? user?.name
                    : selectedChannel?.name}
              </h4>
              {isGroup ? (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {selectedChannel.users_count || 0} thành viên
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {isCurrentUser ? 'Bạn' : 'Trò chuyện riêng tư'}
                </Badge>
              )}
            </div>

            <p className="mt-3 text-center text-sm text-muted-foreground">
              {isGroup
                ? 'Hí anh em, chat vui vẻ nhé. Admin online 24/7 nên đừng xạo nha 😁'
                : isCurrentUser
                  ? 'Đây là thông tin của bạn'
                  : `Bạn đang chat với ${selectedChannel?.name}`}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <TooltipProvider>
                {isGroup && isOwner && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setIsInviteDialogOpen(true)}
                      >
                        <UserRoundPlus size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Thêm thành viên</TooltipContent>
                  </Tooltip>
                )}

                {isGroup && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setIsMembersDialogOpen(true)}
                      >
                        <Users size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Xem thành viên</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Bell size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Thông báo</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(100vh-240px)] overflow-y-auto px-4 pb-4">
          <Tabs defaultValue="media" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
              <TabsTrigger
                value="media"
                className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <ImageIcon className="size-3.5" />
                Ảnh & Video
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <FileText className="size-4" />
                Tài liệu
              </TabsTrigger>
              <TabsTrigger
                value="links"
                className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <LinkIcon className="size-3.5" />
                Liên kết
              </TabsTrigger>
            </TabsList>

            <TabsContent value="media" className="mt-4">
              {media.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {media.map((item, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-md bg-black/5 ring-1 ring-gray-200 transition-all hover:ring-primary"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <div className="relative size-full">
                        <Image
                          src={item.url}
                          alt="Media"
                          fill
                          sizes="(max-width: 768px) 33vw, 20vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-xs text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                        {item.sender.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-8 text-center shadow-sm">
                  <ImageIcon className="size-10 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Không có ảnh hoặc video nào
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              {files.length > 0 ? (
                <div className="space-y-3">
                  {files.map((file) => (
                    <a
                      key={file.id}
                      href={file.filePath}
                      download
                      className="group flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="size-5 text-primary" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="line-clamp-1 font-medium">
                            {file.fileName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Gửi bởi {file.sender.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm group-hover:text-primary">
                        <Download className="size-4" />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-8 text-center shadow-sm">
                  <FileText className="size-10 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Không có tài liệu nào
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="links" className="mt-4">
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-8 text-center shadow-sm">
                <LinkIcon className="size-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">
                  Không có liên kết nào
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-xl">
              <Users className="size-5" />
              Thành viên nhóm
            </DialogTitle>
            <DialogDescription className="text-center">
              Nhóm có {selectedChannel?.users_count || 0} thành viên
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {isOwner && (
              <>
                <div className="mb-3">
                  <h3 className="flex items-center gap-1.5 text-sm font-medium">
                    <Shield className="size-4 text-amber-500" />
                    Giảng viên
                  </h3>
                </div>
                <div className="space-y-2">
                  {selectedChannel?.users
                    ?.filter((member) => member.id === selectedChannel.owner_id)
                    .map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-lg bg-amber-50/50 p-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10 ring-1 ring-amber-200">
                            <AvatarImage src={member.avatar || ''} />
                            <AvatarFallback className="bg-amber-100 text-amber-800">
                              {member.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {member.name}
                              {member.id === user?.id && ' (Bạn)'}
                            </span>
                            <span className="text-xs text-amber-700">
                              Giảng viên
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <Separator className="my-4" />

                <div className="mb-3">
                  <h3 className="flex items-center gap-1.5 text-sm font-medium">
                    <Users className="size-4 text-blue-500" />
                    Thành viên
                  </h3>
                </div>
              </>
            )}

            <div className="space-y-2">
              {selectedChannel?.users?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-colors hover:bg-slate-50"
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
                        <MessageCircle className="mr-1.5 size-3.5" />
                        <span className="text-xs">Nhắn tin</span>
                      </Button>
                    )}
                    {user?.id === selectedChannel.owner_id &&
                      member.id !== selectedChannel.owner_id && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 ${member.is_blocked ? 'text-blue-500 hover:bg-blue-50 hover:text-blue-600' : 'text-red-500 hover:bg-red-50 hover:text-red-600'}`}
                            onClick={() =>
                              openBlockAlert(
                                member.id,
                                member.name,
                                member.is_blocked
                              )
                            }
                          >
                            <Ban className="mr-1.5 size-3.5" />
                            <span className="text-xs">
                              {member.is_blocked ? 'Bỏ chặn' : 'Chặn'}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() =>
                              openRemoveAlert(member.id, member.name)
                            }
                            disabled={isKickingMember}
                          >
                            <UserMinus className="mr-1.5 size-3.5" />
                            <span className="text-xs">Xóa</span>
                          </Button>
                        </>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {isOwner && (
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
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <UserMinus className="size-5" />
              Xác nhận xóa thành viên
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa <strong>{memberToRemove?.name}</strong>{' '}
              khỏi nhóm không? Thành viên này sẽ không thể truy cập lại vào nhóm
              trừ khi được mời lại.
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

      <AlertDialog open={isBlockAlertOpen} onOpenChange={setIsBlockAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Ban className="size-5" />
              {memberToBlock?.is_blocked
                ? 'Xác nhận bỏ chặn người dùng'
                : 'Xác nhận chặn người dùng'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {memberToBlock?.is_blocked ? (
                <>
                  Bạn có chắc chắn muốn <strong>bỏ chặn</strong>{' '}
                  <strong>{memberToBlock?.name}</strong>? Sau khi bỏ chặn, bạn
                  có thể nhắn tin và nhận thông báo từ người này.
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn <strong>chặn</strong>{' '}
                  <strong>{memberToBlock?.name}</strong>? Sau khi chặn, hai bạn
                  sẽ không thể nhắn tin cho nhau và sẽ không nhận được thông báo
                  từ người này.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToBlock(null)}>
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockMember}
              className={
                memberToBlock?.is_blocked ? '' : 'bg-red-500 hover:bg-red-600'
              }
              disabled={isBlockingMember}
            >
              {isBlockingMember
                ? memberToBlock?.is_blocked
                  ? 'Đang bỏ chặn...'
                  : 'Đang chặn...'
                : memberToBlock?.is_blocked
                  ? 'Bỏ chặn thành viên'
                  : 'Chặn thành viên'}
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
