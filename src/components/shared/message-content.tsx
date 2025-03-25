import React, { useRef, useState } from 'react'
import { Download, FileText, Pause, PlayCircle, Reply, X } from 'lucide-react'
import Image from 'next/image'
import { IMessage } from '@/types/Chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuthStore } from '@/stores/useAuthStore'

interface MessageItemProps {
  message: IMessage
  isCurrentUser: boolean
  isGroupChat: boolean
  onReply: (message: IMessage) => void
}

const getLastName = (fullName: string): string => {
  const nameParts = fullName.trim().split(' ')
  return nameParts.length > 0 ? nameParts[nameParts.length - 1] : fullName
}

interface FileMetaData {
  media_id?: number
  file_name: string
  file_path: string
  file_size: number
  file_type: string
}

const FileMediaPreview = ({
  files,
  type,
}: {
  files: FileMetaData[]
  type: string
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNextFile = () => {
    setActiveIndex((prev) => (prev + 1) % files.length)
  }

  const handlePrevFile = () => {
    setActiveIndex((prev) => (prev - 1 + files.length) % files.length)
  }

  const renderFilePreview = (file: FileMetaData) => {
    const storageUrl = `${process.env.NEXT_PUBLIC_STORAGE}/${file.file_path}`

    switch (type) {
      case 'image':
        return (
          <div className="group relative overflow-hidden rounded-lg">
            <Image
              width={350}
              height={250}
              src={storageUrl}
              alt={file.file_name}
              className="w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <a
                href={storageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-white"
              >
                <Download className="size-4" />
                Tải xuống
              </a>
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="group relative max-w-[350px] overflow-hidden rounded-lg bg-black/5 shadow-sm">
            <div
              className="relative aspect-video cursor-pointer"
              onClick={handleVideoClick}
            >
              <video
                ref={videoRef}
                className="size-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={storageUrl} type={file.file_type || 'video/mp4'} />
              </video>
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <PlayCircle className="size-12 text-white/90 transition-transform duration-200 group-hover:scale-110" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-2">
              <span className="text-sm text-gray-600">Video</span>
              <div className="flex items-center gap-2">
                {isPlaying && (
                  <button
                    onClick={handleVideoClick}
                    className="rounded-full bg-white/90 p-1.5 text-gray-600 hover:bg-white hover:text-gray-900"
                  >
                    <Pause className="size-4" />
                  </button>
                )}
                <a
                  href={storageUrl}
                  download
                  className="rounded-full bg-white/90 p-1.5 text-gray-600 hover:bg-white hover:text-gray-900"
                >
                  <Download className="size-4" />
                </a>
              </div>
            </div>
          </div>
        )

      case 'file':
        return (
          <div className="group max-w-[300px] overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3 p-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="size-5 text-primary" />
              </div>
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium">{file.file_name}</p>
                <p className="text-xs text-gray-500">
                  {(file.file_size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <a
                href={storageUrl}
                download
                className="flex size-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <Download className="size-4" />
              </a>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="relative">
      {files.length > 1 && (
        <div className="absolute z-10 flex w-full justify-between px-2 py-1">
          {activeIndex > 0 && (
            <button
              onClick={handlePrevFile}
              className="rounded-full bg-black/50 p-1 text-white"
            >
              {'<'}
            </button>
          )}
          {activeIndex < files.length - 1 && (
            <button
              onClick={handleNextFile}
              className="ml-auto rounded-full bg-black/50 p-1 text-white"
            >
              {'>'}
            </button>
          )}
        </div>
      )}

      {renderFilePreview(files[activeIndex])}

      {files.length > 1 && (
        <div className="mt-1 flex justify-center space-x-1">
          {files.map((_, index) => (
            <div
              key={index}
              className={`size-1.5 rounded-full ${
                index === activeIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const MessageContent = ({ message }: { message: IMessage }) => {
  const files: FileMetaData[] = Array.isArray(message.meta_data)
    ? message.meta_data.map((file) => ({
        ...file,
        file_name: file.file_name || '',
        file_size: file.file_size || 0,
        file_type: file.file_type || '',
      }))
    : message.meta_data
      ? [message.meta_data]
      : []

  if (files.length === 0) {
    return message.text ? (
      <div className="whitespace-pre-wrap text-sm">{message.text}</div>
    ) : null
  }

  return (
    <div>
      <FileMediaPreview files={files} type={message.type} />
      {message.text && (
        <div className="mt-2 whitespace-pre-wrap text-sm">{message.text}</div>
      )}
    </div>
  )
}

const getTextMessageWidth = (text: string) => {
  if (!text) return 'auto'

  const length = text.length
  if (length <= 10) return 'auto'
  if (length < 20) return 'max-w-[200px]'
  if (length < 50) return 'max-w-[250px]'
  return 'max-w-[65%]'
}

const handleReplyClick = (parentId: number) => {
  const originalMessageElement = document.getElementById(`message-${parentId}`)

  if (originalMessageElement) {
    originalMessageElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })

    const messageBubble = originalMessageElement.querySelector('.rounded-2xl')

    if (messageBubble) {
      messageBubble.classList.add('animate-highlight')

      setTimeout(() => {
        messageBubble.classList.remove('animate-highlight')
      }, 2000)
    }
  }
}

const ReplyToPreview = ({
  parent,
  message,
}: {
  parent: IMessage
  message: IMessage
}) => {
  const { user } = useAuthStore()

  if (!parent) return null
  const isSelfReply = parent.senderId === message.senderId

  const isCurrentUserReplying = message.senderId === user?.id

  let replyText = ''

  if (isCurrentUserReplying) {
    if (isSelfReply) {
      replyText = 'Bạn đã trả lời chính mình'
    } else {
      replyText = `Bạn đã trả lời ${getLastName(parent.sender.name)}`
    }
  } else {
    if (parent.senderId === user?.id) {
      replyText = `${getLastName(message.sender.name)} đã trả lời bạn`
    } else if (isSelfReply) {
      replyText = `${getLastName(message.sender.name)} đã trả lời chính mình`
    } else {
      replyText = `${getLastName(message.sender.name)} đã trả lời ${getLastName(parent.sender.name)}`
    }
  }

  return (
    <div className="mb-1 max-w-xs rounded-lg px-3 py-1.5 text-xs text-gray-600">
      <div className="flex items-center gap-2">
        <div className="h-4 w-0.5 rounded bg-gray-300"></div>
        <div className="flex flex-1 cursor-pointer items-center gap-1 overflow-hidden">
          <span
            onClick={() => handleReplyClick(parent.id)}
            className="font-medium"
          >
            {replyText}
          </span>
          <span className="truncate">
            {parent.type === 'text' && parent.content}
            {parent.type === 'image' && 'Hình ảnh'}
            {parent.type === 'video' && 'Video'}
            {parent.type === 'file' &&
              (parent.meta_data?.file_name || 'File đính kèm')}
          </span>
        </div>
      </div>
    </div>
  )
}

const EnhancedMessageItem = ({
  message,
  isCurrentUser,
  isGroupChat,
  onReply,
}: MessageItemProps) => {
  const [showReplyButton, setShowReplyButton] = useState(false)
  const isTextMessage = message.type === 'text'
  const textWidth = isTextMessage ? getTextMessageWidth(message.text) : ''
  const hasReplyTo = message.parent !== null

  return (
    <div
      id={`message-${message.id}`}
      className={`mr-4 flex items-start gap-3 ${isCurrentUser ? 'justify-end' : ''}`}
      onMouseEnter={() => setShowReplyButton(true)}
      onMouseLeave={() => setShowReplyButton(false)}
    >
      {!isCurrentUser && (
        <Avatar className="size-8">
          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
          <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} ${textWidth}`}
      >
        {hasReplyTo && (
          <ReplyToPreview
            message={message}
            parent={message?.parent as IMessage}
          />
        )}

        {isGroupChat && !isCurrentUser && (
          <div className="mb-1 text-sm font-medium text-gray-600">
            {getLastName(message.sender.name)}
          </div>
        )}

        <div
          className={`relative rounded-2xl ${
            isTextMessage
              ? `px-3 py-2 ${
                  isCurrentUser
                    ? 'min-w-[36px] bg-orange-500 text-center text-white'
                    : 'min-w-[36px] border border-gray-100 bg-gray-100 text-center text-gray-800'
                }`
              : ''
          }`}
        >
          <MessageContent message={message} />

          {showReplyButton && (
            <div
              className={`absolute ${isCurrentUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-y-1/2`}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onReply(message)}
                      className="mx-2 flex size-6 items-center justify-center rounded-full bg-secondary shadow-sm hover:bg-secondary/80"
                    >
                      <Reply className="size-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side={isCurrentUser ? 'left' : 'right'}>
                    <p>Phản hồi</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        <span className="mt-2 text-xs text-gray-500">{message.timestamp}</span>
      </div>
    </div>
  )
}

interface ReplyPreviewProps {
  message: IMessage | null
  onClear: () => void
  isReplyingToSelf: boolean
}

const ReplyPreview = ({
  message,
  onClear,
  isReplyingToSelf,
}: ReplyPreviewProps) => {
  if (!message) return null

  return (
    <div className="flex items-center justify-between rounded bg-secondary/50 p-2 px-3">
      <div className="flex items-center gap-2">
        <div className="h-full w-1 rounded bg-orange-500"></div>
        <div>
          <p className="text-xs text-muted-foreground">
            Đang phản hồi{' '}
            <span className="font-medium text-gray-700">
              {isReplyingToSelf ? 'tin nhắn của bạn' : message.sender.name}
            </span>
          </p>
          <p className="max-w-lg truncate text-sm">
            {message.type === 'text' && message.text}
            {message.type === 'image' && 'Hình ảnh'}
            {message.type === 'video' && 'Video'}
            {message.type === 'file' &&
              (message.meta_data?.file_name || 'File đính kèm')}
          </p>
        </div>
      </div>
      <button onClick={onClear} className="rounded-full p-1 hover:bg-gray-200">
        <X size="12" />
      </button>
    </div>
  )
}

export { EnhancedMessageItem, ReplyPreview }
