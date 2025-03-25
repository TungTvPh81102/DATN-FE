import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Video } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const SliderButton = ({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70"
    style={{ [direction === 'prev' ? 'left' : 'right']: '1rem' }}
  >
    {direction === 'prev' ? (
      <ChevronLeft className="size-6" />
    ) : (
      <ChevronRight className="size-6" />
    )}
  </button>
)

export const ImagePreview = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: {
  isOpen: boolean
  onClose: () => void
  images: Array<{
    url: string
    type?: 'image' | 'video'
    sender: { name: string; avatar: string }
  }>
  initialIndex?: number
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex,
    loop: true,
    skipSnaps: false,
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl border-none bg-transparent p-0">
        <div className="relative">
          {/* Carousel container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {images.map((media, index) => (
                <div
                  key={index}
                  className="relative min-w-full flex-[0_0_100%]"
                >
                  <div className="relative aspect-[16/9] w-full">
                    {media.type === 'video' ? (
                      <video
                        src={media.url}
                        controls
                        className="size-full object-contain"
                      />
                    ) : (
                      <Image
                        src={media.url}
                        alt="Preview"
                        fill
                        className="object-contain"
                        priority
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarImage src={media.sender.avatar} />
                          <AvatarFallback>
                            {media.sender.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <span>{media.sender.name}</span>
                          {media.type === 'video' && (
                            <Video className="size-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <SliderButton direction="prev" onClick={scrollPrev} />
          <SliderButton direction="next" onClick={scrollNext} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
