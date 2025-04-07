import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot,
  BotMessageSquare,
  ChevronDown,
  Copy,
  Minimize,
  RotateCcw,
  Send,
  User,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isMinimized, setIsMinimized] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Xin chào! Tôi là trợ lý AI, tôi có thể giúp gì cho bạn về bài học này?',
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputValue, setInputValue] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  const toggleChat = (): void => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = (): void => {
    setIsMinimized(!isMinimized)
  }

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isOpen, isMinimized, messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`
    }
  }, [inputValue])

  const handleSendMessage = (): void => {
    if (inputValue.trim() === '') return

    setMessages([
      ...messages,
      {
        role: 'user',
        content: inputValue,
        timestamp: new Date().toISOString(),
      },
    ])
    setInputValue('')
    setIsTyping(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Đây là phản hồi từ AI trợ giúp. Trong triển khai thực tế, bạn sẽ gọi API để lấy phản hồi từ model AI.',
          timestamp: new Date().toISOString(),
        },
      ])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  const clearChat = (): void => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Xin chào! Tôi là trợ lý AI, tôi có thể giúp gì cho bạn về bài học này?',
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const copyMessage = (content: string): void => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log('Text copied')
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err)
      })
  }

  const messageBubbleVariants = {
    hidden: (role: string) => ({
      opacity: 0,
      x: role === 'user' ? 20 : -20,
      scale: 0.8,
    }),
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 40,
        mass: 1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  const chatWindowVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <div className="fixed bottom-4 left-6 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={toggleChat}
                className="rounded-full bg-primary p-3.5 text-white shadow-lg transition-all duration-300"
                size="icon"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="relative flex size-6 items-center justify-center"
                >
                  <BotMessageSquare
                    size={24}
                    className={cn(
                      'absolute transition-opacity',
                      isOpen ? 'opacity-0' : 'opacity-100'
                    )}
                  />
                  <X
                    size={24}
                    className={cn(
                      'absolute transition-opacity',
                      isOpen ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </motion.div>
                <span className="sr-only">
                  {isOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'}
                </span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            className={cn(
              'absolute bottom-16 left-0 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'
            )}
            style={{
              boxShadow:
                '0 12px 28px rgba(0, 0, 0, 0.12), 0 8px 12px rgba(0, 0, 0, 0.08)',
              width: isMinimized ? '320px' : '360px',
              height: isMinimized ? '56px' : '500px',
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatWindowVariants}
            transition={{
              height: { type: 'spring', stiffness: 500, damping: 30 },
              width: { type: 'spring', stiffness: 500, damping: 30 },
            }}
          >
            <motion.div
              className="flex cursor-pointer items-center justify-between rounded-t-2xl bg-gradient-to-r from-primary/95 to-primary p-3"
              onClick={isMinimized ? toggleMinimize : undefined}
              whileHover={isMinimized ? { y: -2 } : undefined}
              whileTap={isMinimized ? { y: 0 } : undefined}
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Bot size={18} className="text-white" />
                </motion.div>
                <div>
                  <motion.h3
                    className="font-medium text-white"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Trợ lý AI
                  </motion.h3>
                  <AnimatePresence>
                    {!isMinimized && (
                      <motion.p
                        className="text-xs text-white/80"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Hỗ trợ bài học của bạn
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <AnimatePresence>
                  {!isMinimized && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-full p-0 text-white hover:bg-white/20"
                              onClick={(e) => {
                                e.stopPropagation()
                                clearChat()
                              }}
                            >
                              <RotateCcw size={15} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Xóa cuộc trò chuyện
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  )}
                </AnimatePresence>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-full p-0 text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMinimize()
                        }}
                      >
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: isMinimized ? 180 : 0 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          {isMinimized ? (
                            <ChevronDown size={16} />
                          ) : (
                            <Minimize size={15} />
                          )}
                        </motion.div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-full p-0 text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleChat()
                        }}
                      >
                        <X size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Đóng</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>

            <AnimatePresence>
              {!isMinimized && (
                <>
                  <motion.div
                    className="flex-1 overflow-y-auto bg-gray-50/80 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatePresence initial={false}>
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          className={cn(
                            'group mb-6 flex',
                            message.role === 'user'
                              ? 'justify-end'
                              : 'justify-start'
                          )}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={messageBubbleVariants}
                          custom={message.role}
                          transition={{ delay: index * 0.05 }}
                        >
                          {message.role === 'assistant' && (
                            <Avatar className="mr-2.5 mt-0.5 flex size-8 items-center justify-center border border-white bg-primary shadow-sm">
                              <Bot size={16} className="text-white" />
                            </Avatar>
                          )}

                          <div
                            className={cn(
                              'flex max-w-[75%] flex-col',
                              message.role === 'user'
                                ? 'items-end'
                                : 'items-start'
                            )}
                          >
                            <div
                              className={cn(
                                'relative rounded-2xl p-3.5 text-sm shadow-sm',
                                message.role === 'user'
                                  ? 'rounded-tr-none bg-gradient-to-br from-primary/95 to-primary text-white'
                                  : 'rounded-tl-none border bg-white text-gray-800'
                              )}
                            >
                              {message.content}

                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileHover={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="absolute -right-1.5 -top-1.5"
                              >
                                <Button
                                  onClick={() => copyMessage(message.content)}
                                  className="size-6 rounded-full border border-gray-200 bg-white p-0 text-gray-500 shadow-sm"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <Copy size={12} />
                                </Button>
                              </motion.div>
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 px-1">
                              <motion.span
                                className="text-xs text-gray-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                {formatMessageTime(message.timestamp)}
                              </motion.span>
                            </div>
                          </div>

                          {message.role === 'user' && (
                            <Avatar className="ml-2.5 mt-0.5 flex size-8 items-center justify-center border border-white bg-gray-100 shadow-sm">
                              <User size={15} className="text-gray-500" />
                            </Avatar>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isTyping && (
                      <motion.div
                        className="mb-6 flex justify-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <Avatar className="mr-2.5 mt-0.5 flex size-8 items-center justify-center border border-white bg-primary shadow-sm">
                          <Bot size={16} className="text-white" />
                        </Avatar>
                        <div className="max-w-[75%] rounded-2xl rounded-tl-none border bg-white p-3.5 text-sm shadow-sm">
                          <div className="flex gap-1.5">
                            <motion.span
                              className="text-lg text-primary"
                              animate={{
                                y: [0, -5, 0],
                              }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: 'loop',
                              }}
                            >
                              •
                            </motion.span>
                            <motion.span
                              className="text-lg text-primary"
                              animate={{
                                y: [0, -5, 0],
                              }}
                              transition={{
                                duration: 0.6,
                                delay: 0.2,
                                repeat: Infinity,
                                repeatType: 'loop',
                              }}
                            >
                              •
                            </motion.span>
                            <motion.span
                              className="text-lg text-primary"
                              animate={{
                                y: [0, -5, 0],
                              }}
                              transition={{
                                duration: 0.6,
                                delay: 0.4,
                                repeat: Infinity,
                                repeatType: 'loop',
                              }}
                            >
                              •
                            </motion.span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </motion.div>

                  <motion.div
                    className="border-t bg-white p-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.div
                      className="flex items-end gap-2 rounded-xl border bg-white p-2.5 pl-3.5 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50"
                      whileTap={{ scale: 0.995 }}
                    >
                      <textarea
                        ref={(el) => {
                          inputRef.current = el
                          textareaRef.current = el
                        }}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Nhập câu hỏi của bạn..."
                        className="h-8 max-h-28 min-h-8 w-full flex-1 resize-none border-0 bg-transparent text-sm outline-none"
                        rows={1}
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleSendMessage}
                          disabled={inputValue.trim() === '' || isTyping}
                          className="size-9 shrink-0 rounded-lg p-0"
                          size="icon"
                          variant={
                            inputValue.trim() === '' || isTyping
                              ? 'secondary'
                              : 'default'
                          }
                        >
                          <Send
                            size={16}
                            className={
                              inputValue.trim() === '' || isTyping
                                ? 'text-gray-400'
                                : ''
                            }
                          />
                        </Button>
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className="mt-2 text-center text-xs text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      transition={{ delay: 0.3 }}
                    >
                      Nhấn Enter để gửi, Shift+Enter để xuống dòng
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AIChatAssistant
