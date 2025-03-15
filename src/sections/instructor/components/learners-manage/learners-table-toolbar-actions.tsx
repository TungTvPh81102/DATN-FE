'use client'

import type { Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportTableToXLSX } from '@/lib/export'
import { Learner } from '@/types/learner'

interface LearnersTableToolbarActionsProps {
  table: Table<Learner>
}

export function LearnersTableToolbarActions({
  table,
}: LearnersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToXLSX(table, {
            filename: 'learners',
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
