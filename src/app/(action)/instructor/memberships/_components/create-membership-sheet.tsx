import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Loader2, Plus } from 'lucide-react'
import { MembershipForm } from './membership-form'
import { useForm } from 'react-hook-form'
import { MembershipPayload, membershipSchema } from '@/validations/membership'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateMembership } from '@/hooks/instructor/use-membership'
import { useState } from 'react'
import { DialogMembershipPolicy } from '@/app/(action)/instructor/memberships/_components/diglog-membership-policy'

export const CreateMembershipSheet = () => {
  const [open, setOpen] = useState(false)
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false)

  const { mutate, isPending } = useCreateMembership()

  const form = useForm<Omit<MembershipPayload, 'code'>>({
    resolver: zodResolver(membershipSchema.omit({ code: true })),
    defaultValues: {
      name: '',
      description: '',
      duration_months: 3,
      price: 0,
      course_ids: [],
      benefits: Array(4).fill({ value: '' }),
    },
    disabled: isPending,
  })

  function onSubmit(payload: Omit<MembershipPayload, 'code'>) {
    mutate(payload, {
      onSuccess: () => {
        form.reset()
        setOpen(false)
      },
    })
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="sm">
            <Plus />
            Tạo gói
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Tạo gói thành viên</SheetTitle>
            <SheetDescription>
              Gói thành viên cho phép học viên truy cập khóa học với các quyền
              lợi khác nhau, bao gồm thời gian sử dụng, số lượng khóa học, hỗ
              trợ giảng viên và tài liệu độc quyền.{' '}
              <span
                onClick={() => setPolicyDialogOpen(true)}
                className="cursor-pointer text-blue-600 underline transition-colors hover:text-blue-800"
              >
                Xem chính sách
              </span>
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <MembershipForm form={form} onSubmit={onSubmit}>
              <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Hủy
                  </Button>
                </SheetClose>
                <Button disabled={isPending} type="submit">
                  {isPending && <Loader2 className="animate-spin" />}
                  Tạo
                </Button>
              </SheetFooter>
            </MembershipForm>
          </div>
        </SheetContent>
      </Sheet>

      {policyDialogOpen && (
        <DialogMembershipPolicy
          open={policyDialogOpen}
          onOpenChange={setPolicyDialogOpen}
        />
      )}
    </>
  )
}
