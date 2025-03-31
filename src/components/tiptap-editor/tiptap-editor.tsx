import type { Content } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { TooltipProvider } from '../ui/tooltip'
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu'
import { MeasuredContainer } from './components/measured-container'
import { DefaultToolbar } from './components/toolbar/default-toolbar'
import { FullToolbar } from './components/toolbar/full-toolbar'
import type { UseMinimalTiptapEditorProps } from './hooks/use-minimal-tiptap'
import { useMinimalTiptapEditor } from './hooks/use-minimal-tiptap'

import './styles/index.css'

export interface TiptapProps
  extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
  disabled?: boolean
  toolbar?: 'default' | 'full'
  onEmptyStatusChange?: (empty: boolean) => void
}

export const TiptapEditor = React.forwardRef<HTMLDivElement, TiptapProps>(
  (
    {
      value,
      onChange,
      className,
      editorContentClassName,
      disabled = false,
      editable = true,
      toolbar = 'default',
      onEmptyStatusChange,
      ...props
    },
    ref
  ) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      editable: editable && !disabled,
      ...props,
    })

    const ToolbarComp = React.useMemo(() => {
      if (!editor) {
        return null
      }
      switch (toolbar) {
        case 'full':
          return FullToolbar
        case 'default':
        default:
          return DefaultToolbar
      }
    }, [toolbar, editor])

    const isEmpty = !editor?.state.doc.textContent.trim().length

    React.useEffect(() => {
      onEmptyStatusChange?.(isEmpty)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEmpty])

    if (!editor) {
      return null
    }

    return (
      <TooltipProvider>
        <MeasuredContainer
          as="div"
          name="editor"
          ref={ref}
          className={cn(
            'flex h-auto min-h-44 w-full flex-col rounded-md border border-input shadow-sm',
            className
          )}
        >
          {ToolbarComp && <ToolbarComp editor={editor} />}
          <EditorContent
            editor={editor}
            className={cn('minimal-tiptap-editor p-5', editorContentClassName)}
          />
          <LinkBubbleMenu editor={editor} />
        </MeasuredContainer>
      </TooltipProvider>
    )
  }
)

TiptapEditor.displayName = 'TiptapEditor'
