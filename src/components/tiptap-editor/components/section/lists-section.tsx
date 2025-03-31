import type { toggleVariants } from '@/components/ui/toggle'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { ChevronDown, List, ListOrdered } from 'lucide-react'
import * as React from 'react'
import type { FormatAction } from '../../types'
import { ToolbarSection } from '../toolbar-section'

type ListItemAction = 'orderedList' | 'bulletList'
interface ListItem extends FormatAction {
  value: ListItemAction
}

const formatActions: ListItem[] = [
  {
    value: 'orderedList',
    label: 'Số thứ tự',
    icon: <ListOrdered />,
    isActive: (editor) => editor.isActive('orderedList'),
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleOrderedList().run(),
    shortcuts: ['mod', 'shift', '7'],
  },
  {
    value: 'bulletList',
    label: 'Dấu đầu dòng',
    icon: <List />,
    isActive: (editor) => editor.isActive('bulletList'),
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleBulletList().run(),
    shortcuts: ['mod', 'shift', '8'],
  },
]

interface ListsSectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  activeActions?: ListItemAction[]
  mainActionCount?: number
}

export const ListsSection: React.FC<ListsSectionProps> = ({
  editor,
  activeActions = formatActions.map((action) => action.value),
  mainActionCount = 0,
  size,
  variant,
}) => {
  return (
    <ToolbarSection
      editor={editor}
      actions={formatActions}
      activeActions={activeActions}
      mainActionCount={mainActionCount}
      dropdownIcon={
        <>
          <List />
          <ChevronDown className="size-4" />
        </>
      }
      dropdownTooltip="Danh sách"
      size={size}
      variant={variant}
    />
  )
}

ListsSection.displayName = 'ListsSection'
