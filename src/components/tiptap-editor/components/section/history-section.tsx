import type { toggleVariants } from '@/components/ui/toggle'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { Redo, Undo } from 'lucide-react'
import * as React from 'react'
import type { FormatAction } from '../../types'
import { ToolbarSection } from '../toolbar-section'

type HistoryAction = 'undo' | 'redo'

interface History extends FormatAction {
  value: HistoryAction
}

const historyActions: History[] = [
  {
    value: 'undo',
    label: 'Quay lại',
    icon: <Undo />,
    action: (editor) => editor.chain().focus().undo().run(),
    isActive: () => false,
    canExecute: (editor) => editor.can().undo(),
    shortcuts: ['mod', 'Z'],
  },
  {
    value: 'redo',
    label: 'Làm lại',
    icon: <Redo />,
    action: (editor) => editor.chain().focus().redo().run(),
    isActive: () => false,
    canExecute: (editor) => editor.can().redo(),
    shortcuts: ['mod', 'shift', 'Z'],
  },
]

interface HistorySectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  activeActions?: HistoryAction[]
  mainActionCount?: number
  disabled?: boolean
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  editor,
  activeActions = historyActions.map((action) => action.value),
  mainActionCount = 2,
  size,
  variant,
}) => {
  return (
    <ToolbarSection
      editor={editor}
      actions={historyActions}
      activeActions={activeActions}
      mainActionCount={mainActionCount}
      dropdownClassName="w-8"
      size={size}
      variant={variant}
    />
  )
}
