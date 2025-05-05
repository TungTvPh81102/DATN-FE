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
import { ScrollArea } from '../ui/scroll-area'

import './styles/index.css'

export interface TiptapProps
  extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
  scrollAreaClassName?: string
  disabled?: boolean
  toolbar?: 'default' | 'full'
}

export const TiptapEditor = React.forwardRef<HTMLDivElement, TiptapProps>(
  (
    {
      value,
      onChange,
      className,
      editorContentClassName,
      scrollAreaClassName,
      disabled = false,
      editable = true,
      toolbar = 'default',
      placeholder = 'Nhập nội dung',
      ...props
    },
    ref
  ) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      editable: editable && !disabled,
      placeholder,
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

    React.useEffect(() => {
      editor?.setOptions({ editable: editable && !disabled })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled, editable])

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
            'flex h-auto w-full flex-col overflow-y-auto rounded-md border border-input shadow-sm',
            className
          )}
        >
          {ToolbarComp && <ToolbarComp editor={editor} />}
          <ScrollArea
            className={cn(
              'min-h-24 px-3 py-2',
              {
                'h-48': toolbar === 'default',
                'h-[600px]': toolbar === 'full',
              },
              scrollAreaClassName
            )}
          >
            <EditorContent
              editor={editor}
              className={cn('minimal-tiptap-editor', editorContentClassName)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'b') e.stopPropagation()
              }}
            />
          </ScrollArea>
          <LinkBubbleMenu editor={editor} />
        </MeasuredContainer>
      </TooltipProvider>
    )
  }
)

TiptapEditor.displayName = 'TiptapEditor'
