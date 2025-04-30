import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Send, Trash2, X } from 'lucide-react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { toast } from 'react-toastify'

import QueryKey from '@/constants/query-key'
import { timeAgo } from '@/lib/common'
import {
  useDeleteComment,
  useGetCommentBlockTime,
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
import { ReactionData, reactionEmojis } from '@/types/Reaction'
import { useCommentBlockStore } from '@/stores/useCommentBlockStore'

export const ReplyItem = ({
  reply,
  user,
  lessonId,
  commentId,
}: {
  reply: any
  user: any
  lessonId: number
  commentId: string
}) => {
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
  const [replyReaction, setReplyReaction] = useState<string>('')
  const [replyTargetName, setReplyTargetName] = useState<string>('')

  const { isBlocked } = useCommentBlockStore()

  const { isLoading: isLoadingBlockTime, refetch: refetchBlockTime } =
    useGetCommentBlockTime()

  const {
    mutate: storeReplyLessonComment,
    isPending: isPendingStoreReplyLessonComment,
  } = useStoreReplyCommentLesson()
  const { mutate: deleteComment, isPending: isPendingDeleteComment } =
    useDeleteComment(reply.id)
  const { mutate: toggleReaction, isPending: isToggleReaction } =
    useToggleReaction()
  const { data: reactionData } = useGetReactionWithComment(
    reply.id
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
    if (reply.user_reaction) {
      const reactionEmoji = reactionEmojis.find(
        (r) => r.type === reply.user_reaction
      )?.emoji
      if (reactionEmoji) {
        setReplyReaction(reactionEmoji)
      }
    }
  }, [reply])

  useEffect(() => {
    if (isBlocked && activeReplyEditor) {
      setActiveReplyEditor(false)
      setReplyContent('')
    }
  }, [activeReplyEditor, isBlocked])

  const handleReactionClick = (emoji: string, reactionType: string) => {
    setReplyReaction(emoji)
    toggleReaction(
      {
        comment_id: reply.id,
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
    if (isLoadingBlockTime) {
      toast.info('Đang kiểm tra trạng thái chặn bình luận, vui lòng đợi...')
      return
    }
    if (isBlocked) {
      toast.error('Bạn đang bị cấm bình luận')
      return
    }
    setActiveReplyEditor(!activeReplyEditor)
    const targetName = reply?.user?.name || ''
    setReplyTargetName(targetName)
    setReplyContent(`@${targetName} `)
  }

  const handleReplySubmit = () => {
    if (!replyContent.trim()) {
      toast.error('Nội dung phản hồi không được để trống')
      return
    }

    storeReplyLessonComment(
      { commentId, data: { content: replyContent.trim() } },
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
        onError: async (error: any) => {
          toast.error(error.message || 'Có lỗi xảy ra khi phản hồi bình luận')
          await refetchBlockTime()
          if (error?.countdown) {
            setActiveReplyEditor(false)
            setReplyContent('')
          }
        },
      }
    )
  }

  const handleDeleteReply = () => {
    deleteComment(undefined, {
      onSuccess: async () => {
        toast.success('Đã xóa phản hồi thành công')
        setOpenDropdown(false)
        await queryClient.invalidateQueries({
          queryKey: [QueryKey.LESSON_COMMENT, lessonId],
        })
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Xóa phản hồi không thành công')
      },
    })
  }

  return (
    <div className="animate-fade-in mt-2">
      <div className="flex gap-2">
        <Avatar className="size-8">
          <AvatarImage
            src={reply?.user?.avatar || ''}
            alt={reply?.user?.name || 'User Avatar'}
          />
          <AvatarFallback className="bg-blue-100 text-blue-800">
            {reply?.user?.name?.charAt(0) || 'A'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="rounded-2xl bg-gray-50 px-3 py-2">
            <div className="font-medium text-gray-900">
              {reply?.user?.name || 'Anonymous'}
            </div>
            <div className="mt-1 text-gray-800">
              <HtmlRenderer html={reply?.content || 'No content available'} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 pl-2 text-xs">
            <ReactionPicker
              showPicker={showReactionPicker}
              setShowPicker={setShowReactionPicker}
              onReactionSelect={handleReactionClick}
              currentReaction={replyReaction}
              reactionPickerRef={reactionPickerRef}
              isLoading={isToggleReaction}
            />

            <button
              className={`flex items-center gap-1 font-medium ${
                isBlocked
                  ? 'cursor-not-allowed text-gray-400'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
              onClick={handleReplyClick}
            >
              Phản hồi
            </button>

            <span className="text-gray-500">{timeAgo(reply?.created_at)}</span>

            <div className="relative ml-auto flex items-center gap-1">
              <button
                className="flex items-center rounded-md px-2 py-1 hover:bg-gray-100"
                onClick={() => setShowReactionDetails(true)}
              >
                {reactionEmojis.map((reaction) => {
                  const count = reply.reaction_counts[reaction.type]
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
                  {reply.reaction_counts.total || ''}
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
                        const count = reply.reaction_counts[reaction.type] || 0
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
                              <span className="text-base">
                                {reaction.emoji}
                              </span>
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
                            activeTab === 'all' ||
                            reaction.react_type === activeTab
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

              {user?.id === reply?.user?.id && (
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
                      className="animate-fade-in absolute right-0 top-6 z-50 w-40 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5"
                    >
                      <button
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                        onClick={handleDeleteReply}
                        disabled={isPendingDeleteComment}
                      >
                        {isPendingDeleteComment ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                        Xóa phản hồi
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeReplyEditor && !isBlocked && (
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
                placeholder={`Phản hồi bình luận của ${reply?.user?.name}...`}
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
                  className="rounded-full bg-orange-600 hover:bg-orange-700"
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
    </div>
  )
}
