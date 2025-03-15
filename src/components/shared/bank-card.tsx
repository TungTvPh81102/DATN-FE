'use client'

import {
  Check,
  CheckCircle,
  Copy,
  MoreVertical,
  SquarePen,
  Trash2,
} from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useClipboard } from '@/hooks/use-clipboard'
import { BankInfo } from '@/validations/bank'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'

interface BankCardProps {
  bank: BankInfo
  setSelectedBank?: (bank: BankInfo) => void
  onSetDefault?: () => void
  onDelete?: () => void
  className?: string
}

export function BankCard({
  bank,
  setSelectedBank,
  onSetDefault,
  onDelete,
  className,
}: BankCardProps) {
  const clipboard = useClipboard({ timeout: 500 })
  const maskedAccountNo = `**** ${bank.account_no.slice(-4)}`

  return (
    <Card
      className={cn(
        'relative w-full max-w-md overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 transition-transform',
        className
      )}
    >
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-15">
        <div className="relative size-64">
          <Image
            src={bank.logo}
            alt={bank.short_name}
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute right-2 top-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full data-[state=open]:bg-gray-200"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="*:cursor-pointer">
            <DropdownMenuItem onClick={onSetDefault} disabled={bank.is_default}>
              <CheckCircle />
              Đặt làm mặc định
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setSelectedBank?.(bank)
              }}
            >
              <SquarePen />
              Cập nhật
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive hover:!bg-destructive/10 hover:!text-destructive"
            >
              <Trash2 />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="relative z-10 p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="relative size-10 overflow-hidden rounded-full">
            <Image
              src={bank.logo_rounded}
              alt={`${bank.short_name} logo`}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-gray-800">
              {bank.short_name}
            </span>
            {bank.is_default && (
              <Badge
                variant="outline"
                className="h-5 border-green-200 bg-green-50 py-0 text-xs text-green-600 hover:bg-green-100"
              >
                Mặc định
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Số tài khoản/thẻ</p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-medium">{maskedAccountNo}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              clipboard.copy(bank.account_no)
            }}
            className="size-8"
            title="Sao chép số tài khoản"
          >
            <AnimatePresence mode="wait">
              {clipboard.copied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Copy />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface BankCardSkeletonProps {
  className?: string
}

export function BankCardSkeleton({ className }: BankCardSkeletonProps) {
  return (
    <Card
      className={cn(
        'w-full max-w-md overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100',
        className
      )}
    >
      {/* Dropdown button skeleton */}
      <Skeleton className="absolute right-2 top-2 size-9 rounded-full" />

      <CardContent className="z-10 p-6">
        <div className="mb-8 flex items-center gap-3">
          {/* Bank logo skeleton */}
          <Skeleton className="size-10 rounded-full" />

          <div className="flex items-center gap-2">
            {/* Bank name skeleton */}
            <Skeleton className="h-7 w-32" />
          </div>
        </div>

        {/* Label skeleton */}
        <Skeleton className="mb-2 h-4 w-28" />

        <div className="flex items-center gap-2">
          {/* Account number skeleton */}
          <Skeleton className="h-7 w-24" />

          {/* Copy button skeleton */}
          <Skeleton className="size-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}
