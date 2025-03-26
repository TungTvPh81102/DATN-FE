import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import {
  useAddMemberGroupChat,
  useGetRemainingMembers,
} from '@/hooks/chat/useChat'
import { useForm } from 'react-hook-form'
import {
  AddMemberGroupChatPayload,
  addMemberGroupChatSchema,
} from '@/validations/chat'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Search, UserRoundPlus, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import QUERY_KEY from '@/constants/query-key'
import { Input } from '@/components/ui/input'

type Member = {
  id: number
  name: string
  avatar: string
}

type InviteMemberDialogProps = {
  isOpen: boolean
  onClose: () => void
  channelId: number
}

const InviteMember = ({
  isOpen,
  onClose,
  channelId,
}: InviteMemberDialogProps) => {
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const { data: members, isLoading } = useGetRemainingMembers(channelId)
  const { mutate: addMember, isPending } = useAddMemberGroupChat()

  const form = useForm<AddMemberGroupChatPayload>({
    resolver: zodResolver(addMemberGroupChatSchema),
    defaultValues: {
      members: [],
    },
  })

  const toggleMemberSelection = (member: Member) => {
    const isAlreadySelected = selectedMembers.some(
      (selected) => selected.id === member.id
    )
    if (isAlreadySelected) {
      setSelectedMembers((prev) =>
        prev.filter((selected) => selected.id !== member.id)
      )
    } else {
      setSelectedMembers((prev) => [member, ...prev])
    }
  }

  const filteredMembers = members?.data?.filter((member: any) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleComplete = () => {
    const selectedIds = selectedMembers.map((member) => member.id.toString())

    addMember(
      {
        id: channelId,
        data: {
          members: selectedIds,
        },
      },
      {
        onSuccess: async (res: any) => {
          toast.success(res.message)
          setSelectedMembers([])
          onClose()
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.GROUP_CHAT, channelId],
          })
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      }
    )
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="flex items-center gap-2">
              <UserRoundPlus className="size-5" />
              Thêm thành viên
            </AlertDialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm thành viên..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </AlertDialogHeader>

        {selectedMembers.length > 0 && (
          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">
              Đã chọn {selectedMembers.length} thành viên
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 rounded-full bg-background px-3 py-1 text-sm"
                >
                  <Avatar className="size-6">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{member.name}</span>
                  <X
                    className="size-4 cursor-pointer hover:text-destructive"
                    onClick={() => toggleMemberSelection(member)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleComplete)}
            className="space-y-4"
          >
            <ScrollArea className="h-[300px] rounded-md border p-2">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : !filteredMembers?.length ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Không tìm thấy thành viên phù hợp
                </div>
              ) : (
                filteredMembers.map((member: any) => (
                  <FormField
                    key={member.id}
                    name={`member-${member.id}`}
                    render={() => (
                      <FormItem className="flex items-center gap-4 rounded-lg p-2 hover:bg-muted/50">
                        <Avatar className="size-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <FormLabel className="flex-1 cursor-pointer font-normal">
                          {member.name}
                        </FormLabel>
                        <Checkbox
                          checked={selectedMembers.some(
                            (selected) => selected.id === member.id
                          )}
                          onCheckedChange={() =>
                            toggleMemberSelection({
                              id: member.id,
                              name: member.name,
                              avatar: member.avatar,
                            })
                          }
                        />
                      </FormItem>
                    )}
                  />
                ))
              )}
            </ScrollArea>

            <AlertDialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isPending}>
                Hủy
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isPending || selectedMembers.length === 0}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  'Thêm thành viên'
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default InviteMember
