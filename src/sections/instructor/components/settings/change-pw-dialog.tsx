import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/ui/password-input'
import { useChangePassword } from '@/hooks/change-password/useChangePassword'
import {
  ChangePasswordPayload,
  changePasswordSchema,
} from '@/validations/change-password'

export function ChangePwDialog() {
  const { mutate, isPending } = useChangePassword()

  const form = useForm<ChangePasswordPayload>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: '',
    },
  })

  function onSubmit(data: ChangePasswordPayload) {
    mutate(data, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <ShieldCheck /> Đổi mật khẩu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <DialogTitle>Bảo mật tài khoản</DialogTitle>
          </div>
          <DialogDescription>
            Cập nhật mật khẩu mới để tăng cường bảo mật cho tài khoản của bạn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 border-t pt-3"
          >
            <div className="grid gap-x-2 gap-y-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="old_password"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Nhập lại
              </Button>
              <Button
                type="submit"
                className="group relative gap-2 overflow-hidden py-2.5"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ShieldCheck />
                )}
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>

        <div className="border-t pt-3 text-sm text-muted-foreground">
          Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </DialogContent>
    </Dialog>
  )
}
