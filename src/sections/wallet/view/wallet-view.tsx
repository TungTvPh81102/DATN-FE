'use client'

import React, { useState, useEffect } from 'react'
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
  CreditCard,
  Plus,
  ChevronRight,
  Check,
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
import Container from '@/components/shared/container'
import { useGetBanks } from '@/hooks/user/use-bank'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

const AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000]

interface Bank {
  id: string
  name: string
  bin: string
  short_name: string
  logo: string
  logo_rounded: string
  account_no: string
  account_name: string
  is_default: boolean
  acq_id?: string
}

function WalletView() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [selectedBank, setSelectedBank] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [useExistingBank, setUseExistingBank] = useState(true)

  const { data: bankData, isLoading: isLoadingBankData } = useGetBanks()
  const { data: walletData, isLoading } = useGetWallet()
  const { data: supportBank, isLoading: isLoadingSupportBank } =
    useGetSupportBanks()
  const { mutate: withDrawalRequest, isPending } = useWithDrawalRequest()
  const walletBalance = walletData?.data?.balance || 0

  const userBanks = Array.isArray(bankData) ? bankData : []

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

  useEffect(() => {
    if (userBanks.length > 0 && !selectedBank) {
      const defaultBank =
        userBanks.find((bank) => bank.is_default) || userBanks[0]
      setSelectedBank(defaultBank)

      if (useExistingBank) {
        populateBankDetails(defaultBank)
      }
    }
  }, [selectedBank, useExistingBank, userBanks])

  const populateBankDetails = (bank: Bank) => {
    if (bank && bank.acq_id) {
      setValue('bank', bank.acq_id)
      setValue('acq_id', bank.acq_id)
      setValue('bank_name', bank.short_name)
      setValue('account_no', bank.account_no)
      setValue('account_name', bank.account_name)
    }
  }

  const clearBankDetails = () => {
    setValue('bank', '')
    setValue('acq_id', '')
    setValue('bank_name', '')
    setValue('account_no', '')
    setValue('account_name', '')
  }

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank)
    setIsDialogOpen(false)
    setUseExistingBank(true)
    populateBankDetails(bank)
  }

  const toggleUseExistingBank = (value: boolean) => {
    setUseExistingBank(value)

    if (!value) {
      clearBankDetails()
    } else if (selectedBank) {
      populateBankDetails(selectedBank)
    }
  }

  if (isLoading || isLoadingSupportBank || isLoadingBankData)
    return <ModalLoading />

  const onSubmit = (data: WithDrawalRequestPayload) => {
    withDrawalRequest(data, {
      onSuccess: async (res: any) => {
        toast.success(res.message)
        reset()

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.INSTRUCTOR_WITH_DRAW_REQUEST],
          }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.INSTRUCTOR_WALLET],
          }),
        ])

        setSelectedAmount(null)
        router.push(`/instructor/with-draw-request`)
      },
      onError: async (error: any) => {
        toast.error(error.message)

        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.INSTRUCTOR_WALLET],
        })
      },
    })
  }

  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Ví tiền của bạn</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
              <div className="inline-flex max-w-full items-center gap-4 overflow-hidden lg:flex-col xl:flex-row">
                <Avatar className="size-16 border-4 border-white/20">
                  <AvatarImage
                    src={
                      user?.avatar ||
                      'https://storage.googleapis.com/a1aa/image/DCqdFGzcb1rqIdoeHHdr3Zjfo9rbmejO9ixlponF0VG2CmePB.jpg'
                    }
                  />
                  <AvatarFallback>TN</AvatarFallback>
                </Avatar>
                <div className="max-w-full flex-1 text-white">
                  <h3 className="text-xl font-semibold">
                    {user?.name || 'Nguyễn Văn A'}
                  </h3>
                  <p className="truncate text-white/80">
                    ID: {user?.code || ''}
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Số dư khả dụng</span>
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
                Số tiền tối thiểu cho mỗi lần rút là 50,000 VNĐ. Số dư trong tài
                khoản phải lớn hơn số tiền bạn muốn rút.
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

              {/* Bank account selection section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Tài khoản ngân hàng</Label>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={useExistingBank ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleUseExistingBank(true)}
                      className={cn(
                        'h-8 text-xs',
                        useExistingBank ? 'bg-primary' : ''
                      )}
                      disabled={userBanks.length === 0}
                    >
                      Tài khoản đã lưu
                    </Button>
                    <Button
                      type="button"
                      variant={!useExistingBank ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleUseExistingBank(false)}
                      className={cn(
                        'h-8 text-xs',
                        !useExistingBank ? 'bg-primary' : ''
                      )}
                    >
                      Tài khoản mới
                    </Button>
                  </div>
                </div>

                {useExistingBank ? (
                  <div className="space-y-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          disabled={userBanks.length === 0}
                        >
                          {selectedBank ? (
                            <div className="flex items-center gap-3">
                              {selectedBank.logo_rounded && (
                                <img
                                  src={selectedBank.logo_rounded}
                                  alt={selectedBank.short_name}
                                  className="size-6 object-contain"
                                />
                              )}
                              <span>
                                {selectedBank.short_name} -{' '}
                                {selectedBank.account_no}
                              </span>
                            </div>
                          ) : (
                            <span>Chọn tài khoản ngân hàng</span>
                          )}
                          <ChevronRight className="size-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Chọn tài khoản ngân hàng</DialogTitle>
                          <DialogDescription>
                            Chọn tài khoản ngân hàng bạn muốn rút tiền về
                          </DialogDescription>
                        </DialogHeader>

                        <ScrollArea className="max-h-[400px] pr-4">
                          <div className="space-y-3 py-2">
                            {userBanks.map((bank) => (
                              <div
                                key={bank.id}
                                className={cn(
                                  'flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-all',
                                  selectedBank?.id === bank.id
                                    ? 'border-primary bg-primary/5'
                                    : 'hover:border-primary/50'
                                )}
                                onClick={() => handleBankSelect(bank)}
                              >
                                <div className="flex flex-1 items-center space-x-3">
                                  {bank.logo_rounded && (
                                    <img
                                      src={bank.logo_rounded}
                                      alt={bank.short_name}
                                      className="size-10 object-contain"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {bank.short_name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {bank.account_no}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {bank.account_name}
                                    </p>
                                    {bank.is_default && (
                                      <span className="inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                        Mặc định
                                      </span>
                                    )}
                                  </div>
                                  {selectedBank?.id === bank.id && (
                                    <Check className="size-5 text-primary" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>

                        <div className="flex justify-end">
                          <DialogClose asChild>
                            <Button variant="outline">Đóng</Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {selectedBank && (
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {selectedBank.logo_rounded && (
                              <img
                                src={selectedBank.logo_rounded}
                                alt={selectedBank.short_name}
                                className="size-12 object-contain"
                              />
                            )}
                            <div>
                              <h4 className="font-medium">
                                {selectedBank.short_name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedBank.account_no}
                              </p>
                              <p className="text-sm font-medium">
                                {selectedBank.account_name}
                              </p>
                            </div>
                          </div>

                          {selectedBank.is_default && (
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                              Tài khoản mặc định
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {userBanks.length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <CreditCard className="size-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">
                          Chưa có tài khoản ngân hàng
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Bạn chưa có tài khoản ngân hàng nào được lưu. Vui lòng
                          thêm tài khoản mới.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() =>
                            router.push('/instructor/settings/profile')
                          }
                        >
                          <Plus className="mr-2 size-4" />
                          Thêm tài khoản mới
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
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
                  </div>
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
                {errors.add_info && (
                  <p className="text-sm text-red-500">
                    {errors.add_info.message}
                  </p>
                )}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/80"
                size="lg"
                type="submit"
                disabled={isPending || walletData?.data.balance === 0}
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
    </Container>
  )
}

export default WalletView
