'use client'

import type { Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { exportTableToXLSX } from '@/lib/export'
import { Membership } from '@/types/membership'
import { CreateMembershipSheet } from './create-membership-sheet'

interface MembershipsTableToolbarActionsProps {
  table: Table<Membership>
}

export function MembershipsTableToolbarActions({
  table,
}: MembershipsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <CreateMembershipSheet />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToXLSX(table, {
            filename: 'memberships',
            excludeColumns: ['select', 'actions'],
          })
        }
        className="gap-2"
      >
        <Download className="size-4" aria-hidden="true" />
        Xuất file
      </Button>
    </div>
  )
}
