import React from 'react'
import { Smile } from 'lucide-react'

const reactionEmojis = [
  { emoji: '👍', name: 'Thích', type: 'like' },
  { emoji: '❤️', name: 'Yêu thích', type: 'love' },
  { emoji: '😆', name: 'Haha', type: 'haha' },
  { emoji: '😮', name: 'Wow', type: 'wow' },
  { emoji: '😢', name: 'Buồn', type: 'sad' },
  { emoji: '😡', name: 'Phẫn nộ', type: 'angry' },
]

interface ReactionPickerProps {
  showPicker: boolean
  setShowPicker: (show: boolean) => void
  onReactionSelect: (emoji: string, type: string) => void
  currentReaction: string
  reactionPickerRef: React.RefObject<HTMLDivElement>
  isLoading: boolean
}

export const ReactionPicker = ({
  showPicker,
  setShowPicker,
  onReactionSelect,
  currentReaction,
  reactionPickerRef,
  isLoading,
}: ReactionPickerProps) => {
  return (
    <div className="relative">
      <button
        className={`font-medium ${
          currentReaction
            ? 'text-blue-500'
            : 'text-gray-500 hover:text-blue-500'
        }`}
        onClick={() => setShowPicker(!showPicker)}
      >
        {currentReaction || <Smile className="size-4" />}
      </button>

      {showPicker && (
        <div
          ref={reactionPickerRef}
          className="animate-fade-in absolute -top-12 left-0 z-50 flex items-center gap-1 rounded-full bg-white p-1 shadow-lg"
        >
          {reactionEmojis.map((reaction) => (
            <button
              disabled={isLoading}
              key={reaction.emoji}
              className="rounded-full p-2 transition-transform hover:scale-125"
              onClick={() => onReactionSelect(reaction.emoji, reaction.type)}
              title={reaction.name}
            >
              <span className="text-xl">{reaction.emoji}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
