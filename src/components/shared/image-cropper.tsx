'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  CropIcon,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RotateCw,
  Trash2Icon,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import React, { type SyntheticEvent } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileWithPreview } from '@/types/file'

import 'react-image-crop/dist/ReactCrop.css'
import { toast } from 'react-toastify'

interface ImageCropperProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  selectedFile: FileWithPreview | null
  setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>
  croppedImage: File | null
  onCroppedImageChange?: (image: File | null) => void
  aspect?: number
}

export function ImageCropper({
  selectedFile,
  setSelectedFile,
  croppedImage,
  onCroppedImageChange,
  aspect = 16 / 9,
  ...props
}: ImageCropperProps) {
  const imgRef = React.useRef<HTMLImageElement | null>(null)

  const [crop, setCrop] = React.useState<Crop>()
  const [pixelCrop, setPixelCrop] = React.useState<PixelCrop>()
  const [scale, setScale] = React.useState(1)
  const [rotate, setRotate] = React.useState(0)
  const [flipH, setFlipH] = React.useState(false)
  const [flipV, setFlipV] = React.useState(false)

  const functionalButtons = [
    {
      icon: <FlipVertical />,
      tooltip: 'Lật dọc',
      onClick: () => setFlipV((prev) => !prev),
    },
    {
      icon: <FlipHorizontal />,
      tooltip: 'Lật ngang',
      onClick: () => setFlipH((prev) => !prev),
    },
    {
      icon: <RotateCcw />,
      tooltip: 'Xoay trái',
      onClick: () => setRotate((prev) => prev - 90),
    },
    {
      icon: <RotateCw />,
      tooltip: 'Xoay phải',
      onClick: () => setRotate((prev) => prev + 90),
    },
    {
      icon: <ZoomOut />,
      tooltip: 'Thu nhỏ',
      onClick: () => setScale((prev) => Math.round((prev - 0.1) * 10) / 10),
      disabled: scale <= 0.5,
    },
    {
      icon: <ZoomIn />,
      tooltip: 'Phóng to',
      onClick: () => setScale((prev) => Math.round((prev + 0.1) * 10) / 10),
      disabled: scale >= 3,
    },
  ]

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect && !croppedImage) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  async function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImage = await getCroppedImg(imgRef.current, crop)
      onCroppedImageChange?.(croppedImage)
    }
  }

  async function getCroppedImg(image: HTMLImageElement, pixelCrop: PixelCrop) {
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')

    if (tempCtx) {
      tempCanvas.width = image.naturalWidth
      tempCanvas.height = image.naturalHeight

      tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
      tempCtx.rotate((rotate * Math.PI) / 180)
      tempCtx.scale(scale * (flipH ? -1 : 1), scale * (flipV ? -1 : 1))
      tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2)

      tempCtx.drawImage(image, 0, 0)
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Giảm kích thước ảnh đầu ra
    const outputWidth = pixelCrop.width * scaleX * 0.8 // Giảm 20% kích thước
    const outputHeight = pixelCrop.height * scaleY * 0.8

    canvas.width = outputWidth
    canvas.height = outputHeight

    if (ctx && tempCtx) {
      ctx.imageSmoothingEnabled = true

      ctx.drawImage(
        tempCanvas,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        outputWidth,
        outputHeight
      )
    }

    return new Promise<File>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], 'cropped-image.jpg', {
              type: 'image/jpeg',
            })
            resolve(file)
          } else {
            reject(
              new Error('Đã xảy ra lỗi khi cắt ảnh. Vui lòng thử lại sau.')
            )
          }
        },
        'image/jpeg', // Chuyển sang định dạng JPEG
        0.7 // Giảm chất lượng ảnh xuống 70%
      )
    })
  }

  async function onCrop() {
    try {
      if (pixelCrop) await onCropComplete(pixelCrop)
      props.onOpenChange?.(false)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      props.onOpenChange?.(false)
      setSelectedFile(null)
      onCroppedImageChange?.(null)
      toast.error((error as Error).message)
    }
  }

  return (
    <Dialog
      {...props}
      onOpenChange={(isOpen) => {
        props.onOpenChange?.(isOpen)
        if (!isOpen && !croppedImage) setSelectedFile(null)
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Cắt ảnh</DialogTitle>
          <DialogDescription>
            Chọn vùng cần cắt và nhấn nút &quot;Cắt&quot; để hoàn thành
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => {
              setCrop(percentCrop)
            }}
            onComplete={(pixelCrop) => setPixelCrop(pixelCrop)}
            aspect={aspect}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              alt="Image Cropper"
              src={selectedFile?.preview}
              onLoad={onImageLoad}
              className="transition-transform duration-300"
              style={{
                transform: `scale(${scale * (flipH ? -1 : 1)}, ${
                  scale * (flipV ? -1 : 1)
                }) rotate(${rotate}deg)`,
                transformOrigin: 'center', // Ensure scaling happens from the center
              }}
            />
          </ReactCrop>
        </ScrollArea>

        <div className="flex items-center justify-center gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogClose asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setSelectedFile(null)
                      onCroppedImageChange?.(null)
                    }}
                  >
                    <Trash2Icon />
                  </Button>
                </DialogClose>
              </TooltipTrigger>
              <TooltipContent>Xóa</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {functionalButtons.map((button, index) => (
            <TooltipProvider key={index} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={button.onClick}
                    disabled={button.disabled}
                  >
                    {button.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{button.tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" onClick={onCrop}>
                  <CropIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cắt</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: 'px',
        width: mediaWidth,
        // height: mediaWidth / aspect,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}
