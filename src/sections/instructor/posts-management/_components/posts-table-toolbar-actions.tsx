'use client'

import type { Table } from '@tanstack/react-table'
import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportTableToXLSX } from '@/lib/export'
import { IPost } from '@/types'
import Link from 'next/link'

interface PostsTableToolbarActionsProps {
  table: Table<IPost>
}

export function PostsTableToolbarActions({
  table,
}: PostsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" asChild>
        <Link href={'/instructor/posts/create'}>
          <Plus />
          Viết blog
        </Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToXLSX(table, {
            filename: 'posts',
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
