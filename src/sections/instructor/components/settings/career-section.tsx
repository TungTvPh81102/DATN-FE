import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isAfter } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  Briefcase,
  Building2,
  CalendarIcon,
  Clock,
  GraduationCap,
  Loader2,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { careerProfileSchema } from '@/validations/profile'
import { cn } from '@/lib/utils'
import {
  useCreatCareers,
  useDeleteCareer,
  useUpdateCareers,
} from '@/hooks/profile/useProfile'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/lib/common'
import { DebouncedInput } from '@/components/shared/debounced-input'

interface Props {
  careersData: any
}

const CareersSection = ({ careersData }: Props) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { mutate: createCareer, isPending: isCreating } = useCreatCareers()
  const { mutate: updateCareer, isPending: isUpdating } = useUpdateCareers()
  const { mutate: deleteCareer, isPending: isDeletePending } = useDeleteCareer()

  const addForm = useForm({
    resolver: zodResolver(careerProfileSchema),
    defaultValues: {
      careers: {
        institution_name: '',
        major: '',
        start_date: '',
        end_date: '',
        description: '',
        degree: '',
      },
    },
    disabled: isCreating,
  })

  const editForm = useForm({
    resolver: zodResolver(careerProfileSchema),
    defaultValues: {
      careers: {
        institution_name: '',
        major: '',
        start_date: '',
        end_date: '',
        description: '',
        degree: '',
      },
    },
    disabled: isUpdating,
  })

  const validateDates = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return true
    const start = new Date(startDate)
    const end = new Date(endDate)
    return !isAfter(start, end)
  }

  const handleAddCareer = (data: any) => {
    const { start_date, end_date } = data.careers
    if (!validateDates(start_date, end_date)) {
      toast.error('Ngày bắt đầu không thể sau ngày kết thúc')
      return
    }
    createCareer(data, {
      onSuccess: () => {
        addForm.reset()
        setShowAddForm(false)
      },
    })
  }

  const handleUpdateCareer = (data: any) => {
    const { start_date, end_date } = data.careers

    if (!validateDates(start_date, end_date)) {
      toast.error('Ngày bắt đầu không thể sau ngày kết thúc')
      return
    }

    if (editingCareerId) {
      updateCareer(
        { data, careerId: editingCareerId },
        {
          onSuccess: () => {
            setEditingCareerId(null)
            editForm.reset()
            setShowEditForm(false)
          },
        }
      )
    }
  }

  const handleDeleteCareer = (careerId: string) => {
    setIsDeleting(careerId)
    deleteCareer(careerId, {
      onSuccess: () => {
        setIsDeleting(null)
        toast.success('Xóa nghề nghiệp thành công')
      },
      onError: () => {
        setIsDeleting(null)
      },
    })
  }

  const handleEditCareer = (career: any) => {
    setEditingCareerId(career.id)
    editForm.reset({
      careers: {
        institution_name: career.institution_name,
        major: career.major,
        start_date: career.start_date,
        end_date: career.end_date,
        description: career.description || '',
        degree: career.degree,
      },
    })
    setShowEditForm(true)
  }

  const handleCancelEdit = () => {
    if (!isUpdating) {
      setEditingCareerId(null)
      editForm.reset()
      setShowEditForm(false)
    }
  }

  const careers = careersData?.careers || []

  const filteredCareers = careers.filter((career: any) => {
    const searchString = searchQuery.toLowerCase()
    return (
      career.institution_name.toLowerCase().includes(searchString) ||
      career.major.toLowerCase().includes(searchString) ||
      career.degree.toLowerCase().includes(searchString)
    )
  })

  const getCompanyColor = (companyName: string) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600',
      'bg-orange-100 text-orange-600',
      'bg-teal-100 text-teal-600',
    ]

    const index = companyName.charCodeAt(0) % colors.length
    return colors[index]
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return ''

    const start = new Date(startDate)
    const end = new Date(endDate)

    const yearDiff = end.getFullYear() - start.getFullYear()
    const monthDiff = end.getMonth() - start.getMonth()

    const totalMonths = yearDiff * 12 + monthDiff

    if (totalMonths < 12) {
      return `${totalMonths} tháng`
    } else {
      const years = Math.floor(totalMonths / 12)
      const months = totalMonths % 12
      return months > 0 ? `${years} năm ${months} tháng` : `${years} năm`
    }
  }

  return (
    <>
      <Card className="overflow-hidden bg-background/50 backdrop-blur-sm">
        <CardHeader
          className={cn(
            'justify-between gap-4 space-y-0 bg-gradient-to-r shadow-md sm:flex-row sm:items-center',
            'from-orange-50 to-orange-100'
          )}
        >
          <div>
            <CardTitle className="text-xl">Quản lý nghề nghiệp</CardTitle>
            <CardDescription>
              Quản lý thông tin về kinh nghiệm làm việc của bạn
            </CardDescription>
          </div>
          <Dialog
            open={showAddForm}
            onOpenChange={(open) => !isCreating && setShowAddForm(open)}
          >
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap bg-orange-500 text-sm text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md">
                <PlusCircle className="mr-1 size-3 sm:mr-2 sm:size-4" />
                Thêm nghề nghiệp
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-bold text-orange-600">
                  <Briefcase className="size-5" />
                  Thêm nghề nghiệp
                </DialogTitle>
                <DialogDescription>
                  Thêm thông tin nghề nghiệp của bạn. Nhấn lưu khi hoàn tất.
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form
                  onSubmit={addForm.handleSubmit(handleAddCareer)}
                  className="space-y-4"
                >
                  <FormField
                    control={addForm.control}
                    name="careers.institution_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Tên công ty/Tổ chức
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên công ty" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="careers.major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Chuyên ngành
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập chuyên ngành của bạn"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="careers.degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Bằng cấp</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập bằng cấp của bạn"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
                      name="careers.start_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-medium">
                            Ngày bắt đầu
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    !field.value && 'text-muted-foreground'
                                  )}
                                  disabled={field.disabled}
                                >
                                  {field.value ? (
                                    formatDate(field.value)
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(date ? date.toISOString() : '')

                                  const endDate =
                                    addForm.getValues('careers.end_date')
                                  if (
                                    date &&
                                    endDate &&
                                    isAfter(date, new Date(endDate))
                                  ) {
                                    toast.warning(
                                      'Ngày bắt đầu không thể sau ngày kết thúc'
                                    )
                                  }
                                }}
                                initialFocus
                                locale={vi}
                                className="rounded-md border border-gray-200"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="careers.end_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-medium">
                            Ngày kết thúc
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    !field.value && 'text-muted-foreground'
                                  )}
                                  disabled={field.disabled}
                                >
                                  {field.value ? (
                                    formatDate(field.value)
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(date ? date.toISOString() : '')

                                  const startDate =
                                    addForm.getValues('careers.start_date')
                                  if (
                                    date &&
                                    startDate &&
                                    isAfter(new Date(startDate), date)
                                  ) {
                                    toast.warning(
                                      'Ngày kết thúc không thể trước ngày bắt đầu'
                                    )
                                  }
                                }}
                                initialFocus
                                locale={vi}
                                className="rounded-md border border-gray-200"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={addForm.control}
                    name="careers.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập mô tả về vai trò của bạn"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => !isCreating && setShowAddForm(false)}
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-500/80"
                      disabled={isCreating}
                    >
                      {isCreating && <Loader2 className="animate-spin" />} Thêm
                      nghề nghiệp
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-[350px]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                disabled
              >
                <Search />
              </Button>

              <DebouncedInput
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(value) => setSearchQuery(value + '')}
                className="w-full pr-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                className={
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-xs font-medium shadow-sm hover:bg-orange-600'
                    : 'border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50'
                }
                onClick={() => setViewMode('grid')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
                Lưới
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                className={
                  viewMode === 'list'
                    ? 'bg-orange-500 text-xs font-medium shadow-sm hover:bg-orange-600'
                    : 'border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50'
                }
                onClick={() => setViewMode('list')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
                Danh sách
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {viewMode === 'list' ? (
              <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                      <TableRow className="border-b border-gray-300">
                        <TableHead className="py-3 text-sm font-semibold text-gray-700">
                          Nghề nghiệp
                        </TableHead>
                        <TableHead className="py-3 text-sm font-semibold text-gray-700">
                          Thời gian
                        </TableHead>
                        <TableHead className="w-[100px] py-3 text-right text-sm font-semibold text-gray-700">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCareers.length > 0 ? (
                        filteredCareers.map((career: any) => (
                          <TableRow
                            key={career.id}
                            className="border-b border-gray-200 transition-colors duration-150 hover:bg-gray-50"
                          >
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div
                                  className={`flex size-10 items-center justify-center rounded-md text-sm font-bold sm:size-12 ${getCompanyColor(career.institution_name)} shadow-sm`}
                                >
                                  {career.institution_name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-medium text-gray-900">
                                    {career.institution_name.length > 20
                                      ? career.institution_name.slice(0, 20) +
                                        '...'
                                      : career.institution_name}
                                  </div>
                                  <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-gray-600 sm:text-sm">
                                    <Badge
                                      variant="outline"
                                      className="border-gray-200 bg-gray-50 px-1 py-0 text-xs"
                                    >
                                      {career.degree}
                                    </Badge>
                                    <span className="truncate">
                                      {career.major}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex flex-col text-xs text-gray-600 sm:text-sm">
                                <div className="flex items-center text-xs">
                                  <CalendarIcon className="mr-1 size-3 text-gray-400" />
                                  {career.start_date && career.end_date && (
                                    <span className="whitespace-nowrap font-medium">
                                      {format(
                                        new Date(career.start_date),
                                        'MM/yyyy',
                                        { locale: vi }
                                      )}{' '}
                                      -{' '}
                                      {format(
                                        new Date(career.end_date),
                                        'MM/yyyy',
                                        { locale: vi }
                                      )}
                                    </span>
                                  )}
                                </div>
                                {career.start_date && career.end_date && (
                                  <Badge
                                    variant="secondary"
                                    className="mt-1 w-fit border-orange-100 bg-orange-50 text-xs font-medium text-orange-600"
                                  >
                                    {calculateDuration(
                                      career.start_date,
                                      career.end_date
                                    )}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 rounded-full transition-colors duration-200 hover:bg-blue-50"
                                  onClick={() => handleEditCareer(career)}
                                  title="Chỉnh sửa"
                                  disabled={
                                    isDeleting === career.id || isDeletePending
                                  }
                                >
                                  <Pencil className="size-3.5 text-blue-500" />
                                  <span className="sr-only">Sửa</span>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-7 rounded-full transition-colors duration-200 hover:bg-red-50"
                                      title="Xóa"
                                      disabled={
                                        isDeleting === career.id ||
                                        isDeletePending
                                      }
                                    >
                                      {isDeleting === career.id ? (
                                        <Loader2 className="size-3.5 animate-spin text-red-500" />
                                      ) : (
                                        <Trash2 className="size-3.5 text-red-500" />
                                      )}
                                      <span className="sr-only">Xóa</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="max-w-[400px] bg-white">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-lg font-bold text-gray-800">
                                        Bạn có chắc chắn muốn xóa?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Hành động này không thể hoàn tác. Thông
                                        tin nghề nghiệp này sẽ bị xóa vĩnh viễn.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="border border-gray-200 text-sm transition-colors hover:bg-gray-50">
                                        Hủy
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteCareer(career.id)
                                        }
                                        className="bg-red-500 text-sm transition-colors hover:bg-red-600"
                                        disabled={isDeleting === career.id}
                                      >
                                        {isDeleting === career.id ? (
                                          <>
                                            <Loader2 className="mr-2 size-3 animate-spin" />
                                            Đang xóa...
                                          </>
                                        ) : (
                                          'Xóa'
                                        )}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-64 text-center">
                            {searchQuery ? (
                              <div className="flex flex-col items-center justify-center py-10">
                                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                  <Search className="size-7" />
                                </div>
                                <p className="text-sm font-medium text-gray-600">
                                  Không tìm thấy kết quả phù hợp
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Không có kết quả nào phù hợp với &quot;
                                  {searchQuery}&quot;
                                </p>
                                <Button
                                  variant="outline"
                                  className="mt-4 border-gray-200 text-xs"
                                  onClick={() => setSearchQuery('')}
                                >
                                  Xóa tìm kiếm
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-12">
                                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-50 text-orange-500 shadow-sm">
                                  <Briefcase className="size-8" />
                                </div>
                                <p className="text-base font-medium text-gray-700">
                                  Chưa có thông tin nghề nghiệp
                                </p>
                                <p className="mt-1 max-w-[300px] text-center text-xs text-gray-500">
                                  Thêm thông tin về kinh nghiệm làm việc của bạn
                                  để hoàn thiện hồ sơ cá nhân
                                </p>
                                <Button
                                  className="mt-4 bg-orange-500 text-xs text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md"
                                  onClick={() => setShowAddForm(true)}
                                >
                                  <PlusCircle className="mr-1 size-3" />
                                  Thêm nghề nghiệp mới
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div>
                {filteredCareers.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {filteredCareers.map((career: any) => (
                      <Card
                        key={career.id}
                        className="overflow-hidden border border-gray-300 transition-shadow duration-200 hover:shadow-lg"
                      >
                        <CardHeader className="px-5 pb-2 pt-5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex size-12 items-center justify-center rounded-md text-base font-bold ${getCompanyColor(career.institution_name)} shadow-sm`}
                              >
                                {career.institution_name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <CardTitle className="truncate text-base font-semibold text-gray-800">
                                  {career.institution_name.length > 20
                                    ? career.institution_name.slice(0, 20) +
                                      '...'
                                    : career.institution_name}
                                </CardTitle>
                                <CardDescription className="mt-1 flex items-center gap-1 truncate text-xs">
                                  <Building2 className="size-3 shrink-0 text-gray-500" />
                                  <span className="font-medium text-gray-600">
                                    {career.degree}
                                  </span>
                                </CardDescription>
                              </div>
                            </div>
                            <div className="ml-2 flex shrink-0 gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full transition-colors duration-200 hover:bg-blue-50"
                                onClick={() => handleEditCareer(career)}
                                title="Chỉnh sửa"
                                disabled={
                                  isDeleting === career.id || isDeletePending
                                }
                              >
                                <Pencil className="size-4 text-blue-500" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full transition-colors duration-200 hover:bg-red-50"
                                    title="Xóa"
                                    disabled={
                                      isDeleting === career.id ||
                                      isDeletePending
                                    }
                                  >
                                    {isDeleting === career.id ? (
                                      <Loader2 className="size-4 animate-spin text-red-500" />
                                    ) : (
                                      <Trash2 className="size-4 text-red-500" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-[400px] bg-white">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-lg font-bold text-gray-800">
                                      Bạn có chắc chắn muốn xóa?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Hành động này không thể hoàn tác. Thông
                                      tin nghề nghiệp này sẽ bị xóa vĩnh viễn.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border border-gray-200 text-sm transition-colors hover:bg-gray-50">
                                      Hủy
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteCareer(career.id)
                                      }
                                      className="bg-red-500 text-sm transition-colors hover:bg-red-600"
                                      disabled={isDeleting === career.id}
                                    >
                                      {isDeleting === career.id ? (
                                        <>
                                          <Loader2 className="mr-2 size-3 animate-spin" />
                                          Đang xóa...
                                        </>
                                      ) : (
                                        'Xóa'
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="px-5 pb-2">
                          <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                            <GraduationCap className="size-4 shrink-0 text-gray-500" />
                            <span className="truncate font-medium">
                              {career.major}
                            </span>
                          </div>

                          <div className="mb-3 flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="size-3.5 shrink-0 text-gray-500" />
                            <span className="whitespace-nowrap font-medium">
                              {career.start_date && career.end_date && (
                                <>
                                  {format(
                                    new Date(career.start_date),
                                    'MM/yyyy',
                                    {
                                      locale: vi,
                                    }
                                  )}{' '}
                                  -{' '}
                                  {format(
                                    new Date(career.end_date),
                                    'MM/yyyy',
                                    {
                                      locale: vi,
                                    }
                                  )}
                                </>
                              )}
                            </span>
                            <Badge
                              variant="secondary"
                              className="ml-1 border-orange-100 bg-orange-50 text-xs font-medium text-orange-600"
                            >
                              {calculateDuration(
                                career.start_date,
                                career.end_date
                              )}
                            </Badge>
                          </div>

                          {career.description && (
                            <div className="mt-2 line-clamp-2 border-t border-gray-100 pt-2 text-sm text-gray-600">
                              {career.description}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="px-5 pb-4 pt-0">
                          <div className="flex w-full items-center justify-between border-t border-gray-100 pt-2">
                            <div className="text-xs text-gray-500">
                              Đã tạo:{' '}
                              {format(
                                new Date(career.created_at || new Date()),
                                'dd/MM/yyyy',
                                { locale: vi }
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs font-medium text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                              onClick={() => handleEditCareer(career)}
                            >
                              Chi tiết
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-300 bg-white p-6 text-center shadow-md">
                    {searchQuery ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                          <Search className="size-7" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          Không tìm thấy kết quả phù hợp
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Không có kết quả nào phù hợp với &quot;{searchQuery}
                          &quot;
                        </p>
                        <Button
                          variant="outline"
                          className="mt-3 border-gray-200 text-xs"
                          onClick={() => setSearchQuery('')}
                        >
                          Xóa tìm kiếm
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10">
                        <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-orange-50 text-orange-500 shadow-sm">
                          <Briefcase className="size-8" />
                        </div>
                        <p className="text-base font-medium text-gray-700">
                          Chưa có thông tin nghề nghiệp
                        </p>
                        <p className="mt-1 max-w-[300px] text-center text-xs text-gray-500">
                          Thêm thông tin về kinh nghiệm làm việc của bạn để hoàn
                          thiện hồ sơ cá nhân
                        </p>
                        <Button
                          className="mt-4 bg-orange-500 text-xs text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md"
                          onClick={() => setShowAddForm(true)}
                        >
                          <PlusCircle className="mr-1 size-3" />
                          Thêm nghề nghiệp mới
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={showEditForm}
        onOpenChange={(open) => !isUpdating && setShowEditForm(open)}
      >
        <DialogContent className="bg-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <Pencil className="size-5" />
              Sửa nghề nghiệp
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin nghề nghiệp của bạn. Nhấn lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleUpdateCareer)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="careers.institution_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Tên công ty/Tổ chức
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên công ty" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="careers.major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Chuyên ngành</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập chuyên ngành của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="careers.degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Bằng cấp</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập bằng cấp của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="careers.start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-medium">
                        Ngày bắt đầu
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                !field.value && 'text-muted-foreground'
                              )}
                              disabled={isUpdating}
                            >
                              {field.value ? (
                                formatDate(field.value)
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : '')

                              const endDate =
                                editForm.getValues('careers.end_date')
                              if (
                                date &&
                                endDate &&
                                isAfter(date, new Date(endDate))
                              ) {
                                toast.warning(
                                  'Ngày bắt đầu không thể sau ngày kết thúc'
                                )
                              }
                            }}
                            initialFocus
                            disabled={isUpdating}
                            locale={vi}
                            className="rounded-md border border-gray-200"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="careers.end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-medium">
                        Ngày kết thúc
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                !field.value && 'text-muted-foreground'
                              )}
                              disabled={isUpdating}
                            >
                              {field.value ? (
                                formatDate(field.value)
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : '')

                              const startDate =
                                editForm.getValues('careers.start_date')
                              if (
                                date &&
                                startDate &&
                                isAfter(new Date(startDate), date)
                              ) {
                                toast.warning(
                                  'Ngày kết thúc không thể trước ngày bắt đầu'
                                )
                              }
                            }}
                            initialFocus
                            disabled={isUpdating}
                            locale={vi}
                            className="rounded-md border border-gray-200"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="careers.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả về vai trò của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="border-gray-200 hover:bg-gray-50"
                  disabled={isUpdating}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 transition-colors hover:bg-blue-600"
                  disabled={isUpdating}
                >
                  {isUpdating && <Loader2 className="animate-spin" />}
                  Cập nhật nghề nghiệp
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default CareersSection
