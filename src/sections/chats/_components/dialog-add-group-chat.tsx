import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateGroupChatPayload,
  createGroupChatSchema,
} from '@/validations/chat'
import { useGetLearners } from '@/hooks/learner/useLearner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCreateGroupChat } from '@/hooks/chat/useChat'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import QUERY_KEY from '@/constants/query-key'

type DialogAddGroupChatProps = {
  open: boolean
  onClose: () => void
}

const DialogAddGroupChat = ({ open, onClose }: DialogAddGroupChatProps) => {
  const queryClient = useQueryClient()

  const [memberOptions, setMemberOptions] = useState<
    { value: string; label: string; avatar: string }[]
  >([])

  const { data: learnerData, isLoading } = useGetLearners()
  const { mutate: createGroupChat, isPending } = useCreateGroupChat()

  const form = useForm<CreateGroupChatPayload>({
    resolver: zodResolver(createGroupChatSchema),
    defaultValues: { name: '', members: [] },
  })

  useEffect(() => {
    if (!isLoading && learnerData) {
      const options = learnerData.map((learner: any) => ({
        value: learner.id.toString(),
        label: learner.name,
        avatar: learner.avatar,
      }))
      setMemberOptions(options)
    }
  }, [learnerData, isLoading])

  const onSubmit = (data: CreateGroupChatPayload) => {
    createGroupChat(data, {
      onSuccess: async (res: any) => {
        form.reset()
        onClose()
        toast.success(res.message)
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.GROUP_CHAT],
        })
      },
      onError: (error: any) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset()
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Tạo nhóm của bạn</DialogTitle>
          <DialogDescription>
            Hãy bắt đầu hỗ trợ học viên bằng cách tạo nhóm cùng danh sách các
            thành viên.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Tên nhóm</Label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Nhập tên nhóm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Label>Thành viên</Label>
              <FormField
                control={form.control}
                name="members"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={(values) => field.onChange(values)}
                        loop
                        options={memberOptions}
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Chọn thành viên trong nhóm" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent className="w-full">
                          <MultiSelectorList className="max-h-44">
                            {memberOptions.map((option) => (
                              <MultiSelectorItem
                                key={option.value}
                                value={option.value}
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="size-6">
                                    <AvatarImage
                                      src={option.avatar}
                                      alt={option.label}
                                    />
                                    <AvatarFallback>
                                      {option.label.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{option.label}</span>
                                </div>
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button
                disabled={isPending}
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> đang tạo
                    ...
                  </>
                ) : (
                  'Tạo nhóm'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogAddGroupChat
