'use client'

import { CreditCard } from 'lucide-react'

import {
  BankCarousel,
  BankCarouselSkeleton,
} from '@/components/shared/bank-carousel'
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
import { useState } from 'react'
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
        <SheetContent side={'top'} className="pb-8">
          <SheetHeader>
            <SheetTitle>Tài khoản ngân hàng</SheetTitle>
            <SheetDescription>
              Quản lý tài khoản ngân hàng của bạn
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4">
            {!isLoading ? (
              <BankCarousel
                banks={data}
                setSelectedBank={setSelectedBank}
                onSetDefault={!isSetDefaultPending ? setDefault : undefined}
                onDelete={!isDeletePending ? deleteBank : undefined}
              />
            ) : (
              <BankCarouselSkeleton />
            )}
          </div>

          <div className="mt-4 text-center">
            <Button
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
