'use client'

import { BankCard, BankCardSkeleton } from '@/components/shared/bank-card'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { BankInfo } from '@/validations/bank'
import { useEffect, useState } from 'react'

interface BankCarouselProps {
  banks?: BankInfo[]
  onSetDefault?: (id: string) => void
  onDelete?: (id: string) => void
  setSelectedBank?: (bank: BankInfo) => void
}

export function BankCarousel({
  banks = [],
  onSetDefault,
  onDelete,
  setSelectedBank,
}: BankCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const handleSetDefault = (id: string) => {
    onSetDefault?.(id)
  }

  const handleDelete = (id: string) => {
    onDelete?.(id)
  }

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        api.scrollNext()
      } else if (event.key === 'ArrowLeft') {
        api.scrollPrev()
      }
    }

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [api])

  return (
    <Carousel
      setApi={setApi}
      className="mx-auto w-full max-w-lg"
      opts={{
        loop: true,
        align: 'center',
      }}
    >
      <CarouselContent className="ml-0">
        {banks?.map((bank, i) => (
          <CarouselItem
            key={bank.id}
            className={cn('-pl-0 mx-auto basis-[70%]')}
          >
            <BankCard
              bank={bank}
              setSelectedBank={setSelectedBank}
              onSetDefault={() => handleSetDefault(bank.id)}
              onDelete={() => handleDelete(bank.id)}
              className={cn('duration-500', current !== i && 'scale-[.8]')}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {banks.length > 0 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  )
}

interface BankCarouselSkeletonProps {
  count?: number
}

export function BankCarouselSkeleton({ count = 3 }: BankCarouselSkeletonProps) {
  return (
    <Carousel
      className="mx-auto w-full max-w-lg"
      opts={{
        loop: true,
        align: 'center',
        watchDrag: false,
      }}
    >
      <CarouselContent className="ml-0">
        {Array.from({ length: count }).map((_, index) => (
          <CarouselItem key={index} className="-pl-0 basis-[70%]">
            <BankCardSkeleton className={cn(index !== 0 && 'scale-[.8]')} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious disabled />
      <CarouselNext disabled />
    </Carousel>
  )
}
