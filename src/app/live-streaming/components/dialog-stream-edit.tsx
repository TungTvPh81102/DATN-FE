import React, { useState } from 'react'
import Image from 'next/image'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LiveSession } from '@/types/Live'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload } from 'lucide-react'

interface StreamEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: LiveSession
  onSave?: (updatedData: LiveSession) => void
}

const DialogStreamEdit = ({
  open,
  onOpenChange,
  data,
  onSave,
}: StreamEditDialogProps) => {
  const [formData, setFormData] = useState<LiveSession>({
    title: data.title || '',
    description: data.description || '',
    visibility: data.visibility || 'public',
    thumbnail:
      data.thumbnail ||
      'https://res.cloudinary.com/dvrexlsgx/image/upload/v1745869020/Gemini_Generated_Image_nkbuicnkbuicnkbu_qz4jrz.jpg',
  })

  const handleSave = () => {
    onSave?.(formData)
    onOpenChange(false)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }))
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Chỉnh sửa thông tin phát trực tiếp
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cập nhật thông tin chi tiết về buổi phát trực tiếp của bạn
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-title">Tiêu đề</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Nhập tiêu đề buổi phát trực tiếp"
              />
            </div>
            <div>
              <Label htmlFor="edit-privacy">Quyền riêng tư</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) =>
                  setFormData((prev: LiveSession) => ({
                    ...prev,
                    visibility: value as 'public' | 'private',
                  }))
                }
              >
                <SelectTrigger id="edit-privacy">
                  <SelectValue placeholder="Chọn chế độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Công khai</SelectItem>
                  <SelectItem value="private">Riêng tư</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Mô tả</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Mô tả nội dung buổi học trực tuyến"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh thu nhỏ</Label>
            <div className="overflow-hidden rounded-md border border-slate-200">
              <div className="relative aspect-video w-full">
                <Image
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 640px"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black opacity-0 transition-opacity hover:opacity-100"
                >
                  <div className="flex flex-col items-center text-white">
                    <Upload className="mb-2 size-8" />
                    <span className="text-sm font-medium">
                      Thay đổi hình ảnh
                    </span>
                  </div>
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>
            Lưu thay đổi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DialogStreamEdit
