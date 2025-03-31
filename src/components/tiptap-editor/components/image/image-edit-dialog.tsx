import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { toggleVariants } from '@/components/ui/toggle'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { ToolbarButton } from '../toolbar-button'
import { ImageEditBlock } from './image-edit-block'

interface ImageEditDialogProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

const ImageEditDialog = ({ editor, size, variant }: ImageEditDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ToolbarButton
          isActive={editor.isActive('image')}
          tooltip="Hình ảnh"
          aria-label="Hình ảnh"
          size={size}
          variant={variant}
          disabled={!editor.isEditable}
        >
          <ImageIcon />
        </ToolbarButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chọn hình ảnh</DialogTitle>
          <DialogDescription className="sr-only">
            Tải lên một hình ảnh từ máy tính của bạn
          </DialogDescription>
        </DialogHeader>
        <ImageEditBlock editor={editor} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export { ImageEditDialog }
