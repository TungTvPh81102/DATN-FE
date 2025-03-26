import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  useGetMembership,
  useUpdateMembership,
} from '@/hooks/instructor/use-membership'
import { MembershipPayload, membershipSchema } from '@/validations/membership'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { MembershipForm } from './membership-form'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'

interface Props extends React.ComponentPropsWithRef<typeof Sheet> {
  code: string | null
}

export const UpdateMembershipSheet = ({ code, ...props }: Props) => {
  const { data, isLoading } = useGetMembership(code)

  const courseIds = useMemo(
    () => data?.membership_course_access.map((item) => item.id),
    [data]
  )
  const { mutate, isPending } = useUpdateMembership()

  const form = useForm<MembershipPayload>({
    resolver: zodResolver(membershipSchema),
    disabled: isPending,
  })

  function onSubmit(payload: MembershipPayload) {
    if (!code) return

    mutate(payload, {
      onSuccess: () => {
        form.reset()
        props.onOpenChange?.(false)
      },
    })
  }

  useEffect(() => {
    if (data) {
      form.reset({
        code: data.code,
        name: data.name,
        price: +data.price,
        description: data.description,
        duration_months: data.duration_months,
        course_ids: courseIds,
        benefits: data.benefits.map((item) => ({
          value: item,
        })),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Sheet {...props}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Cập nhật gói thành viên</SheetTitle>
          <SheetDescription>
            Gói thành viên cho phép học viên truy cập khóa học với các quyền lợi
            khác nhau, bao gồm thời gian sử dụng, số lượng khóa học, hỗ trợ
            giảng viên và tài liệu độc quyền.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {!isLoading ? (
            <MembershipForm
              form={form}
              onSubmit={onSubmit}
              courseIds={courseIds}
            >
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
                  Cập nhật
                </Button>
              </SheetFooter>
            </MembershipForm>
          ) : (
            <FormSkeleton />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

const FormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-9" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-14" />
      </div>
      <div className="grid gap-x-3 gap-y-4 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-9" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-9" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-44" />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid grid-cols-[1fr,auto,auto] items-start gap-2">
            <Skeleton className="h-9" />
            <Skeleton className="size-9" />
            <Skeleton className="size-9" />
          </div>
          <div className="grid grid-cols-[1fr,auto,auto] items-start gap-2">
            <Skeleton className="h-9" />
            <Skeleton className="size-9" />
            <Skeleton className="size-9" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <DataTableSkeleton
          columnCount={7}
          filterableColumnCount={2}
          cellWidths={[
            '2.5rem',
            '15rem',
            '6rem',
            '6rem',
            '6rem',
            '6rem',
            '2.5rem',
          ]}
          shrinkZero
        />
      </div>
    </div>
  )
}
