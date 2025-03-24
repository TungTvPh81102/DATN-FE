'use client'

import type { Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportTableToXLSX } from '@/lib/export'
import { ICourse } from '@/types'
import { DeleteCoursesDialog } from './delete-courses-dialog'
import CreateCourseDialog from './create-course-dialog'

interface CoursesTableToolbarActionsProps {
  table: Table<ICourse>
  isPracticalCourse?: boolean
}

export function CoursesTableToolbarActions({
  table,
  isPracticalCourse,
}: CoursesTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteCoursesDialog
          courses={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}

      <CreateCourseDialog isPracticalCourse={isPracticalCourse} />

      {!isPracticalCourse && (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            exportTableToXLSX(table, {
              filename: 'courses',
              excludeColumns: ['select', 'actions'],
            })
          }
          className="gap-2"
        >
          <Download className="size-4" aria-hidden="true" />
          Xuất file
        </Button>
      )}
    </div>
  )
}
