'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CouponsTableToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" asChild>
        <Link href="/instructor/coupon/create">Tạo mã</Link>
      </Button>
    </div>
  )
}
