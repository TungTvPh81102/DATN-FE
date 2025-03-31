import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import type { Level } from '@tiptap/extension-heading'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { CaseSensitive, ChevronDown } from 'lucide-react'
import * as React from 'react'
import type { FormatAction } from '../../types'
import { ShortcutKey } from '../shortcut-key'
import { ToolbarButton } from '../toolbar-button'

interface TextStyle
  extends Omit<
    FormatAction,
    'value' | 'icon' | 'action' | 'isActive' | 'canExecute'
  > {
  element: keyof React.JSX.IntrinsicElements
  level?: Level
  className: string
}

const formatActions: TextStyle[] = [
  {
    label: 'Văn bản',
    element: 'span',
    className: 'grow',
    shortcuts: ['mod', 'alt', '0'],
  },
  {
    label: 'Tiêu đề 1',
    element: 'h1',
    level: 1,
    className: 'm-0 grow text-3xl font-extrabold',
    shortcuts: ['mod', 'alt', '1'],
  },
  {
    label: 'Tiêu đề 2',
    element: 'h2',
    level: 2,
    className: 'm-0 grow text-xl font-bold',
    shortcuts: ['mod', 'alt', '2'],
  },
  {
    label: 'Tiêu đề 3',
    element: 'h3',
    level: 3,
    className: 'm-0 grow text-lg font-semibold',
    shortcuts: ['mod', 'alt', '3'],
  },
  {
    label: 'Tiêu đề 4',
    element: 'h4',
    level: 4,
    className: 'm-0 grow text-base font-semibold',
    shortcuts: ['mod', 'alt', '4'],
  },
  {
    label: 'Tiêu đề 5',
    element: 'h5',
    level: 5,
    className: 'm-0 grow text-sm font-normal',
    shortcuts: ['mod', 'alt', '5'],
  },
  {
    label: 'Tiêu đề 6',
    element: 'h6',
    level: 6,
    className: 'm-0 grow text-sm font-normal',
    shortcuts: ['mod', 'alt', '6'],
  },
]

interface TextStylesSectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  activeLevels?: Level[]
}

export const TextStylesSection: React.FC<TextStylesSectionProps> = React.memo(
  ({ editor, activeLevels = [1, 2, 3, 4, 5, 6], size, variant }) => {
    const filteredActions = React.useMemo(
      () =>
        formatActions.filter(
          (action) => !action.level || activeLevels.includes(action.level)
        ),
      [activeLevels]
    )

    const handleStyleChange = React.useCallback(
      (level?: Level) => {
        if (level) {
          editor.chain().focus().toggleHeading({ level }).run()
        } else {
          editor.chain().focus().setParagraph().run()
        }
      },
      [editor]
    )

    const renderMenuItem = React.useCallback(
      ({ label, element: Element, level, className, shortcuts }: TextStyle) => (
        <DropdownMenuItem
          key={label}
          onClick={() => handleStyleChange(level)}
          className={cn('flex flex-row items-center justify-between gap-4', {
            'bg-accent': level
              ? editor.isActive('heading', { level })
              : editor.isActive('paragraph'),
          })}
          aria-label={label}
        >
          {/* @ts-expect-error: Element type is dynamically determined */}
          <Element className={className}>{label}</Element>
          <ShortcutKey keys={shortcuts} />
        </DropdownMenuItem>
      ),
      [editor, handleStyleChange]
    )

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton
            isActive={editor.isActive('heading')}
            tooltip="Kiểu văn bản"
            aria-label="Kiểu văn bản"
            pressed={editor.isActive('heading')}
            className="w-12"
            disabled={editor.isActive('codeBlock') || !editor.isEditable}
            size={size}
            variant={variant}
          >
            <CaseSensitive className="!size-7" strokeWidth={1} />
            <ChevronDown />
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full">
          {filteredActions.map(renderMenuItem)}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

TextStylesSection.displayName = 'TextStylesSection'
