import type { toggleVariants } from '@/components/ui/toggle'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Text,
} from 'lucide-react'
import * as React from 'react'
import type { FormatAction } from '../../types'
import { ToolbarSection } from '../toolbar-section'

type TextAlignAction = 'left' | 'center' | 'right' | 'justify'
interface TextAlign extends FormatAction {
  value: TextAlignAction
}

const formatActions: TextAlign[] = [
  {
    value: 'left',
    label: 'Căn trái',
    icon: <AlignLeft />,
    isActive: (editor) => editor.isActive({ textAlign: 'left' }),
    action: (editor) => editor.chain().focus().setTextAlign('left').run(),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign('left').run(),
    shortcuts: ['mod', 'shift', 'L'],
  },
  {
    value: 'center',
    label: 'Căn giữa',
    icon: <AlignCenter />,
    isActive: (editor) => editor.isActive({ textAlign: 'center' }),
    action: (editor) => editor.chain().focus().setTextAlign('center').run(),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign('center').run(),
    shortcuts: ['mod', 'shift', 'E'],
  },
  {
    value: 'right',
    label: 'Căn phải',
    icon: <AlignRight />,
    isActive: (editor) => editor.isActive({ textAlign: 'right' }),
    action: (editor) => editor.chain().focus().setTextAlign('right').run(),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign('right').run(),
    shortcuts: ['mod', 'shift', 'R'],
  },
  {
    value: 'justify',
    label: 'Căn đều',
    icon: <AlignJustify />,
    isActive: (editor) => editor.isActive({ textAlign: 'justify' }),
    action: (editor) => editor.chain().focus().setTextAlign('justify').run(),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign('justify').run(),
    shortcuts: ['mod', 'shift', 'J'],
  },
]

interface TextAlignSectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  activeActions?: TextAlignAction[]
  mainActionCount?: number
}

export const TextAlignSection: React.FC<TextAlignSectionProps> = ({
  editor,
  activeActions = formatActions.map((action) => action.value),
  mainActionCount = 3,
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
          <Text />
          <ChevronDown className="size-4" />
        </>
      }
      dropdownTooltip="Căn chỉnh"
      size={size}
      variant={variant}
    />
  )
}
