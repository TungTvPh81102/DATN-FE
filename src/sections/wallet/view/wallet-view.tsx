'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import {
  AlertCircle,
  ArrowDownToLine,
  Banknote,
  Clock,
  Info,
  Loader2,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import {
  WithDrawalRequestPayload,
  WithdrawalRequestSchema,
} from '@/validations/support-bank'
import QUERY_KEY from '@/constants/query-key'
import { formatCurrency, removeVietnameseTones } from '@/lib/common'
import { cn } from '@/lib/utils'
import { useGetSupportBanks } from '@/hooks/support-bank/useSupportBank'
import { useGetWallet, useWithDrawalRequest } from '@/hooks/wallet/useWallet'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import ModalLoading from '@/components/common/ModalLoading'

const AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000]

function WalletView() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const { user } = useAuthStore()
  const { data: walletData, isLoading } = useGetWallet()
  const { data: supportBank, isLoading: isLoadingSupportBank } =
    useGetSupportBanks()
  const { mutate: withDrawalRequest, isPending } = useWithDrawalRequest()
  const walletBalance = walletData?.data?.balance || 0

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<WithDrawalRequestPayload>({
    resolver: zodResolver(WithdrawalRequestSchema(walletBalance)),
    defaultValues: {
      account_no: '',
      account_name: '',
      bank: '',
      amount: undefined,
      add_info: '',
    },
  })

  const watchedAmount = watch('amount')

  if (isLoading || isLoadingSupportBank) return <ModalLoading />

  const onSubmit = (data: WithDrawalRequestPayload) => {
    withDrawalRequest(data, {
      onSuccess: async (res: any) => {
        toast.success(res.message)
        reset()
        setSelectedAmount(null)
        router.push(`/instructor/with-draw-request`)
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.INSTRUCTOR_WITH_DRAW_REQUEST],
        })
      },
      onError: async (error: any) => {
        toast.error(error.message)

        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.INSTRUCTOR_WITH_DRAW_REQUEST],
        })
      },
    })
  }

  return (
    <div className="px-5 py-6">
      <div className="">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-2xl font-bold">
            Ví của bạn
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <Card className="overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-[#E27447] to-[#E27447]/80 p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="size-16 border-4 border-white/30 shadow-md">
                      <AvatarImage
                        src={
                          user?.avatar ||
                          'https://storage.googleapis.com/a1aa/image/DCqdFGzcb1rqIdoeHHdr3Zjfo9rbmejO9ixlponF0VG2CmePB.jpg'
                        }
                      />
                      <AvatarFallback>TN</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1 ring-2 ring-white">
                      <div className="size-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold tracking-tight">
                      {user?.name || 'Nguyễn Văn A'}
                    </h3>
                    <p className="font-medium text-white/90">
                      {user?.code || ''}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-white/15 p-4 shadow-inner backdrop-blur-sm">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-white/80">
                      Số dư khả dụng
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(walletData?.data.balance || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-xl text-primary">
                  <ArrowDownToLine className="size-5" />
                  Rút tiền về tài khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-primary/5 p-4">
                      <Clock className="mb-2 size-5 text-primary" />
                      <p className="text-sm font-medium">Thời gian xử lý</p>
                      <p className="text-2xl font-bold text-primary">
                        1 - 5 phút
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-4">
                      <Banknote className="mb-2 size-5 text-primary" />
                      <p className="text-sm font-medium">Phí giao dịch</p>
                      <p className="text-2xl font-bold text-primary">0 VNĐ</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <ShieldCheck className="size-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">An toàn & Bảo mật</h4>
                        <p className="text-sm text-muted-foreground">
                          Mọi giao dịch đều được mã hóa và bảo vệ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Clock className="size-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Xử lý tức thì</h4>
                        <p className="text-sm text-muted-foreground">
                          Tiền về tài khoản trong vài phút
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Wallet className="size-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Không giới hạn</h4>
                        <p className="text-sm text-muted-foreground">
                          Rút tiền không giới hạn số lần/ngày
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="mt-4 w-full bg-gradient-to-r from-primary to-primary/80"
                  >
                    <ArrowDownToLine className="mr-2 size-4" />
                    Rút tiền ngay
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Alert variant="default" className="border-blue-200 bg-blue-50">
                <Info className="size-4 text-blue-500" />
                <AlertDescription className="text-blue-700">
                  Số tiền tối thiểu cho mỗi lần rút là 50,000 VNĐ. Số dư trong
                  tài khoản phải lớn hơn số tiền bạn muốn rút.
                </AlertDescription>
              </Alert>

              <Alert
                variant="destructive"
                className="border-destructive/20 bg-destructive/5"
              >
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Vui lòng kiểm tra kỹ thông tin tài khoản ngân hàng trước khi
                  thực hiện rút tiền. Chúng tôi không chịu trách nhiệm nếu bạn
                  cung cấp sai thông tin.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <Card className="border-none shadow-lg lg:col-span-8">
            <CardHeader className="border-b bg-primary/5">
              <CardTitle>Thông tin rút tiền</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                  <Label>Chọn số tiền muốn rút</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {AMOUNTS.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        className={cn(
                          'flex h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5',
                          selectedAmount === amount &&
                            'border-primary bg-primary/5'
                        )}
                        onClick={() => {
                          setSelectedAmount(amount)
                          setValue('amount', amount)
                        }}
                      >
                        <Wallet className="size-5 text-primary" />
                        <span className="font-medium">
                          {amount.toLocaleString('vi-VN')}
                          <span className="ml-1 text-xs text-muted-foreground">
                            VNĐ
                          </span>
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Hoặc nhập số tiền khác</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      value={
                        watchedAmount !== undefined
                          ? formatCurrency(watchedAmount || 0)
                          : ''
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '')
                        const numericValue = rawValue
                          ? parseInt(rawValue, 10)
                          : undefined
                        setSelectedAmount(null)
                        setValue('amount', numericValue as number)
                      }}
                      placeholder="Nhập số tiền bạn muốn rút"
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      VNĐ
                    </span>
                  </div>
                  {errors.amount && (
                    <p className="text-sm text-red-500">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Chọn ngân hàng</Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedBank = supportBank?.find(
                        (bank: any) => bank.bin === value
                      )
                      if (selectedBank) {
                        setValue('acq_id', selectedBank.bin)
                        setValue('bank_name', selectedBank.short_name)
                      }
                      setValue('bank', value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngân hàng nhận tiền" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportBank?.map((bank: any) => (
                        <SelectItem key={bank.bin} value={bank.bin}>
                          {bank.short_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bank && (
                    <p className="text-sm text-red-500">
                      {errors.bank.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Số tài khoản</Label>
                  <Input
                    {...register('account_no')}
                    id="accountNumber"
                    placeholder="Nhập số tài khoản nhận tiền"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      setValue('account_no', value)
                    }}
                  />
                  {errors.account_no && (
                    <p className="text-sm text-red-500">
                      {errors.account_no.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_name">Tên chủ tài khoản</Label>
                  <Input
                    id="account_name"
                    placeholder="Nhập tên chủ tài khoản nhận tiền"
                    {...register('account_name')}
                    onChange={(e) => {
                      const valueWithNoTones = removeVietnameseTones(
                        e.target.value
                      )
                      const valueUppercase = valueWithNoTones.toUpperCase()
                      setValue('account_name', valueUppercase)
                    }}
                  />
                  {errors.account_name && (
                    <p className="text-sm text-red-500">
                      {errors.account_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add_info">Ghi chú</Label>
                  <Textarea
                    id="add_info"
                    {...register('add_info')}
                    placeholder="Nhập ghi chú"
                    className="resize-none"
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/80"
                  size="lg"
                  type="submit"
                  disabled={isPending || walletData?.data.balance == 0}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" /> Đang xử lý...
                    </>
                  ) : (
                    'Gửi yêu cầu rút tiền'
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default WalletView
