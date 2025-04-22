import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Send, Trash2, X } from 'lucide-react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { toast } from 'react-toastify'

import QueryKey from '@/constants/query-key'
import { timeAgo } from '@/lib/common'
import {
  useDeleteComment,
  useStoreReplyCommentLesson,
} from '@/hooks/comment-lesson/useComment'
import {
  useGetReactionWithComment,
  useToggleReaction,
} from '@/hooks/reaction/useReaction'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import HtmlRenderer from '@/components/shared/html-renderer'
import { ReactionPicker } from '@/sections/learning-path/_components/comment/reaction-picker'
import { ReplyList } from '@/sections/learning-path/_components/comment/reply-list'
import { useAuthStore } from '@/stores/useAuthStore'
import { ReactionData, reactionEmojis } from '@/types/Reaction'
import { LoadingButton } from '@/components/ui/loading-button'

export const CommentItem = ({
  comment,
  lessonId,
}: {
  comment: any
  lessonId: number
}) => {
  const { user } = useAuthStore()

  const queryClient = useQueryClient()
  const reactionPickerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const reactionDetailsRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState('all')

  const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false)
  const [showReactionDetails, setShowReactionDetails] = useState<boolean>(false)
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
  const { data: reactionData } = useGetReactionWithComment(
    comment.id
  ) as unknown as {
    data: ReactionData
  }

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

      if (
        reactionDetailsRef.current &&
        !reactionDetailsRef.current.contains(event.target as Node)
      ) {
        setShowReactionDetails(false)
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
          <button
            className="flex items-center rounded-md px-2 py-1 hover:bg-gray-100"
            onClick={() => setShowReactionDetails(true)}
          >
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
            <span className="ml-1 font-bold text-gray-500">
              {comment.reaction_counts.total || ''}
            </span>
          </button>
          {showReactionDetails && reactionData && (
            <div
              ref={reactionDetailsRef}
              className="fixed left-1/2 top-1/2 z-50 flex h-[480px] w-[580px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white shadow-xl"
            >
              <div className="border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Tất cả ({reactionData?.totalReactions || 0})
                  </h3>
                  <button
                    onClick={() => setShowReactionDetails(false)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Reaction Tabs */}
              <div className="border-b">
                <div className="custom-scrollbar flex gap-1 overflow-x-auto px-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`flex min-w-fit items-center gap-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'all'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                    }`}
                  >
                    Tất cả ({reactionData?.totalReactions || 0})
                  </button>
                  {reactionEmojis.map((reaction) => {
                    const count = comment.reaction_counts[reaction.type] || 0
                    if (count > 0) {
                      return (
                        <button
                          key={reaction.type}
                          onClick={() => setActiveTab(reaction.type)}
                          className={`flex min-w-fit items-center gap-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === reaction.type
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                          }`}
                        >
                          <span className="text-base">{reaction.emoji}</span>
                          <span>({count})</span>
                        </button>
                      )
                    }
                    return null
                  })}
                </div>
              </div>

              {/* Users List */}
              <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-3">
                  {reactionData?.reactions
                    ?.filter(
                      (reaction) =>
                        activeTab === 'all' || reaction.react_type === activeTab
                    )
                    .map((reaction, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                      >
                        <Avatar className="size-10 border">
                          <AvatarImage
                            src={reaction.avatar}
                            alt={reaction.user_name}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            {reaction.user_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-sm font-medium text-gray-900">
                          {reaction.user_name}
                        </span>
                        <span className="text-lg">
                          {
                            reactionEmojis.find(
                              (r) => r.type === reaction.react_type
                            )?.emoji
                          }
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

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
                  <X size={14} />
                  Hủy
                </Button>
                <LoadingButton
                  onClick={handleReplySubmit}
                  size="sm"
                  loading={isPendingStoreReplyLessonComment}
                  disabled={
                    !replyContent.trim() || isPendingStoreReplyLessonComment
                  }
                  className="rounded-full"
                >
                  <Send size={14} />
                  Phản hồi
                </LoadingButton>
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

export default CommentItem
