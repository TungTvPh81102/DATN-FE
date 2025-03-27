import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { LoadingButton } from '@/components/ui/loading-button'
import { Textarea } from '@/components/ui/textarea'
import { useRequestModifyContent } from '@/hooks/instructor/course/useCourse'
import {
  RequestModifyContentPayload,
  requestModifyContentSchema,
} from '@/validations/course'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface Props extends React.ComponentPropsWithoutRef<typeof Dialog> {
  slug: string
}

export const RequestModifyDialog = ({ slug, ...props }: Props) => {
  const form = useForm<RequestModifyContentPayload>({
    resolver: zodResolver(requestModifyContentSchema),
    defaultValues: {
      reason: '',
    },
  })

  const { mutate, isPending } = useRequestModifyContent()

  const onSubmit = (values: RequestModifyContentPayload) => {
    const payload = {
      slug,
      ...values,
    }

    mutate(payload)
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogTitle className="mb-2">Yêu cầu sửa đổi nội dung</DialogTitle>
            <DialogDescription>
              Hãy nhập nội dung bạn muốn yêu cầu sửa đổi. Chúng tôi sẽ xem xét
              và phản hồi lại sớm nhất.
            </DialogDescription>
            <div className="mt-4">
              <Label>Lý do </Label>
              <FormField
                name="reason"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Nhập nội dung yêu cầu chỉnh sửa tại đây..."
                        className="h-32 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <DialogClose>
                <Button variant="secondary">Hủy</Button>
              </DialogClose>
              <LoadingButton loading={isPending} type="submit">
                Gửi yêu cầu
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
