'use client'

import { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  ArrowRightLeft,
  ArrowUpDown,
  CheckCircle2,
  GripVertical,
  Info,
  Loader2,
  MoveHorizontal,
} from 'lucide-react'

import { IChapter, ILesson } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMoveLesson } from '@/hooks/instructor/lesson/useLesson'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Sortable,
  SortableItem,
  SortableDragHandle,
} from '@/components/ui/sortable'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { UniqueIdentifier } from '@dnd-kit/core'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Props = {
  chapters: IChapter[]
  currentChapter: IChapter
  slug: string
}

const LESSON_TYPE_COLORS = {
  video: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  document: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  quiz: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  coding: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
}

const LESSON_TYPE_LABELS = {
  video: 'Bài giảng',
  document: 'Tài liệu',
  quiz: 'Câu hỏi',
  coding: 'Coding',
}

const MoveLessonsDialog = ({ chapters, currentChapter, slug }: Props) => {
  const [open, setOpen] = useState(false)
  const [targetChapterId, setTargetChapterId] = useState<string>('')
  const [selectedLessons, setSelectedLessons] = useState<number[]>([])
  const [targetChapter, setTargetChapter] = useState<IChapter | null>(null)
  const [activeTab, setActiveTab] = useState<string>('select')
  const [selectedLessonsOrdered, setSelectedLessonsOrdered] = useState<
    ILesson[]
  >([])
  const [isReorderEnabled, setIsReorderEnabled] = useState(false)

  const { mutate: moveLessons, isPending } = useMoveLesson()

  useEffect(() => {
    if (targetChapterId) {
      const chapter =
        chapters.find((ch) => ch.id?.toString() === targetChapterId) || null
      setTargetChapter(chapter)
    } else {
      setTargetChapter(null)
    }
  }, [targetChapterId, chapters])

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedLessons([])
        setSelectedLessonsOrdered([])
        setTargetChapterId('')
        setActiveTab('select')
        setIsReorderEnabled(false)
      }, 300)
    }
  }, [open])

  useEffect(() => {
    if (selectedLessons.length > 0) {
      const orderedLessons = selectedLessons
        .map((id) => currentChapter.lessons?.find((lesson) => lesson.id === id))
        .filter((lesson) => lesson !== undefined) as ILesson[]

      setSelectedLessonsOrdered(orderedLessons)
    } else {
      setSelectedLessonsOrdered([])
    }
  }, [selectedLessons, currentChapter.lessons])

  const lessonTypeStats = useMemo(() => {
    if (!currentChapter.lessons) return {}

    const stats: Record<string, number> = {}
    const selectedLessonsData = currentChapter.lessons.filter((lesson) =>
      selectedLessons.includes(lesson.id as number)
    )

    selectedLessonsData.forEach((lesson) => {
      stats[lesson.type] = (stats[lesson.type] || 0) + 1
    })

    return stats
  }, [currentChapter.lessons, selectedLessons])

  const handleCheckLesson = (lessonId: number) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    )
  }

  const handleSelectAll = () => {
    if (selectedLessons.length === currentChapter.lessons?.length) {
      setSelectedLessons([])
    } else {
      setSelectedLessons(
        currentChapter.lessons?.map((lesson) => lesson.id as number) || []
      )
    }
  }

  const handleMove = () => {
    if (!targetChapterId || selectedLessons.length === 0) {
      toast.error('Vui lòng chọn chương đích và ít nhất một bài học')
      return
    }

    const onSuccess = () => {
      setOpen(false)
    }

    const lessonIds = isReorderEnabled
      ? selectedLessonsOrdered.map((lesson) => lesson.id as number)
      : selectedLessons

    moveLessons(
      {
        slug,
        sourceChapterId: currentChapter.id as number,
        targetChapterId: parseInt(targetChapterId),
        lessonIds,
        preserveOrder: isReorderEnabled,
      },
      {
        onSuccess,
      }
    )
  }

  const canProceedToPreview = targetChapterId && selectedLessons.length > 0

  const getSelectedLessons = (): ILesson[] => {
    return isReorderEnabled
      ? selectedLessonsOrdered
      : (currentChapter.lessons || []).filter((lesson) =>
          selectedLessons.includes(lesson.id as number)
        )
  }

  const renderLessonItem = (lesson: ILesson) => {
    const isSelected = selectedLessons.includes(lesson.id as number)
    const typeColor =
      LESSON_TYPE_COLORS[lesson.type as keyof typeof LESSON_TYPE_COLORS] ||
      'bg-gray-100 text-gray-800'
    const typeLabel =
      LESSON_TYPE_LABELS[lesson.type as keyof typeof LESSON_TYPE_LABELS] ||
      'Khác'

    return (
      <div
        key={lesson.id}
        className={`group flex items-center space-x-3 rounded-lg border p-2 transition-all ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'hover:border-primary/30 hover:bg-muted/50'
        }`}
      >
        <Checkbox
          id={`lesson-${lesson.id}`}
          checked={isSelected}
          onCheckedChange={() => handleCheckLesson(lesson.id as number)}
        />
        <label
          htmlFor={`lesson-${lesson.id}`}
          className="flex flex-1 cursor-pointer items-center justify-between"
        >
          <div className="text-sm font-medium">{lesson.title}</div>
          <Badge className={`${typeColor} transition-all`}>{typeLabel}</Badge>
        </label>
      </div>
    )
  }

  const renderLessonBadge = (type: string) => {
    const typeColor =
      LESSON_TYPE_COLORS[type as keyof typeof LESSON_TYPE_COLORS] ||
      'bg-gray-100 text-gray-800'
    const typeLabel =
      LESSON_TYPE_LABELS[type as keyof typeof LESSON_TYPE_LABELS] || 'Khác'

    return <Badge className={`shrink-0 ${typeColor}`}>{typeLabel}</Badge>
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={
          !currentChapter.lessons || currentChapter.lessons.length === 0
        }
        className="flex items-center gap-1.5 hover:bg-primary/10"
      >
        <MoveHorizontal size={16} />
        <span>Di chuyển bài học</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="mx-auto max-h-screen overflow-hidden sm:max-w-md md:max-w-3xl lg:max-w-4xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MoveHorizontal className="text-primary" size={20} />
              Di chuyển bài học
            </DialogTitle>
            <DialogDescription className="text-xs">
              Chọn và di chuyển bài học từ chương hiện tại đến chương khác
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-2 grid w-full grid-cols-2 *:cursor-pointer">
              <TabsTrigger
                value="select"
                className="text-xs data-[state=active]:bg-primary/10"
              >
                1. Chọn bài học
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                disabled={!canProceedToPreview}
                className="text-xs data-[state=active]:bg-primary/10"
              >
                2. Xem trước & xác nhận
              </TabsTrigger>
            </TabsList>

            <div className="max-h-[calc(90vh-160px)] overflow-y-auto py-1">
              <TabsContent value="select" className="mt-0 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-medium">Chọn chương đích</h3>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-60 text-xs">
                          Chọn chương nơi bạn muốn di chuyển các bài học tới
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    onValueChange={setTargetChapterId}
                    value={targetChapterId}
                  >
                    <SelectTrigger className="h-8 text-xs focus:outline-none focus:ring-0">
                      <SelectValue placeholder="Chọn chương đích" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters
                        .filter((chapter) => chapter.id !== currentChapter.id)
                        .map((chapter) => (
                          <SelectItem
                            key={chapter.id}
                            value={chapter.id?.toString() || ''}
                          >
                            <span>{chapter.title}</span>
                            {chapter.lessons && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({chapter.lessons.length} bài học)
                              </span>
                            )}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Card className="overflow-hidden">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-1.5 text-sm">
                        <span>Bài học từ:</span>
                        <span className="font-semibold text-primary">
                          {currentChapter.title}
                        </span>
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="h-7 text-xs"
                      >
                        {selectedLessons.length ===
                        currentChapter.lessons?.length
                          ? 'Bỏ chọn tất cả'
                          : 'Chọn tất cả'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <ScrollArea className="h-[calc(90vh-330px)] min-h-[200px] pr-2">
                      {currentChapter.lessons &&
                      currentChapter.lessons.length > 0 ? (
                        <div className="space-y-2">
                          {currentChapter.lessons.map((lesson) =>
                            renderLessonItem(lesson)
                          )}
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-center text-sm text-muted-foreground">
                            Không có bài học nào trong chương này
                          </p>
                        </div>
                      )}
                    </ScrollArea>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <p className="font-medium">
                        Đã chọn {selectedLessons.length} /{' '}
                        {currentChapter.lessons?.length || 0} bài học
                      </p>
                      {canProceedToPreview && (
                        <Button
                          variant="link"
                          size="sm"
                          className="flex h-auto items-center gap-1 p-0 font-medium text-primary"
                          onClick={() => setActiveTab('preview')}
                        >
                          Xem trước kết quả
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="mt-0 space-y-4">
                <Card className="overflow-hidden">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <ArrowRightLeft size={18} className="text-primary" />
                      Thông tin di chuyển
                    </CardTitle>
                    <CardDescription className="text-xs">
                      <div className="mt-1 flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-xs font-normal"
                        >
                          {selectedLessons.length} bài học
                        </Badge>
                        <span>sẽ được di chuyển</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-3 rounded-lg bg-muted/50 p-3">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground">
                          Từ chương:
                        </h4>
                        <p className="text-sm font-medium">
                          {currentChapter.title}
                        </p>
                      </div>

                      <div className="mt-2">
                        <h4 className="text-xs font-medium text-muted-foreground">
                          Đến chương:
                        </h4>
                        <p className="text-sm font-medium">
                          {targetChapter?.title}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
                        {isReorderEnabled ? (
                          <h4 className="text-xs font-medium">
                            Sắp xếp các bài học
                          </h4>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-medium">
                              Các bài học được chọn:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(lessonTypeStats).map(
                                ([type, count]) => (
                                  <Badge
                                    key={type}
                                    variant="outline"
                                    className={`text-xs ${LESSON_TYPE_COLORS[type as keyof typeof LESSON_TYPE_COLORS]}`}
                                  >
                                    {`${count} ${LESSON_TYPE_LABELS[type as keyof typeof LESSON_TYPE_LABELS]}`}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {selectedLessons.length > 1 && (
                          <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="reorder-switch"
                                checked={isReorderEnabled}
                                onCheckedChange={setIsReorderEnabled}
                                disabled={selectedLessons.length <= 1}
                              />
                              <Label
                                htmlFor="reorder-switch"
                                className="flex items-center space-x-1 text-xs"
                              >
                                <ArrowUpDown size={16} />
                                <span>Sắp xếp thứ tự bài học</span>
                              </Label>
                            </div>
                          </div>
                        )}
                      </div>

                      <ScrollArea className="mt-2 h-[calc(90vh-430px)] min-h-[180px] rounded-lg border p-2">
                        {isReorderEnabled &&
                        selectedLessonsOrdered.length > 0 ? (
                          <Sortable
                            value={selectedLessonsOrdered}
                            onValueChange={setSelectedLessonsOrdered}
                            orientation="vertical"
                          >
                            {selectedLessonsOrdered.map((lesson, index) => (
                              <SortableItem
                                key={lesson.id}
                                value={lesson.id as UniqueIdentifier}
                                className="mb-2"
                              >
                                <div className="flex items-center gap-2 rounded border border-l-2 border-l-primary p-2 text-xs transition-all">
                                  <SortableDragHandle>
                                    <GripVertical />
                                  </SortableDragHandle>
                                  <div className="flex flex-1 items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="flex size-4 items-center justify-center rounded-full bg-muted text-xs">
                                        {index + 1}
                                      </div>
                                      <span className="truncate font-medium">
                                        {lesson.title}
                                      </span>
                                    </div>
                                    {renderLessonBadge(lesson.type)}
                                  </div>
                                </div>
                              </SortableItem>
                            ))}
                          </Sortable>
                        ) : (
                          <div className="space-y-2">
                            {getSelectedLessons().map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-2 rounded border border-l-2 border-l-primary p-4 text-xs transition-all"
                              >
                                <CheckCircle2
                                  size={14}
                                  className="shrink-0 text-primary"
                                />
                                <span className="flex-1 truncate font-medium">
                                  {lesson.title}
                                </span>
                                {renderLessonBadge(lesson.type)}
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="pt-2 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="block h-8 text-xs md:hidden"
            >
              Hủy
            </Button>
            {activeTab === 'select' ? (
              <Button
                onClick={() => canProceedToPreview && setActiveTab('preview')}
                disabled={!canProceedToPreview}
                className="h-8 text-xs"
              >
                Tiếp tục
              </Button>
            ) : (
              <div className="flex w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('select')}
                  className="h-8 text-xs"
                >
                  Quay lại chọn bài học
                </Button>

                <Button
                  size="sm"
                  className="ml-auto"
                  onClick={handleMove}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                      Đang di chuyển...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="mr-1.5 size-3.5" />
                      Xác nhận di chuyển
                    </>
                  )}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MoveLessonsDialog
