import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { formatBytes } from '@/lib/utils'
import { FileText, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'

interface FileCardProps {
  file: File
  onRemove: () => void
  progress?: number
  disabled?: boolean
}

const FileCard = ({ file, progress, onRemove, disabled }: FileCardProps) => {
  console.log('file', file)
  return (
    <div className="relative flex items-center gap-2.5">
      <div className="flex flex-1 gap-2.5">
        {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
              {file.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={onRemove}
          disabled={disabled}
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Xóa tệp</span>
        </Button>
      </div>
    </div>
  )
}

const isFileWithPreview = (file: File): file is File & { preview: string } => {
  return (
    // file instanceof File &&
    'preview' in file && typeof file.preview === 'string'
  )
}

interface FilePreviewProps {
  file: File & { preview: string }
}

function FilePreview({ file }: FilePreviewProps) {
  if (file.type.startsWith('image/')) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Image
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            loading="lazy"
            className="aspect-square shrink-0 cursor-pointer rounded-md object-cover"
          />
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="md:max-w-2xl lg:max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle>{file.name}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video">
            <Image
              src={file.preview}
              alt={file.name}
              fill
              loading="lazy"
              className="shrink-0 rounded-md object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
  )
}

export default FileCard
