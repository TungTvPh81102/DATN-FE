import { Separator } from '@/components/ui/separator'
import { Copy, Link2Off, SquareArrowOutUpRight } from 'lucide-react'
import * as React from 'react'
import { ToolbarButton } from '../toolbar-button'

interface LinkPopoverBlockProps {
  url: string
  onClear: () => void
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

export const LinkPopoverBlock: React.FC<LinkPopoverBlockProps> = ({
  url,
  onClear,
  onEdit,
  disabled,
}) => {
  const [copyTitle, setCopyTitle] = React.useState<string>('Copy')

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopyTitle('Copied!')
          setTimeout(() => setCopyTitle('Copy'), 1000)
        })
        .catch(console.error)
    },
    [url]
  )

  const handleOpenLink = React.useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [url])

  return (
    <div className="flex h-10 overflow-hidden rounded bg-background p-2 shadow-lg">
      <div className="inline-flex items-center gap-1">
        <ToolbarButton
          tooltip="Sửa liên kết"
          onClick={onEdit}
          className="w-auto px-2"
          disabled={disabled}
        >
          Sửa kiên kết
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton
          tooltip="Mở liên kết trong tab mới"
          onClick={handleOpenLink}
        >
          <SquareArrowOutUpRight className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton
          tooltip="Xóa liên kết"
          onClick={onClear}
          disabled={disabled}
        >
          <Link2Off className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton
          tooltip={copyTitle}
          onClick={handleCopy}
          tooltipOptions={{
            onPointerDownOutside: (e) => {
              if (e.target === e.currentTarget) e.preventDefault()
            },
          }}
        >
          <Copy className="size-4" />
        </ToolbarButton>
      </div>
    </div>
  )
}
