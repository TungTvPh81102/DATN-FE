'use client'

import { LoadingButton } from '@/components/ui/loading-button'
import { useRestoreCourses } from '@/hooks/instructor/course/useCourse'
import { ITrashCourse } from '@/types'
import type { Table } from '@tanstack/react-table'
import { RefreshCcw } from 'lucide-react'

interface TrashCoursesTableToolbarActionsProps {
  table: Table<ITrashCourse>
}

export function TrashCoursesTableToolbarActions({
  table,
}: TrashCoursesTableToolbarActionsProps) {
  const { mutate: restore, isPending: isRestoring } = useRestoreCourses()

  const ids = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id)

  const onRestore = () => {
    restore(ids, {
      onSuccess: () => {
        table.toggleAllRowsSelected(false)
      },
    })
  }

  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <LoadingButton
          loading={isRestoring}
          variant="outline"
          size="sm"
          onClick={onRestore}
        >
          <RefreshCcw aria-hidden="true" />
          Khôi phục ({ids.length})
        </LoadingButton>
      ) : null}
    </div>
  )
}
