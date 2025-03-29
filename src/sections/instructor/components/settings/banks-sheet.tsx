'use client'

import { CreditCard } from 'lucide-react'
import { useState } from 'react'

import { BankCard, BankCardSkeleton } from '@/components/shared/bank-card'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  useDeleteBank,
  useGetBanks,
  useSetDefaultBank,
} from '@/hooks/user/use-bank'
import { BankInfo } from '@/validations/bank'
import UpsertBankSheet from './upsert-bank-sheet'

interface Props extends React.ComponentPropsWithoutRef<typeof Sheet> {
  showTrigger?: boolean
}

const BanksSheet = ({ showTrigger = true, ...props }: Props) => {
  const [openSheet, setOpenSheet] = useState(false)
  const [selectedBank, setSelectedBank] = useState<BankInfo>()
  const { data, isLoading } = useGetBanks()
  const { mutate: setDefault, isPending: isSetDefaultPending } =
    useSetDefaultBank()
  const { mutate: deleteBank, isPending: isDeletePending } = useDeleteBank()

  return (
    <>
      <Sheet {...props}>
        {showTrigger && (
          <SheetTrigger asChild>
            <Button variant={'outline'}>
              <CreditCard />
              Ngân hàng
            </Button>
          </SheetTrigger>
        )}
        <SheetContent className="max-w-lg">
          <SheetHeader>
            <SheetTitle>Tài khoản ngân hàng</SheetTitle>
            <SheetDescription>
              Quản lý tài khoản ngân hàng của bạn
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 flex flex-col items-center justify-center gap-y-4">
            {!isLoading ? (
              data
                ?.sort(
                  (a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)
                )
                .map((bank) => (
                  <BankCard
                    key={bank.id}
                    bank={bank}
                    setSelectedBank={setSelectedBank}
                    onSetDefault={
                      !isSetDefaultPending
                        ? () => setDefault(bank.id)
                        : undefined
                    }
                    onDelete={
                      !isDeletePending ? () => deleteBank(bank.id) : undefined
                    }
                  />
                ))
            ) : (
              <BankCardSkeleton />
            )}
          </div>
          <div
            className={`mt-4 text-center ${data && data.length >= 3 ? 'hidden' : ''}`}
          >
            <Button
              disabled={data && data.length >= 3}
              onClick={() => setOpenSheet(true)}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
            >
              Thêm tài khoản
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <UpsertBankSheet
        open={openSheet || !!selectedBank}
        onOpenChange={(open) => {
          if (!open) setSelectedBank(undefined)
          setOpenSheet(open)
        }}
        showTrigger={false}
        bank={selectedBank}
      />
    </>
  )
}

export default BanksSheet
