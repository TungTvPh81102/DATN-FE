import { zodResolver } from '@hookform/resolvers/zod'
import {
  Camera,
  Crop,
  Edit,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { ImageCropper } from '@/components/shared/image-cropper'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateProfile } from '@/hooks/profile/useProfile'
import { cn, getAvatarText } from '@/lib/utils'
import { useAuthStore } from '@/stores/useAuthStore'
import { FileWithPreview } from '@/types/file'
import { updateProfile, UpdateProfilePayload } from '@/validations/profile'
import BanksSheet from './banks-sheet'
import { ChangePwDialog } from './change-pw-dialog'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

interface Props {
  userData: any
}

export function ProfileSection({ userData }: Props) {
  const { setUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)

  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate, isPending } = useUpdateProfile()

  const form = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfile),
    defaultValues: {
      name: userData?.user.name || '',
      phone: userData?.user.profile?.phone || '',
      address: userData?.user.profile?.address || '',
      about_me: userData?.user.profile?.about_me || '',
    },
    disabled: isPending,
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type || !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('File must be an image (JPEG, PNG, or WebP)')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB')
      return
    }

    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    })

    setSelectedFile(fileWithPreview)
    setDialogOpen(true)
  }

  function onSubmit(data: UpdateProfilePayload) {
    if (!data.avatar) {
      delete data.avatar
    }

    mutate(data, {
      onSuccess: (res) => {
        const user = res?.data?.user
        if (user) {
          delete user.profile
          setUser(user)
        }
        setIsEditing(false)
        setSelectedFile(null)
      },
    })
  }

  return (
    <Card className="bg-background/50 backdrop-blur-sm">
      <CardHeader className="relative flex flex-col items-center pb-0">
        {selectedFile ? (
          (() => {
            const avatar = form.getValues('avatar')
            return (
              <>
                {avatar && (
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Avatar className="size-32 shadow-xl ring-4 ring-white">
                      <AvatarImage
                        src={
                          avatar instanceof File
                            ? URL.createObjectURL(avatar)
                            : avatar
                        }
                        alt="Profile picture"
                        className="object-cover"
                      />
                      <AvatarFallback className="text-3xl">
                        {getAvatarText(userData?.user.name || 'L')}
                      </AvatarFallback>
                    </Avatar>

                    <Button
                      size="icon"
                      className="absolute -bottom-2 right-2 rounded-full"
                      onClick={() => setDialogOpen(true)}
                    >
                      <Crop className="size-4" />
                    </Button>
                  </div>
                )}

                <ImageCropper
                  open={isDialogOpen && isEditing}
                  onOpenChange={setDialogOpen}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  croppedImage={avatar || null}
                  setCroppedImage={(image) => form.setValue('avatar', image)}
                  aspect={1}
                />
              </>
            )
          })()
        ) : (
          <div
            className={cn('relative', isEditing && 'cursor-pointer')}
            onClick={() => {
              if (isEditing) {
                fileInputRef.current?.click()
              }
            }}
          >
            <Avatar className="size-32 shadow-xl ring-4 ring-white">
              <AvatarImage
                src={userData?.user.avatar}
                alt="Profile picture"
                className="object-cover"
              />
              <AvatarFallback className="text-3xl">
                {getAvatarText(userData?.user.name || 'L')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="icon"
                className="absolute -bottom-2 right-2 rounded-full"
              >
                <Camera />
              </Button>
            )}
          </div>
        )}
        <Input
          type="file"
          ref={fileInputRef}
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          className="hidden"
          onChange={(event) => {
            handleFileUpload(event)
            event.target.value = ''
          }}
        />

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {userData?.user.name}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
            <Mail className="size-4" />
            <span>{userData?.user.email}</span>
          </div>
        </div>

        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
          >
            <Edit className="mr-2 size-4" />
            Cập nhật thông tin
          </Button>
        ) : null}
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-8">
        {!isEditing ? (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                    <Phone className="size-4 text-orange-500" />
                    Thông tin liên hệ
                  </h3>
                  <Separator className="my-3" />
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Số điện thoại
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {userData?.user.profile.phone || 'Chưa cập nhật'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {userData?.user.email}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                    <MapPin className="size-4 text-orange-500" />
                    Địa chỉ
                  </h3>
                  <Separator className="my-3" />
                  <p className="text-sm text-gray-900">
                    {userData?.user.profile.address || 'Chưa cập nhật'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                  <User className="size-4 text-orange-500" />
                  Giới thiệu
                </h3>
                <Separator className="my-3" />
                <p className="text-sm leading-relaxed text-gray-700">
                  {userData?.user.profile.about_me ||
                    'Chưa có thông tin giới thiệu'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <BanksSheet />
              <ChangePwDialog />
            </div>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ tên của bạn"
                          className="border-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập số điện thoại của bạn"
                          className="border-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập địa chỉ của bạn"
                          className="border-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about_me"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Giới thiệu về bạn</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Hãy chia sẻ đôi điều về bản thân"
                          className="min-h-[120px] resize-none border-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  disabled={isPending}
                  type="button"
                  variant="outline"
                  className="border-gray-200"
                  onClick={() => {
                    setIsEditing(false)
                    setSelectedFile(null)
                    form.reset()
                  }}
                >
                  Quay lại
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : null}
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
