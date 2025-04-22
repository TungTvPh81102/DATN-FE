'use client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { CommentForm } from '@/sections/learning-path/_components/comment/comment-form'
import { CommentList } from '@/sections/learning-path/_components/comment/comment-list'
import { MessageCircleMore } from 'lucide-react'
import { useState } from 'react'

const CommentLesson = ({ lessonId }: { lessonId: number }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="success" size="icon" className="rounded-full">
          <MessageCircleMore />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] max-w-full sm:w-[600px] sm:max-w-none md:w-[760px]">
        <div className="flex items-center justify-between">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl font-bold text-[#E27447]">
              Bình luận
            </SheetTitle>
            <SheetDescription className="text-gray-600">
              Hãy để lại những thắc mắc của bạn để chúng ta cùng nhau xử lý.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="mt-6 flex h-[calc(100vh-180px)] flex-1 flex-col gap-4 overflow-hidden">
          <div className="shrink-0">
            <CommentForm lessonId={lessonId} />
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <CommentList lessonId={lessonId} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CommentLesson
