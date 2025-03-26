// import React, { useEffect, useRef, useState } from 'react'
// import { useQueryClient } from '@tanstack/react-query'
// import { Loader2, Send, Trash2 } from 'lucide-react'
// import { FiMoreHorizontal } from 'react-icons/fi'
// import { toast } from 'react-toastify'
//
// import QueryKey from '@/constants/query-key'
// import { timeAgo } from '@/lib/common'
// import {
//   useDeleteComment,
//   useStoreReplyCommentLesson,
// } from '@/hooks/comment-lesson/useComment'
// import { useToggleReaction } from '@/hooks/reaction/useReaction'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import HtmlRenderer from '@/components/shared/html-renderer'
// import { ReactionPicker } from '@/sections/learning-path/_components/comment/reaction-picker'
// import { ReplyList } from '@/sections/learning-path/_components/comment/reply-list'
//
// const reactionEmojis = [
//   { emoji: '👍', name: 'Thích', type: 'like' },
//   { emoji: '❤️', name: 'Yêu thích', type: 'love' },
//   { emoji: '😆', name: 'Haha', type: 'haha' },
//   { emoji: '😮', name: 'Wow', type: 'wow' },
//   { emoji: '😢', name: 'Buồn', type: 'sad' },
//   { emoji: '😡', name: 'Phẫn nộ', type: 'angry' },
// ]
//
// export const CommentItem = ({
//   comment,
//   user,
//   lessonId,
// }: {
//   comment: any
//   user: any
//   lessonId: string
// }) => {
//   const queryClient = useQueryClient()
//   const reactionPickerRef = useRef<HTMLDivElement>(null)
//   const dropdownRef = useRef<HTMLDivElement>(null)
//
//   const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false)
//   const [openDropdown, setOpenDropdown] = useState<boolean>(false)
//   const [activeReplyEditor, setActiveReplyEditor] = useState<boolean>(false)
//   const [replyContent, setReplyContent] = useState<string>('')
//   const [visibleReplies, setVisibleReplies] = useState<boolean>(false)
//   const [commentReaction, setCommentReaction] = useState<string>('')
//
//   const {
//     mutate: storeReplyLessonComment,
//     isPending: isPendingStoreReplyLessonComment,
//   } = useStoreReplyCommentLesson()
//   const { mutate: deleteComment, isPending: isPendingDeleteComment } =
//     useDeleteComment(comment.id)
//   const { mutate: toggleReaction, isPending: isToggleReaction } =
//     useToggleReaction()
//
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         reactionPickerRef.current &&
//         !reactionPickerRef.current.contains(event.target as Node)
//       ) {
//         setShowReactionPicker(false)
//       }
//
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpenDropdown(false)
//       }
//     }
//
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [])
//
//   useEffect(() => {
//     if (comment.user_reaction) {
//       const reactionEmoji = reactionEmojis.find(
//         (r) => r.type === comment.user_reaction
//       )?.emoji
//       if (reactionEmoji) {
//         setCommentReaction(reactionEmoji)
//       }
//     }
//   }, [comment])
//
//   const handleReactionClick = (emoji: string, reactionType: string) => {
//     setCommentReaction(emoji)
//     toggleReaction(
//       {
//         comment_id: comment.id,
//         type: reactionType,
//       },
//       {
//         onSuccess: () => {
//           queryClient.invalidateQueries({
//             queryKey: [QueryKey.LESSON_COMMENT, lessonId],
//           })
//           setShowReactionPicker(false)
//         },
//         onError: (error: any) => {
//           toast.error(error?.message)
//         },
//       }
//     )
//   }
//
//   const handleReplySubmit = () => {
//     if (!replyContent.trim()) {
//       toast.error('Nội dung phản hồi không được để trống')
//       return
//     }
//
//     storeReplyLessonComment(
//       { commentId: comment.id, data: { content: replyContent.trim() } },
//       {
//         onSuccess: async (res: any) => {
//           setActiveReplyEditor(false)
//           toast.success(res.message || 'Đã phản hồi bình luận thành công')
//           setReplyContent('')
//
//           await queryClient.invalidateQueries({
//             queryKey: [QueryKey.LESSON_COMMENT, lessonId],
//           })
//         },
//         onError: (error: any) => {
//           toast.error(error.message || 'Có lỗi xảy ra khi phản hồi bình luận')
//         },
//       }
//     )
//   }
//
//   const handleDeleteComment = () => {
//     deleteComment(undefined, {
//       onSuccess: () => {
//         toast.success('Đã xóa bình luận thành công')
//         setOpenDropdown(false)
//         queryClient.invalidateQueries({
//           queryKey: [QueryKey.LESSON_COMMENT, lessonId],
//         })
//       },
//       onError: (error: any) => {
//         toast.error(error?.message || 'Xóa bình luận không thành công')
//       },
//     })
//   }
//
//   return (
//     <div className="mt-6 border-b border-gray-100 pb-6">
//       <div className="flex gap-2">
//         <Avatar className="size-10">
//           <AvatarImage
//             src={comment?.user?.avatar || ''}
//             alt={comment?.user?.name || 'User Avatar'}
//           />
//           <AvatarFallback className="bg-blue-100 text-blue-800">
//             {comment?.user?.name?.charAt(0) || 'A'}
//           </AvatarFallback>
//         </Avatar>
//         <div className="w-full rounded-2xl bg-gray-50 px-4 py-3">
//           <div className="font-medium text-gray-900">
//             {comment?.user?.name || 'Anonymous'}
//           </div>
//           <div className="mt-1 text-gray-800">
//             <HtmlRenderer html={comment?.content || 'No content available'} />
//           </div>
//         </div>
//       </div>
//
//       <div className="mt-4 flex items-center gap-4 pl-2 text-sm">
//         <ReactionPicker
//           showPicker={showReactionPicker}
//           setShowPicker={setShowReactionPicker}
//           onReactionSelect={handleReactionClick}
//           currentReaction={commentReaction}
//           reactionPickerRef={reactionPickerRef}
//           isLoading={isToggleReaction}
//         />
//
//         <button
//           onClick={() => setActiveReplyEditor(!activeReplyEditor)}
//           className="flex items-center gap-1 font-medium text-gray-500 hover:text-blue-600"
//         >
//           Phản hồi
//         </button>
//
//         <span className="text-gray-500">{timeAgo(comment?.created_at)}</span>
//
//         <div className="relative ml-auto flex items-center gap-1">
//           <div className="flex items-center">
//             {reactionEmojis.map((reaction) => {
//               const count = comment.reaction_counts[reaction.type]
//               if (count > 0) {
//                 return (
//                   <span key={reaction.type} className="text-sm">
//                     {reaction.emoji}
//                   </span>
//                 )
//               }
//               return null
//             })}
//             <span className="font-bold text-gray-500">
//               {comment.reaction_counts.total || ''}
//             </span>
//           </div>
//
//           {user?.id === comment?.user?.id && (
//             <div className="relative">
//               <button
//                 className="text-gray-400 hover:text-gray-600"
//                 onClick={() => setOpenDropdown(!openDropdown)}
//               >
//                 <FiMoreHorizontal />
//               </button>
//
//               {openDropdown && (
//                 <div
//                   ref={dropdownRef}
//                   className="animate-fade-in absolute right-0 top-6 z-50 w-40 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
//                 >
//                   <button
//                     className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
//                     onClick={handleDeleteComment}
//                     disabled={isPendingDeleteComment}
//                   >
//                     {isPendingDeleteComment ? (
//                       <Loader2 className="size-4 animate-spin" />
//                     ) : (
//                       <Trash2 className="size-4" />
//                     )}
//                     Xóa bình luận
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//
//       {activeReplyEditor && (
//         <div className="ml-12 mt-4 space-y-4 pl-4">
//           <div className="flex gap-2">
//             <Avatar className="size-8">
//               <AvatarImage src={user?.avatar || ''} alt={user?.name} />
//               <AvatarFallback className="bg-blue-100 text-blue-800">
//                 {user?.name?.charAt(0) || 'U'}
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <Textarea
//                 value={replyContent}
//                 onChange={(e) => setReplyContent(e.target.value)}
//                 placeholder={`Phản hồi bình luận của ${comment?.user?.name}...`}
//                 className="min-h-[80px] border border-gray-200 focus:border-gray-300 focus:outline-none focus:ring-0 focus-visible:border-gray-300 focus-visible:ring-0"
//                 autoFocus
//               />
//               <div className="mt-2 flex justify-end gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setReplyContent('')
//                     setActiveReplyEditor(false)
//                   }}
//                   disabled={isPendingStoreReplyLessonComment}
//                   className="rounded-full"
//                 >
//                   Hủy
//                 </Button>
//                 <Button
//                   onClick={handleReplySubmit}
//                   disabled={
//                     !replyContent.trim() || isPendingStoreReplyLessonComment
//                   }
//                   className="rounded-full bg-blue-600 hover:bg-blue-700"
//                 >
//                   {isPendingStoreReplyLessonComment ? (
//                     <>
//                       <Loader2 className="mr-2 size-4 animate-spin" />
//                       Đang gửi...
//                     </>
//                   ) : (
//                     <>
//                       <Send className="mr-2 size-4" />
//                       Phản hồi
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//
//       <ReplyList
//         replies={comment.replies}
//         commentId={comment.id}
//         user={user}
//         lessonId={lessonId}
//         visible={visibleReplies}
//         onToggleVisibility={() => setVisibleReplies(!visibleReplies)}
//       />
//     </div>
//   )
// }
import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Send, Trash2 } from 'lucide-react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { toast } from 'react-toastify'

import QueryKey from '@/constants/query-key'
import { timeAgo } from '@/lib/common'
import {
  useDeleteComment,
  useStoreReplyCommentLesson,
} from '@/hooks/comment-lesson/useComment'
import { useToggleReaction } from '@/hooks/reaction/useReaction'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import HtmlRenderer from '@/components/shared/html-renderer'
import { ReactionPicker } from '@/sections/learning-path/_components/comment/reaction-picker'
import { ReplyList } from '@/sections/learning-path/_components/comment/reply-list'

const reactionEmojis = [
  { emoji: '👍', name: 'Thích', type: 'like' },
  { emoji: '❤️', name: 'Yêu thích', type: 'love' },
  { emoji: '😆', name: 'Haha', type: 'haha' },
  { emoji: '😮', name: 'Wow', type: 'wow' },
  { emoji: '😢', name: 'Buồn', type: 'sad' },
  { emoji: '😡', name: 'Phẫn nộ', type: 'angry' },
]

export const CommentItem = ({
  comment,
  user,
  lessonId,
}: {
  comment: any
  user: any
  lessonId: string
}) => {
  const queryClient = useQueryClient()
  const reactionPickerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false)
  const [openDropdown, setOpenDropdown] = useState<boolean>(false)
  const [activeReplyEditor, setActiveReplyEditor] = useState<boolean>(false)
  const [replyContent, setReplyContent] = useState<string>('')
  const [visibleReplies, setVisibleReplies] = useState<boolean>(false)
  const [commentReaction, setCommentReaction] = useState<string>('')
  const [replyTargetName, setReplyTargetName] = useState<string>('')

  const {
    mutate: storeReplyLessonComment,
    isPending: isPendingStoreReplyLessonComment,
  } = useStoreReplyCommentLesson()
  const { mutate: deleteComment, isPending: isPendingDeleteComment } =
    useDeleteComment(comment.id)
  const { mutate: toggleReaction, isPending: isToggleReaction } =
    useToggleReaction()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reactionPickerRef.current &&
        !reactionPickerRef.current.contains(event.target as Node)
      ) {
        setShowReactionPicker(false)
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (comment.user_reaction) {
      const reactionEmoji = reactionEmojis.find(
        (r) => r.type === comment.user_reaction
      )?.emoji
      if (reactionEmoji) {
        setCommentReaction(reactionEmoji)
      }
    }
  }, [comment])

  const handleReactionClick = (emoji: string, reactionType: string) => {
    setCommentReaction(emoji)
    toggleReaction(
      {
        comment_id: comment.id,
        type: reactionType,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: [QueryKey.LESSON_COMMENT, lessonId],
          })
          setShowReactionPicker(false)
        },
        onError: (error: any) => {
          toast.error(error?.message)
        },
      }
    )
  }

  const handleReplyClick = () => {
    setActiveReplyEditor(!activeReplyEditor)
    const targetName = comment?.user?.name || ''
    setReplyTargetName(targetName)
    setReplyContent(`@${targetName} `)
  }

  const handleReplySubmit = () => {
    if (!replyContent.trim()) {
      toast.error('Nội dung phản hồi không được để trống')
      return
    }

    storeReplyLessonComment(
      { commentId: comment.id, data: { content: replyContent.trim() } },
      {
        onSuccess: async (res: any) => {
          setActiveReplyEditor(false)
          toast.success(res.message || 'Đã phản hồi bình luận thành công')
          setReplyContent('')
          setReplyContent(`@${replyTargetName} `)

          await queryClient.invalidateQueries({
            queryKey: [QueryKey.LESSON_COMMENT, lessonId],
          })
        },
        onError: (error: any) => {
          toast.error(error.message || 'Có lỗi xảy ra khi phản hồi bình luận')
        },
      }
    )
  }

  const handleDeleteComment = () => {
    deleteComment(undefined, {
      onSuccess: async () => {
        toast.success('Đã xóa bình luận thành công')
        setOpenDropdown(false)
        await queryClient.invalidateQueries({
          queryKey: [QueryKey.LESSON_COMMENT, lessonId],
        })
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Xóa bình luận không thành công')
      },
    })
  }

  return (
    <div className="mt-6 border-b border-gray-100 pb-6">
      <div className="flex gap-2">
        <Avatar className="size-10">
          <AvatarImage
            src={comment?.user?.avatar || ''}
            alt={comment?.user?.name || 'User Avatar'}
          />
          <AvatarFallback className="bg-blue-100 text-blue-800">
            {comment?.user?.name?.charAt(0) || 'A'}
          </AvatarFallback>
        </Avatar>
        <div className="w-full rounded-2xl bg-gray-50 px-4 py-3">
          <div className="font-medium text-gray-900">
            {comment?.user?.name || 'Anonymous'}
          </div>
          <div className="mt-1 text-gray-800">
            <HtmlRenderer html={comment?.content || 'No content available'} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 pl-2 text-sm">
        <ReactionPicker
          showPicker={showReactionPicker}
          setShowPicker={setShowReactionPicker}
          onReactionSelect={handleReactionClick}
          currentReaction={commentReaction}
          reactionPickerRef={reactionPickerRef}
          isLoading={isToggleReaction}
        />

        <button
          onClick={handleReplyClick}
          className="flex items-center gap-1 font-medium text-gray-500 hover:text-blue-600"
        >
          Phản hồi
        </button>

        <span className="text-gray-500">{timeAgo(comment?.created_at)}</span>

        <div className="relative ml-auto flex items-center gap-1">
          <div className="flex items-center">
            {reactionEmojis.map((reaction) => {
              const count = comment.reaction_counts[reaction.type]
              if (count > 0) {
                return (
                  <span key={reaction.type} className="text-sm">
                    {reaction.emoji}
                  </span>
                )
              }
              return null
            })}
            <span className="font-bold text-gray-500">
              {comment.reaction_counts.total || ''}
            </span>
          </div>

          {user?.id === comment?.user?.id && (
            <div className="relative">
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                <FiMoreHorizontal />
              </button>

              {openDropdown && (
                <div
                  ref={dropdownRef}
                  className="animate-fade-in ring-opacity/5 absolute right-0 top-6 z-50 w-40 rounded-md bg-white py-1 shadow-lg ring-1 ring-black"
                >
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    onClick={handleDeleteComment}
                    disabled={isPendingDeleteComment}
                  >
                    {isPendingDeleteComment ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    Xóa bình luận
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {activeReplyEditor && (
        <div className="ml-12 mt-4 space-y-4 pl-4">
          <div className="flex gap-2">
            <Avatar className="size-8">
              <AvatarImage src={user?.avatar || ''} alt={user?.name} />
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Phản hồi bình luận của ${comment?.user?.name}...`}
                className="min-h-[80px] border border-gray-200 focus:border-gray-300 focus:outline-none focus:ring-0 focus-visible:border-gray-300 focus-visible:ring-0"
                autoFocus
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setReplyContent('')
                    setActiveReplyEditor(false)
                  }}
                  disabled={isPendingStoreReplyLessonComment}
                  className="rounded-full"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleReplySubmit}
                  disabled={
                    !replyContent.trim() || isPendingStoreReplyLessonComment
                  }
                  className="rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  {isPendingStoreReplyLessonComment ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 size-4" />
                      Phản hồi
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ReplyList
        replies={comment.replies}
        commentId={comment.id}
        user={user}
        lessonId={lessonId}
        visible={visibleReplies}
        onToggleVisibility={() => setVisibleReplies(!visibleReplies)}
      />
    </div>
  )
}
