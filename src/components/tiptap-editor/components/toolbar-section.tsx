import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { FormatAction } from '../types'
import type { VariantProps } from 'class-variance-authority'
import type { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ToolbarButton } from './toolbar-button'
import { ShortcutKey } from './shortcut-key'
import { getShortcutKey } from '../utils'
import { Ellipsis } from 'lucide-react'

interface ToolbarSectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  actions: FormatAction[]
  activeActions?: string[]
  mainActionCount?: number
  dropdownIcon?: React.ReactNode
  dropdownTooltip?: string
  dropdownClassName?: string
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({
  editor,
  actions,
  activeActions = actions.map((action) => action.value),
  mainActionCount = 0,
  dropdownIcon,
  dropdownTooltip = 'Tuỳ chọn',
  dropdownClassName,
  size,
  variant,
}) => {
  const { mainActions, dropdownActions } = React.useMemo(() => {
    const sortedActions = actions
      .filter((action) => activeActions.includes(action.value))
      .sort(
        (a, b) =>
          activeActions.indexOf(a.value) - activeActions.indexOf(b.value)
      )

    return {
      mainActions: sortedActions.slice(0, mainActionCount),
      dropdownActions: sortedActions.slice(mainActionCount),
    }
  }, [actions, activeActions, mainActionCount])

  const renderToolbarButton = React.useCallback(
    (action: FormatAction) => (
      <ToolbarButton
        key={action.label}
        onClick={() => action.action(editor)}
        disabled={!action.canExecute(editor) || !editor.isEditable}
        isActive={action.isActive(editor)}
        tooltip={`${action.label}  ${action.shortcuts.map((s) => getShortcutKey(s).symbol).join(' ')}`}
        aria-label={action.label}
        size={size}
        variant={variant}
      >
        {action.icon}
      </ToolbarButton>
    ),
    [editor, size, variant]
  )

  const renderDropdownMenuItem = React.useCallback(
    (action: FormatAction) => (
      <DropdownMenuItem
        key={action.label}
        onClick={() => action.action(editor)}
        disabled={!action.canExecute(editor)}
        className={cn('flex flex-row items-center justify-between gap-4', {
          'bg-accent': action.isActive(editor),
        })}
        aria-label={action.label}
      >
        <span className="grow">{action.label}</span>
        <ShortcutKey keys={action.shortcuts} />
      </DropdownMenuItem>
    ),
    [editor]
  )

  const isDropdownActive = React.useMemo(
    () => dropdownActions.some((action) => action.isActive(editor)),
    [dropdownActions, editor]
  )

  return (
    <>
      {mainActions.map(renderToolbarButton)}
      {dropdownActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ToolbarButton
              isActive={isDropdownActive}
              tooltip={
                mainActionCount > 0
                  ? `Thêm ${dropdownTooltip.toLowerCase()}`
                  : dropdownTooltip
              }
              aria-label={dropdownTooltip}
              className={cn(
                mainActionCount > 0 ? 'w-8' : 'w-12',
                dropdownClassName
              )}
              size={size}
              variant={variant}
              disabled={!editor.isEditable}
            >
              {dropdownIcon || <Ellipsis />}
            </ToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-full">
            {dropdownActions.map(renderDropdownMenuItem)}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

export default ToolbarSection
