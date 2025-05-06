'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMediaSearch } from '@/hooks/debounce/useMediaSearch'
import { IMediaItem } from '@/types/Common'

type MediaItemProps = {
  item: IMediaItem
  onSelect: (
    playback_id: string | undefined,
    asset_id: string | undefined,
    duration: number | undefined
  ) => void
}

const MediaItem = ({ item, onSelect }: MediaItemProps) => {
  return (
    <Card
      className="cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary/50"
      onClick={() => onSelect(item.playback_id, item.asset_id, item.duration)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video w-full">
          <img
            src={
              item.thumbnail ??
              'https://res.cloudinary.com/dvrexlsgx/image/upload/v1744405490/Gemini_Generated_Image_i0dae4i0dae4i0da_pwjntz.jpg'
            }
            alt={item.title}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
            <Button variant="secondary" size="sm">
              Chọn
            </Button>
          </div>
        </div>
        <div className="p-2">
          <p className="truncate text-sm font-medium">{item.title}</p>
        </div>
      </CardContent>
    </Card>
  )
}

const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Trước
      </Button>
      <span className="text-sm">
        Trang {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Sau
      </Button>
    </div>
  )
}

const MediaLibraryDialog = ({
  open,
  onOpenChange,
  onSelectMedia,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectMedia: (
    playback_id: string,
    asset_id: string | undefined,
    duration: number | undefined
  ) => void
}) => {
  const {
    data,
    isLoading,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    handleTypeFilter,
  } = useMediaSearch({
    per_page: 12,
    page: 1,
    type: 'video',
  })

  useEffect(() => {
    if (open) {
      setSearchTerm('')
    }
  }, [open, setSearchTerm])

  const handleSelectMedia = (
    playback_id: string | undefined,
    asset_id: string | undefined,
    duration: number | undefined
  ) => {
    if (playback_id && asset_id) {
      onSelectMedia(playback_id, asset_id, duration)
      onOpenChange(false)
    }
  }

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Tài nguyên của bạn</DialogTitle>
        <DialogDescription>
          Chọn video từ thư viện của bạn để sử dụng cho bài giảng này.
        </DialogDescription>
      </DialogHeader>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm video..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          defaultValue="all"
          onValueChange={(value) => handleTypeFilter(value || undefined)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Loại tệp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="doc">Tài liệu</SelectItem>
            <SelectItem value="all">Tất cả</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid max-h-[400px] grid-cols-2 gap-4 overflow-y-auto p-1 md:grid-cols-4">
            {data?.data?.length ? (
              data.data.map((item) => (
                <MediaItem
                  key={item.id}
                  item={item}
                  onSelect={handleSelectMedia}
                />
              ))
            ) : (
              <div className="col-span-full flex h-64 items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Không tìm thấy tài nguyên
                </p>
              </div>
            )}
          </div>

          {data?.meta && data.meta.last_page > 1 && (
            <div className="flex justify-center pt-4">
              <SimplePagination
                currentPage={data.meta.current_page}
                totalPages={data.meta.last_page}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </DialogContent>
  )
}

export default MediaLibraryDialog
