// 'use client'
//
// import { useState, useRef, useEffect } from 'react'
// import {
//   Send,
//   ArrowDown,
//   Loader2,
//   X,
//   ChevronDown,
//   ChevronUp,
//   Plus,
//   Sparkles,
//   Save,
//   Check,
//   Edit,
// } from 'lucide-react'
// import { AnimatePresence, motion } from 'framer-motion'
// import ReactMarkdown from 'react-markdown'
//
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetClose,
//   SheetFooter,
// } from '@/components/ui/sheet'
// import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion'
// import api from '@/configs/api'
// import { toast } from 'react-toastify'
//
// // Types
// interface Message {
//   id: string
//   content: string
//   role: 'user' | 'assistant'
//   timestamp: Date
//   hasStructure?: boolean
// }
//
// interface Course {
//   id: number
//   title: string
//   slug: string
// }
//
// interface PromptTemplate {
//   id: number
//   title: string
//   content: string
// }
//
// interface Chapter {
//   order: number
//   title: string
//   lessons: Lesson[]
// }
//
// interface Lesson {
//   order: number
//   title: string
//   type: string
//   description: string
// }
//
// interface CourseStructure {
//   chapters: Chapter[]
// }
//
// const defaultPromptTemplates: PromptTemplate[] = [
//   {
//     id: 1,
//     title: 'Tạo đề cương khóa học',
//     content:
//       'Hãy giúp tôi lên đề cương cho khóa học "{courseTitle}" với {numChapters} chương. Mỗi chương cần bao gồm các bài học lý thuyết, video demo và bài tập thực hành.',
//   },
//   {
//     id: 2,
//     title: 'Thiết kế bài quiz',
//     content:
//       'Hãy tạo 5 câu hỏi trắc nghiệm cho chương "{chapterTitle}" trong khóa học của tôi, mỗi câu có 4 lựa chọn và giải thích chi tiết đáp án đúng.',
//   },
//   {
//     id: 3,
//     title: 'Ý tưởng bài tập coding',
//     content:
//       'Tôi cần một bài tập lập trình thực tế cho chủ đề "{topicTitle}". Hãy đưa ra yêu cầu chi tiết, các gợi ý và tiêu chí đánh giá bài nộp.',
//   },
// ]
//
// const lessonTypeLabels = {
//   document: 'Tài liệu',
//   video: 'Video',
//   quiz: 'Bài kiểm tra',
//   coding: 'Bài tập code',
// }
//
// const CoursePlanningAIAssistant = ({
//   currentCourse,
// }: {
//   currentCourse?: string | Course
// }) => {
//   const [messages, setMessages] = useState<Message[]>([])
//   const [inputValue, setInputValue] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [isChatOpen, setIsChatOpen] = useState(false)
//   const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>(
//     defaultPromptTemplates
//   )
//   const [isPromptMenuOpen, setIsPromptMenuOpen] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const [customPrompt, setCustomPrompt] = useState('')
//   const [customPromptTitle, setCustomPromptTitle] = useState('')
//   const [showAddPrompt, setShowAddPrompt] = useState(false)
//
//   // New state variables for structure implementation
//   const [showStructureDialog, setShowStructureDialog] = useState(false)
//   const [courseStructure, setCourseStructure] =
//     useState<CourseStructure | null>(null)
//   const [appliedMessage, setAppliedMessage] = useState<Message | null>(null)
//   const [isApplying, setIsApplying] = useState(false)
//   const [editingChapter, setEditingChapter] = useState<{
//     index: number
//     title: string
//   } | null>(null)
//   const [editingLesson, setEditingLesson] = useState<{
//     chapterIndex: number
//     lessonIndex: number
//     field: string
//     value: string
//   } | null>(null)
//
//   // Get course title whether currentCourse is a string or object
//   const getCourseTitle = () => {
//     if (typeof currentCourse === 'string') {
//       return currentCourse
//     } else if (currentCourse && typeof currentCourse === 'object') {
//       return currentCourse.title
//     }
//     return ''
//   }
//
//   // Function to detect if message contains a course structure
//   const detectCourseStructure = (content: string): boolean => {
//     // Simple pattern matching for chapter/lesson structure
//     const chapterPattern = /(?:Chương|Chapter)\s+\d+:/i
//     const lessonPattern = /(?:Bài|Lesson)\s+\d+:/i
//
//     return chapterPattern.test(content) && lessonPattern.test(content)
//   }
//
//   // Parse message for course structure
//   const parseMessageForStructure = async (message: Message) => {
//     // if (!message.content.trim() || !detectCourseStructure(message.content))
//     //   return null
//
//     try {
//       const courseId =
//         typeof currentCourse === 'object' ? currentCourse?.id : undefined
//
//       // Call API to preview the structure
//       const response = await api.post('ai/apply-recommendation', {
//         courseId: 194,
//         recommendation: message.content,
//         type: 'preview', // Just preview the structure without applying
//       })
//
//       // if (response?.structure) {
//       //   return response.structure
//       // }
//     } catch (error) {
//       console.error('Error parsing structure:', error)
//     }
//     return null
//   }
//
//   // Handle applying structure to database
//   const applyStructureToDatabase = async () => {
//     if (!appliedMessage || !courseStructure) return
//
//     try {
//       setIsApplying(true)
//       const courseId =
//         typeof currentCourse === 'object' ? currentCourse?.id : undefined
//
//       // Gọi API để áp dụng cấu trúc
//       const response = await api.post('ai/apply-recommendation', {
//         courseId: 194,
//         recommendation: appliedMessage.content,
//         type: 'apply',
//         structure: courseStructure, // Gửi cấu trúc đã chỉnh sửa
//       })
//
//       if (response?.data?.message) {
//         // toast({
//         //   title: 'Thành công',
//         //   description: 'Đã áp dụng cấu trúc khóa học thành công',
//         // })
//         setShowStructureDialog(false)
//       }
//     } catch (error) {
//       console.error('Error applying structure:', error)
//       // toast({
//       //   title: 'Lỗi',
//       //   description: `Không thể áp dụng cấu trúc khóa học: ${error.response?.data?.error || error.message}`,
//       //   variant: 'destructive',
//       // })
//     } finally {
//       setIsApplying(false)
//     }
//   }
//
//   // Scroll to bottom whenever messages change
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
//     }
//   }, [messages])
//
//   // Initialize chat with a welcome message when opened
//   useEffect(() => {
//     if (isChatOpen && messages.length === 0) {
//       const courseTitle = getCourseTitle()
//       setMessages([
//         {
//           id: 'welcome',
//           content: `Xin chào! Tôi là Trợ lý AI cho việc lập kế hoạch khóa học. Tôi có thể giúp bạn:\n\n- Thiết kế cấu trúc chương và bài học\n- Tạo ý tưởng cho nội dung bài giảng\n- Đề xuất bài tập và quiz\n- Tối ưu lộ trình học tập\n\n${courseTitle ? `Bạn đang làm việc với khóa học: **${courseTitle}**. ` : ''}Bạn cần hỗ trợ gì cho khóa học của mình?`,
//           role: 'assistant',
//           timestamp: new Date(),
//         },
//       ])
//     }
//   }, [isChatOpen, currentCourse])
//
//   const handleSendMessage = async () => {
//     if (!inputValue.trim()) return
//
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: inputValue,
//       role: 'user',
//       timestamp: new Date(),
//     }
//
//     setMessages((prev) => [...prev, userMessage])
//     setInputValue('')
//     setIsLoading(true)
//
//     try {
//       const courseId =
//         typeof currentCourse === 'object' ? currentCourse?.id : undefined
//
//       const data = await api.post('ai/course-planning', {
//         message: inputValue,
//         courseId: courseId,
//         history: messages,
//         hasStructure: true,
//       })
//
//       const aiMessage: Message = {
//         id: Date.now().toString() + '-ai',
//         content: data?.data,
//         role: 'assistant',
//         timestamp: new Date(),
//       }
//
//       // Check if the message contains a course structure
//       const hasStructure = detectCourseStructure(aiMessage.content)
//       aiMessage.hasStructure = hasStructure
//
//       setMessages((prev) => [...prev, aiMessage])
//
//       // If structure is detected, prepare for showing the dialog
//       // if (hasStructure) {
//       const structure = await parseMessageForStructure(aiMessage)
//       console.log(structure)
//       if (structure) {
//         setCourseStructure(structure)
//         setAppliedMessage(aiMessage)
//       }
//       // }
//     } catch (error) {
//       console.error('Error getting AI response:', error)
//
//       // Add error message
//       const errorMessage: Message = {
//         id: Date.now().toString() + '-error',
//         content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
//         role: 'assistant',
//         timestamp: new Date(),
//       }
//
//       setMessages((prev) => [...prev, errorMessage])
//     } finally {
//       setIsLoading(false)
//     }
//   }
//
//   // Updated to handle showing the structure from any message
//   const handleShowStructure = async (message: Message) => {
//     setIsLoading(true)
//     const structure = await parseMessageForStructure(message)
//     console.log(structure)
//     if (structure) {
//       setCourseStructure(structure)
//       setAppliedMessage(message)
//       setShowStructureDialog(true)
//     } else {
//       // toast({
//       //   title: 'Không thể xử lý',
//       //   description: 'Không thể phân tích cấu trúc khóa học từ nội dung',
//       //   variant: 'destructive',
//       // })
//     }
//     setIsLoading(false)
//   }
//
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       handleSendMessage()
//     }
//   }
//
//   const usePromptTemplate = (template: PromptTemplate) => {
//     let processedContent = template.content
//
//     const courseTitle = getCourseTitle()
//     if (courseTitle) {
//       processedContent = processedContent.replace('{courseTitle}', courseTitle)
//     }
//
//     setInputValue(processedContent)
//     setIsPromptMenuOpen(false)
//   }
//
//   const saveCustomPrompt = () => {
//     if (!customPrompt.trim() || !customPromptTitle.trim()) return
//
//     const newTemplate: PromptTemplate = {
//       id: Date.now(),
//       title: customPromptTitle,
//       content: customPrompt,
//     }
//
//     setPromptTemplates([...promptTemplates, newTemplate])
//     setCustomPrompt('')
//     setCustomPromptTitle('')
//     setShowAddPrompt(false)
//   }
//
//   // Functions to update structure
//   const updateChapterTitle = (index: number, newTitle: string) => {
//     if (!courseStructure) return
//     const updatedStructure = { ...courseStructure }
//     updatedStructure.chapters[index].title = newTitle
//     setCourseStructure(updatedStructure)
//     setEditingChapter(null)
//   }
//
//   const updateLessonField = (
//     chapterIndex: number,
//     lessonIndex: number,
//     field: string,
//     value: string
//   ) => {
//     if (!courseStructure) return
//     const updatedStructure = { ...courseStructure }
//
//     if (field === 'title') {
//       updatedStructure.chapters[chapterIndex].lessons[lessonIndex].title = value
//     } else if (field === 'type') {
//       updatedStructure.chapters[chapterIndex].lessons[lessonIndex].type = value
//     } else if (field === 'description') {
//       updatedStructure.chapters[chapterIndex].lessons[lessonIndex].description =
//         value
//     }
//
//     setCourseStructure(updatedStructure)
//     setEditingLesson(null)
//   }
//
//   // Component for the messaging area
//   const ChatMessages = () => (
//     <div className="flex-1 overflow-y-auto px-4 py-6">
//       <div className="space-y-6">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`max-w-[80%] rounded-lg p-4 ${
//                 message.role === 'user'
//                   ? 'bg-primary text-primary-foreground'
//                   : 'bg-muted'
//               }`}
//             >
//               <ReactMarkdown>{message.content}</ReactMarkdown>
//               <div className="mt-2 flex items-center justify-between gap-2">
//                 <span
//                   className={`text-xs ${
//                     message.role === 'user'
//                       ? 'text-primary-foreground/70'
//                       : 'text-muted-foreground'
//                   }`}
//                 >
//                   {message.timestamp.toLocaleTimeString([], {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}
//                 </span>
//
//                 {!message.hasStructure && message.role === 'assistant' && (
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     className="h-6 px-2 text-xs"
//                     onClick={() => handleShowStructure(message)}
//                   >
//                     <Save size={12} className="mr-1" />
//                     Áp dụng cấu trúc
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="flex justify-start">
//             <div className="max-w-[80%] rounded-lg bg-muted p-4">
//               <div className="flex items-center space-x-2">
//                 <Loader2 className="size-4 animate-spin" />
//                 <span>AI đang soạn câu trả lời...</span>
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//     </div>
//   )
//
//   return (
//     <>
//       {/* Wrap the ChatButton and ExpandedChat in a single Sheet component */}
//       <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
//         {/* Chat button floating in corner */}
//         <div className="fixed bottom-6 right-6 z-50">
//           <SheetTrigger asChild>
//             <Button
//               size="lg"
//               className="size-14 rounded-full shadow-lg"
//               onClick={() => setIsChatOpen(true)}
//             >
//               <Sparkles size={24} />
//             </Button>
//           </SheetTrigger>
//         </div>
//
//         {/* Expanded chat UI */}
//         <SheetContent
//           side="right"
//           className="flex w-full flex-col p-0 sm:max-w-md md:max-w-lg"
//         >
//           <SheetHeader className="border-b px-4 py-3">
//             <div className="flex items-center justify-between">
//               <SheetTitle className="flex items-center gap-2">
//                 <Sparkles size={18} className="text-blue-500" />
//                 Trợ lý lập kế hoạch khóa học
//               </SheetTitle>
//               <SheetClose>
//                 <X
//                   size={18}
//                   className="text-muted-foreground transition-colors hover:text-foreground"
//                 />
//               </SheetClose>
//             </div>
//             {currentCourse && (
//               <Badge variant="outline" className="mt-1 text-xs">
//                 Khóa học: {getCourseTitle()}
//               </Badge>
//             )}
//           </SheetHeader>
//
//           <ChatMessages />
//
//           <SheetFooter className="gap-2 border-t p-4">
//             <div className="flex w-full flex-col space-y-2">
//               <div className="relative">
//                 <Textarea
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Hỏi về việc lập kế hoạch khóa học..."
//                   className="min-h-24 resize-none pr-12"
//                 />
//                 <Button
//                   size="icon"
//                   className="absolute bottom-2 right-2"
//                   onClick={handleSendMessage}
//                   disabled={!inputValue.trim() || isLoading}
//                 >
//                   <Send size={18} />
//                 </Button>
//               </div>
//
//               <div className="flex items-center justify-between">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="gap-1 text-xs"
//                   onClick={() => setIsPromptMenuOpen(!isPromptMenuOpen)}
//                 >
//                   <Sparkles size={14} />
//                   Gợi ý
//                   {isPromptMenuOpen ? (
//                     <ChevronUp size={14} />
//                   ) : (
//                     <ChevronDown size={14} />
//                   )}
//                 </Button>
//
//                 {messages.length > 1 && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="gap-1 text-xs"
//                     onClick={() =>
//                       messagesEndRef.current?.scrollIntoView({
//                         behavior: 'smooth',
//                       })
//                     }
//                   >
//                     <ArrowDown size={14} />
//                     Cuối cuộc trò chuyện
//                   </Button>
//                 )}
//               </div>
//
//               <AnimatePresence>
//                 {isPromptMenuOpen && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: 'auto', opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="overflow-hidden"
//                   >
//                     <div className="mt-2 rounded-md border bg-card">
//                       <div className="flex items-center justify-between border-b p-3">
//                         <h4 className="text-sm font-medium">Mẫu câu hỏi</h4>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="size-8 p-0"
//                           onClick={() => setShowAddPrompt(!showAddPrompt)}
//                         >
//                           <Plus size={16} />
//                         </Button>
//                       </div>
//
//                       {showAddPrompt && (
//                         <div className="border-b p-3">
//                           <Input
//                             placeholder="Tiêu đề mẫu câu hỏi"
//                             value={customPromptTitle}
//                             onChange={(e) =>
//                               setCustomPromptTitle(e.target.value)
//                             }
//                             className="mb-2 text-sm"
//                           />
//                           <Textarea
//                             placeholder="Nội dung mẫu câu hỏi..."
//                             value={customPrompt}
//                             onChange={(e) => setCustomPrompt(e.target.value)}
//                             className="mb-2 min-h-24 text-sm"
//                           />
//                           <div className="flex justify-end gap-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => setShowAddPrompt(false)}
//                             >
//                               Hủy
//                             </Button>
//                             <Button
//                               size="sm"
//                               onClick={saveCustomPrompt}
//                               disabled={
//                                 !customPrompt.trim() ||
//                                 !customPromptTitle.trim()
//                               }
//                             >
//                               Lưu
//                             </Button>
//                           </div>
//                         </div>
//                       )}
//
//                       <div className="max-h-48 overflow-y-auto p-1">
//                         {promptTemplates.map((template) => (
//                           <Button
//                             key={template.id}
//                             variant="ghost"
//                             className="h-auto w-full justify-start p-3 text-left text-sm"
//                             onClick={() => usePromptTemplate(template)}
//                           >
//                             {template.title}
//                           </Button>
//                         ))}
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </SheetFooter>
//         </SheetContent>
//       </Sheet>
//
//       {/* Course Structure Dialog */}
//       <Dialog open={showStructureDialog} onOpenChange={setShowStructureDialog}>
//         <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Cấu trúc khóa học</DialogTitle>
//           </DialogHeader>
//
//           <Tabs defaultValue="preview" className="mt-4">
//             <TabsList>
//               <TabsTrigger value="preview">Xem trước</TabsTrigger>
//               <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
//             </TabsList>
//
//             <TabsContent value="preview" className="mt-4">
//               {courseStructure && (
//                 <div className="space-y-4">
//                   {courseStructure.chapters.map((chapter, chapterIndex) => (
//                     <div
//                       key={chapterIndex}
//                       className="rounded-lg border bg-card p-4"
//                     >
//                       <h3 className="text-lg font-medium">
//                         Chương {chapter.order}: {chapter.title}
//                       </h3>
//
//                       <div className="mt-4 space-y-3">
//                         {chapter.lessons.map((lesson, lessonIndex) => (
//                           <div
//                             key={lessonIndex}
//                             className="rounded-md bg-muted p-3"
//                           >
//                             <div className="flex items-center justify-between">
//                               <h4 className="text-md font-medium">
//                                 Bài {lesson.order}: {lesson.title}
//                               </h4>
//                               <Badge>
//                                 {
//                                   lessonTypeLabels[
//                                     lesson.type as keyof typeof lessonTypeLabels
//                                   ]
//                                 }
//                               </Badge>
//                             </div>
//                             <p className="mt-2 text-sm text-muted-foreground">
//                               {lesson.description.length > 100
//                                 ? `${lesson.description.substring(0, 100)}...`
//                                 : lesson.description}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </TabsContent>
//
//             <TabsContent value="edit" className="mt-4">
//               {courseStructure && (
//                 <div className="space-y-4">
//                   <Accordion type="multiple" className="w-full">
//                     {courseStructure.chapters.map((chapter, chapterIndex) => (
//                       <AccordionItem
//                         key={chapterIndex}
//                         value={`chapter-${chapterIndex}`}
//                       >
//                         <AccordionTrigger className="px-4">
//                           <div className="flex flex-1 items-center justify-between pr-4">
//                             <div className="text-left">
//                               {editingChapter &&
//                               editingChapter.index === chapterIndex ? (
//                                 <div className="flex w-full items-center gap-2">
//                                   <Input
//                                     value={editingChapter.title}
//                                     onChange={(e) =>
//                                       setEditingChapter({
//                                         ...editingChapter,
//                                         title: e.target.value,
//                                       })
//                                     }
//                                     className="h-8 w-64"
//                                     autoFocus
//                                   />
//                                   <Button
//                                     size="sm"
//                                     variant="ghost"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       updateChapterTitle(
//                                         chapterIndex,
//                                         editingChapter.title
//                                       )
//                                     }}
//                                   >
//                                     <Check size={16} />
//                                   </Button>
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center gap-2">
//                                   <span className="text-md font-medium">
//                                     Chương {chapter.order}: {chapter.title}
//                                   </span>
//                                   <Button
//                                     size="sm"
//                                     variant="ghost"
//                                     className="size-6 p-0"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       setEditingChapter({
//                                         index: chapterIndex,
//                                         title: chapter.title,
//                                       })
//                                     }}
//                                   >
//                                     <Edit size={12} />
//                                   </Button>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </AccordionTrigger>
//
//                         <AccordionContent className="space-y-3 px-4 pb-4">
//                           {chapter.lessons.map((lesson, lessonIndex) => (
//                             <div
//                               key={lessonIndex}
//                               className="rounded-md border bg-card p-3"
//                             >
//                               <div className="mb-2 flex items-center justify-between">
//                                 {/* Lesson title */}
//                                 {editingLesson &&
//                                 editingLesson.chapterIndex === chapterIndex &&
//                                 editingLesson.lessonIndex === lessonIndex &&
//                                 editingLesson.field === 'title' ? (
//                                   <div className="flex items-center gap-2">
//                                     <Input
//                                       value={editingLesson.value}
//                                       onChange={(e) =>
//                                         setEditingLesson({
//                                           ...editingLesson,
//                                           value: e.target.value,
//                                         })
//                                       }
//                                       className="h-8 w-64"
//                                       autoFocus
//                                     />
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       onClick={() =>
//                                         updateLessonField(
//                                           chapterIndex,
//                                           lessonIndex,
//                                           'title',
//                                           editingLesson.value
//                                         )
//                                       }
//                                     >
//                                       <Check size={16} />
//                                     </Button>
//                                   </div>
//                                 ) : (
//                                   <div className="flex items-center gap-2">
//                                     <h4 className="text-md font-medium">
//                                       Bài {lesson.order}: {lesson.title}
//                                     </h4>
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       className="size-6 p-0"
//                                       onClick={() =>
//                                         setEditingLesson({
//                                           chapterIndex,
//                                           lessonIndex,
//                                           field: 'title',
//                                           value: lesson.title,
//                                         })
//                                       }
//                                     >
//                                       <Edit size={12} />
//                                     </Button>
//                                   </div>
//                                 )}
//
//                                 {/* Lesson type */}
//                                 {editingLesson &&
//                                 editingLesson.chapterIndex === chapterIndex &&
//                                 editingLesson.lessonIndex === lessonIndex &&
//                                 editingLesson.field === 'type' ? (
//                                   <div className="flex items-center gap-2">
//                                     <select
//                                       value={editingLesson.value}
//                                       onChange={(e) =>
//                                         setEditingLesson({
//                                           ...editingLesson,
//                                           value: e.target.value,
//                                         })
//                                       }
//                                       className="h-8 rounded-md border px-2 py-1 text-sm"
//                                     >
//                                       <option value="document">Tài liệu</option>
//                                       <option value="video">Video</option>
//                                       <option value="quiz">Bài kiểm tra</option>
//                                       <option value="coding">
//                                         Bài tập code
//                                       </option>
//                                     </select>
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       onClick={() =>
//                                         updateLessonField(
//                                           chapterIndex,
//                                           lessonIndex,
//                                           'type',
//                                           editingLesson.value
//                                         )
//                                       }
//                                     >
//                                       <Check size={16} />
//                                     </Button>
//                                   </div>
//                                 ) : (
//                                   <div className="flex items-center gap-2">
//                                     <Badge>
//                                       {
//                                         lessonTypeLabels[
//                                           lesson.type as keyof typeof lessonTypeLabels
//                                         ]
//                                       }
//                                     </Badge>
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       className="size-6 p-0"
//                                       onClick={() =>
//                                         setEditingLesson({
//                                           chapterIndex,
//                                           lessonIndex,
//                                           field: 'type',
//                                           value: lesson.type,
//                                         })
//                                       }
//                                     >
//                                       <Edit size={12} />
//                                     </Button>
//                                   </div>
//                                 )}
//                               </div>
//
//                               {/* Lesson description */}
//                               {editingLesson &&
//                               editingLesson.chapterIndex === chapterIndex &&
//                               editingLesson.lessonIndex === lessonIndex &&
//                               editingLesson.field === 'description' ? (
//                                 <div className="mt-2">
//                                   <Textarea
//                                     value={editingLesson.value}
//                                     onChange={(e) =>
//                                       setEditingLesson({
//                                         ...editingLesson,
//                                         value: e.target.value,
//                                       })
//                                     }
//                                     className="min-h-24 text-sm"
//                                     autoFocus
//                                   />
//                                   <div className="mt-2 flex justify-end">
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       onClick={() =>
//                                         updateLessonField(
//                                           chapterIndex,
//                                           lessonIndex,
//                                           'description',
//                                           editingLesson.value
//                                         )
//                                       }
//                                     >
//                                       <Check size={16} />
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <div className="mt-2 flex items-start justify-between">
//                                   <p className="text-sm text-muted-foreground">
//                                     {lesson.description}
//                                   </p>
//                                   <Button
//                                     size="sm"
//                                     variant="ghost"
//                                     className="ml-2 size-6 p-0"
//                                     onClick={() =>
//                                       setEditingLesson({
//                                         chapterIndex,
//                                         lessonIndex,
//                                         field: 'description',
//                                         value: lesson.description,
//                                       })
//                                     }
//                                   >
//                                     <Edit size={12} />
//                                   </Button>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//
//                           {/* Add lesson button */}
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="mt-2 w-full"
//                             onClick={() => {
//                               if (!courseStructure) return
//
//                               const updatedStructure = { ...courseStructure }
//                               const newOrder =
//                                 chapter.lessons.length > 0
//                                   ? Math.max(
//                                       ...chapter.lessons.map((l) => l.order)
//                                     ) + 1
//                                   : 1
//
//                               updatedStructure.chapters[
//                                 chapterIndex
//                               ].lessons.push({
//                                 order: newOrder,
//                                 title: `Bài học mới ${newOrder}`,
//                                 type: 'document',
//                                 description: 'Mô tả bài học',
//                               })
//
//                               setCourseStructure(updatedStructure)
//                             }}
//                           >
//                             <Plus size={16} className="mr-2" />
//                             Thêm bài học
//                           </Button>
//                         </AccordionContent>
//                       </AccordionItem>
//                     ))}
//                   </Accordion>
//
//                   {/* Add chapter button */}
//                   <Button
//                     variant="outline"
//                     className="mt-4 w-full"
//                     onClick={() => {
//                       if (!courseStructure) return
//
//                       const updatedStructure = { ...courseStructure }
//                       const newOrder =
//                         courseStructure.chapters.length > 0
//                           ? Math.max(
//                               ...courseStructure.chapters.map((c) => c.order)
//                             ) + 1
//                           : 1
//
//                       updatedStructure.chapters.push({
//                         order: newOrder,
//                         title: `Chương mới ${newOrder}`,
//                         lessons: [],
//                       })
//
//                       setCourseStructure(updatedStructure)
//                     }}
//                   >
//                     <Plus size={16} className="mr-2" />
//                     Thêm chương mới
//                   </Button>
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//
//           <DialogFooter className="mt-4">
//             <div className="flex w-full items-center justify-between">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowStructureDialog(false)}
//               >
//                 Hủy
//               </Button>
//
//               <div className="flex items-center gap-2">
//                 {isApplying ? (
//                   <Button disabled>
//                     <Loader2 className="mr-2 size-4 animate-spin" />
//                     Đang áp dụng...
//                   </Button>
//                 ) : (
//                   <Button
//                     onClick={applyStructureToDatabase}
//                     disabled={!courseStructure || !appliedMessage}
//                   >
//                     <Save className="mr-2 size-4" />
//                     Áp dụng cấu trúc
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }
//
// export default CoursePlanningAIAssistant
