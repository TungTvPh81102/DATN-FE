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
  History,
  Minimize,
  Plus,
  RotateCcw,
  Send,
  User,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useClearChatAi, useSendMessageAi } from '@/hooks/ai/useAi'
import { MessageAi } from '@/types/Ai'
import { v4 as uuidv4 } from 'uuid'
import {
  formatDate,
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@/lib/common'

interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  context: string
  messages: MessageAi[]
}

interface AIChatAssistantProps {
  courseName?: string
  lessonTitle?: string
}

const AIChatAssistant = ({
  courseName = '',
  lessonTitle = '',
}: AIChatAssistantProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isMinimized, setIsMinimized] = useState<boolean>(false)
  const [showSessionList, setShowSessionList] = useState<boolean>(false)

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  const [messages, setMessages] = useState<MessageAi[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [context, setContext] = useState<string>('')
  const [sessionStarted, setSessionStarted] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  const { mutate: sendMessageAi } = useSendMessageAi()
  const { mutate: clearChatAi } = useClearChatAi()

  useEffect(() => {
    const storedSessions = getLocalStorage<ChatSession[]>('chatSessions')
    if (storedSessions) {
      setChatSessions(storedSessions)

      const lastSessionId = getLocalStorage<string>('lastActiveSessionId')
      if (lastSessionId) {
        const lastSession = storedSessions.find(
          (s: ChatSession) => s.id === lastSessionId
        )
        if (lastSession) {
          setCurrentSessionId(lastSessionId)
          setMessages(lastSession.messages)
          setContext(lastSession.context)
          setSessionStarted(true)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (chatSessions.length > 0) {
      setLocalStorage('chatSessions', chatSessions)
    }

    if (currentSessionId) {
      setLocalStorage('lastActiveSessionId', currentSessionId)
    }
  }, [chatSessions, currentSessionId])

  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      setChatSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages,
                updatedAt: new Date().toISOString(),
              }
            : session
        )
      )
    }
  }, [messages, currentSessionId])

  const toggleChat = (): void => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
      setShowSessionList(false)
    }
  }

  const toggleMinimize = (): void => {
    setIsMinimized(!isMinimized)
    if (!isMinimized) {
      setShowSessionList(false)
    }
  }

  const toggleSessionList = (): void => {
    setShowSessionList(!showSessionList)
  }

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
      if (inputRef.current && sessionStarted && !showSessionList) {
        inputRef.current.focus()
      }
    }
  }, [isOpen, isMinimized, messages, sessionStarted, showSessionList])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`
    }
  }, [inputValue])

  const createNewChatSession = async (): Promise<void> => {
    const lessonContext = `Course: ${courseName}; Lesson: ${lessonTitle}`
    const initialMessage: MessageAi = {
      role: 'assistant',
      content: `Xin chào! Tôi là trợ lý AI, tôi có thể giúp gì cho bạn về bài học "${lessonTitle}" trong khóa học "${courseName}"?`,
      timestamp: new Date().toISOString(),
    }

    const newSessionId = uuidv4()
    const newSession: ChatSession = {
      id: newSessionId,
      title: `Hỏi đáp về "${lessonTitle}"`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      context: lessonContext,
      messages: [initialMessage],
    }

    setChatSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSessionId)
    setContext(lessonContext)
    setMessages([initialMessage])
    setSessionStarted(true)
    setShowSessionList(false)
  }

  const selectChatSession = (sessionId: string): void => {
    const session = chatSessions.find((s) => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
      setContext(session.context)
      setSessionStarted(true)
      setShowSessionList(false)
    }
  }

  const deleteChatSession = (sessionId: string, e: React.MouseEvent): void => {
    e.stopPropagation()

    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId))

    if (currentSessionId === sessionId) {
      if (chatSessions.length > 1) {
        const otherSession = chatSessions.find((s) => s.id !== sessionId)
        if (otherSession) {
          setCurrentSessionId(otherSession.id)
          setMessages(otherSession.messages)
          setContext(otherSession.context)
        } else {
          resetChat()
        }
      } else {
        resetChat()
      }
    }
  }

  const handleSendMessage = async (): Promise<void> => {
    if (inputValue.trim() === '') return

    const userMessage: MessageAi = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInputValue('')
    setIsTyping(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    sendMessageAi(
      {
        message: inputValue,
        context,
        course_name: courseName,
        lesson_title: lessonTitle,
      },
      {
        onSuccess: (data) => {
          const aiMessage = {
            role: 'assistant' as const,
            content: data.reply,
            timestamp: new Date().toISOString(),
          }
          setMessages((prevMessages) => [...prevMessages, aiMessage])
          setIsTyping(false)

          if (currentSessionId) {
            setChatSessions((prev) =>
              prev.map((session) =>
                session.id === currentSessionId && session.messages.length <= 1
                  ? {
                      ...session,
                      title: generateSessionTitle(inputValue),
                    }
                  : session
              )
            )
          }
        },
        onError: () => {
          const aiMessage = {
            role: 'assistant' as const,
            content:
              'Rất tiếc, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.',
            timestamp: new Date().toISOString(),
          }
          setMessages((prevMessages) => [...prevMessages, aiMessage])
          setIsTyping(false)
        },
      }
    )
  }

  const generateSessionTitle = (firstMessage: string): string => {
    const maxLength = 30
    return firstMessage.length > maxLength
      ? `${firstMessage.substring(0, maxLength)}...`
      : firstMessage
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

  const resetChat = (): void => {
    setCurrentSessionId(null)
    setMessages([])
    setContext('')
    setSessionStarted(false)
    removeLocalStorage('lastActiveSessionId')
  }

  const clearChat = (): void => {
    clearChatAi(undefined, {
      onSuccess: () => {
        if (currentSessionId) {
          setChatSessions((prev) =>
            prev.filter((s) => s.id !== currentSessionId)
          )
        }
        resetChat()
      },
    })
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

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
      },
    }),
    hover: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      x: 5,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="absolute right-14 top-1/2 flex -translate-y-1/2 gap-2">
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
              'absolute bottom-16 right-0 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'
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
                  {!isMinimized && sessionStarted && (
                    <>
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
                                  toggleSessionList()
                                }}
                              >
                                <History size={15} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              Danh sách trò chuyện
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>

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
                    </>
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
                  {showSessionList ? (
                    <motion.div
                      className="flex h-full flex-col"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between border-b p-3">
                        <h3 className="text-sm font-medium">
                          Danh sách cuộc trò chuyện
                        </h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full p-0"
                                onClick={createNewChatSession}
                              >
                                <Plus size={18} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              Tạo cuộc trò chuyện mới
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="flex-1 overflow-y-auto p-2">
                        {chatSessions.length > 0 ? (
                          <AnimatePresence initial={false}>
                            {chatSessions.map((session, index) => (
                              <motion.div
                                key={session.id}
                                className={cn(
                                  'flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors',
                                  currentSessionId === session.id
                                    ? 'bg-primary/10'
                                    : 'hover:bg-gray-100'
                                )}
                                variants={listItemVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                custom={index}
                                onClick={() => selectChatSession(session.id)}
                              >
                                <div className="flex-1 overflow-hidden">
                                  <div className="truncate font-medium">
                                    {session.title}
                                  </div>
                                  <div className="mt-1 text-xs text-gray-500">
                                    {formatDate(session.updatedAt, {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </div>
                                </div>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-2 size-6 shrink-0 rounded-full p-0 opacity-60 hover:bg-gray-200 hover:opacity-100"
                                        onClick={(e) =>
                                          deleteChatSession(session.id, e)
                                        }
                                      >
                                        <X size={14} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                      Xóa cuộc trò chuyện
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                            <History size={40} className="mb-3 opacity-40" />
                            <p>Chưa có cuộc trò chuyện nào</p>
                            <Button
                              onClick={createNewChatSession}
                              className="mt-4"
                              variant="outline"
                              size="sm"
                            >
                              <Plus size={16} className="mr-1" />
                              Tạo mới
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="border-t p-3">
                        <Button
                          onClick={() => setShowSessionList(false)}
                          className="w-full"
                          variant={
                            chatSessions.length === 0 ? 'default' : 'outline'
                          }
                        >
                          {chatSessions.length === 0
                            ? 'Tạo cuộc trò chuyện mới'
                            : 'Quay lại'}
                        </Button>
                      </div>
                    </motion.div>
                  ) : !sessionStarted ? (
                    <motion.div
                      className="flex h-full flex-col items-center justify-center p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="flex size-20 items-center justify-center rounded-full bg-primary/10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Bot size={36} className="text-primary" />
                      </motion.div>
                      <h3 className="mt-4 text-lg font-medium">
                        Trợ lý AI cho bài học của bạn
                      </h3>
                      <p className="mb-6 mt-2 text-center text-sm text-gray-500">
                        Đặt câu hỏi về bài học &#34;{lessonTitle}&#34; trong
                        khóa học &#34;{courseName}&#34;
                      </p>
                      <Button
                        onClick={createNewChatSession}
                        className="rounded-full px-6 py-2"
                        size="lg"
                      >
                        Bắt đầu
                      </Button>

                      {chatSessions.length > 0 && (
                        <Button
                          onClick={() => setShowSessionList(true)}
                          className="mt-3"
                          variant="outline"
                          size="sm"
                        >
                          <History size={16} className="mr-1.5" />
                          Xem các cuộc trò chuyện trước
                        </Button>
                      )}
                    </motion.div>
                  ) : (
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
                                      onClick={() =>
                                        copyMessage(message.content)
                                      }
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
                          <div className="flex items-center justify-center text-xs text-gray-500">
                            <Bot size={14} className="mr-1" />
                            <span>
                              Nhấn Enter để gửi, Shift+Enter để xuống dòng
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    </>
                  )}
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
