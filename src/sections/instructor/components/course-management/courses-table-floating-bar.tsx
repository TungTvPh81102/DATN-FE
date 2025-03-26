import type { Table } from '@tanstack/react-table'
import { Download, Trash2, X } from 'lucide-react'
import * as React from 'react'

import { exportTableToXLSX } from '@/lib/export'
import { ICourse } from '@/types'

import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Portal } from '@/components/ui/portal'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DeleteCoursesDialog } from './delete-courses-dialog'

interface CoursesTableFloatingBarProps {
  table: Table<ICourse>
}

export function CoursesTableFloatingBar({
  table,
}: CoursesTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        table.toggleAllRowsSelected(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [table])

  return (
    <>
      <Portal>
        <div className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit px-2.5">
          <div className="w-full overflow-x-auto">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-background p-2 text-foreground shadow">
              <div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
                <span className="whitespace-nowrap text-xs">
                  {rows.length} được chọn
                </span>
                <Separator orientation="vertical" className="ml-2 mr-1" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-5 hover:border"
                      onClick={() => table.toggleAllRowsSelected(false)}
                    >
                      <X className="!size-3.5 shrink-0" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
                    <p className="mr-2">Bỏ chọn</p>
                    <Kbd abbrTitle="Escape" variant="outline">
                      Esc
                    </Kbd>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Separator
                orientation="vertical"
                className="hidden h-5 sm:block"
              />
              <div className="flex items-center gap-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-7 border"
                      onClick={() =>
                        exportTableToXLSX(table, {
                          filename: 'courses',
                          excludeColumns: ['select', 'actions'],
                          onlySelected: true,
                        })
                      }
                    >
                      <Download className="!size-3.5" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                    <p>Xuất</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-7 border"
                      onClick={() => setOpenDeleteDialog(true)}
                    >
                      <Trash2 className="!size-3.5" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                    <p>Xóa</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </Portal>

      <DeleteCoursesDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        courses={table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original)}
        showTrigger={false}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
    </>
  )
}
