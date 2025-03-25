'use client'
import React, { useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { MessageCircleMore } from 'lucide-react'
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

const CommentLesson = ({ lessonId }: { lessonId: string }) => {
  const { user } = useAuthStore()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700">
          <MessageCircleMore className="size-5" />
          <span className="font-medium">Hỏi đáp</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] max-w-full sm:w-[600px] sm:max-w-none md:w-[760px]">
        <div className="flex items-center justify-between">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl font-bold text-[#E27447]">
              Hỏi đáp
            </SheetTitle>
            <SheetDescription className="text-gray-600">
              Hãy để lại những thắc mắc của bạn để chúng ta cùng nhau xử lý.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="mt-6 flex max-h-[75vh] flex-col gap-2 overflow-y-auto pr-2">
          <CommentForm lessonId={lessonId} user={user} />
          <CommentList lessonId={lessonId} user={user} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CommentLesson
