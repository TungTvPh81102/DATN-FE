'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Loader2, Upload, X } from 'lucide-react'
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import { useForm } from 'react-hook-form'
import { updateProfile, UpdateProfilePayload } from '@/validations/profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateProfile } from '@/hooks/profile/useProfile'

interface Props {
  profileData: any
  isLoadingProfileData: boolean
}

const ProfileMeView = ({ profileData, isLoadingProfileData }: Props) => {
  const { mutate, isPending } = useUpdateProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{
    width: number
    height: number
  } | null>(null)
  const [actualCropDimensions, setActualCropDimensions] = useState<{
    width: number
    height: number
  } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfile),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      about_me: '',
    },
    disabled: isPending,
  })

  useEffect(() => {
    if (profileData) {
      setValue('name', profileData?.data.user.name || '')
      setValue('phone', profileData?.data?.user?.profile?.phone || '')
      setValue('address', profileData.data?.user?.profile?.address || '')
      setValue('about_me', profileData.data?.user?.profile?.about_me || '')
    }
  }, [profileData, setValue])

  const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    )
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setImageDimensions({ width, height })
    setCrop(centerAspectCrop(width, height, 1))
  }

  useEffect(() => {
    if (completedCrop && imgRef.current && imageDimensions) {
      const scaleX = imgRef.current.naturalWidth / imageDimensions.width
      const scaleY = imgRef.current.naturalHeight / imageDimensions.height

      const actualWidth = Math.round(completedCrop.width * scaleX)
      const actualHeight = Math.round(completedCrop.height * scaleY)

      setActualCropDimensions({ width: actualWidth, height: actualHeight })
    }
  }, [completedCrop, imageDimensions])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedImage(url)
      setShowCropModal(true)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const cropImage = () => {
    if (completedCrop && imgRef.current && imageDimensions) {
      const canvas = document.createElement('canvas')
      const scaleX = imgRef.current.naturalWidth / imageDimensions.width
      const scaleY = imgRef.current.naturalHeight / imageDimensions.height

      canvas.width = 550
      canvas.height = 550

      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          550,
          550
        )

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'avatar.png', { type: 'image/png' })
            setValue('avatar', file)

            const newPreviewUrl = URL.createObjectURL(blob)
            setPreviewUrl(newPreviewUrl)

            setShowCropModal(false)
          }
        }, 'image/png')
      }
    }
  }

  const cancelCrop = () => {
    setShowCropModal(false)
    setUploadedImage(null)
    setActualCropDimensions(null)
  }

  if (isLoadingProfileData) {
    return (
      <div className="mt-20">
        <Loader2 className="mx-auto size-8 animate-spin" />
      </div>
    )
  }

  const onSubmit = (data: UpdateProfilePayload) => {
    mutate(data)
  }

  return (
    <div className="widget-content-inner">
      <div className="row">
        <div className="profile-wrap">
          <div
            className="profile-img group relative cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Image
              id="profile-img"
              src={previewUrl || profileData?.data?.user?.avatar}
              alt={profileData?.data?.user?.name}
              width={150}
              height={150}
              className="size-32 rounded-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Upload className="text-white" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="profile-info ml-4">
            <h4 className="text-xl font-semibold">
              {profileData?.data?.user?.name}
            </h4>
            <label id="name-file" className="text-gray-600">
              {profileData?.data?.user?.email}
            </label>
            <p className="mt-2 text-sm text-gray-500">
              Nhấp vào hình ảnh để tải lên ảnh đại diện mới
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="shop-checkout mt-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <fieldset className="tf-field">
            <input
              className="tf-input style-1 w-full rounded border p-3 pr-10"
              id="field1"
              type="text"
              placeholder="Nhập họ tên của bạn"
              tabIndex={2}
              {...register('name')}
              aria-required="true"
            />
            <label className="tf-field-label fs-15" htmlFor="field1">
              Họ tên
            </label>
            {errors.name && (
              <span className="text-danger text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </fieldset>
          <fieldset className="tf-field">
            <input
              className="tf-input style-1 w-full rounded border p-3 pr-10"
              id="field2"
              type="text"
              placeholder="Nhập số điện thoại của bạn"
              tabIndex={2}
              {...register('phone')}
            />
            <label className="tf-field-label fs-15" htmlFor="field2">
              Số điện thoại
            </label>
            {errors.phone && (
              <span className="text-danger text-sm text-red-500">
                {errors.phone.message}
              </span>
            )}
          </fieldset>
        </div>

        <fieldset className="tf-field mt-4">
          <input
            className="tf-input style-1 w-full rounded border p-3 pr-10"
            id="field4"
            type="text"
            placeholder="Nhập địa chỉ của bạn"
            tabIndex={2}
            aria-required="true"
            {...register('address')}
          />
          <label className="tf-field-label fs-15" htmlFor="field4">
            Địa chỉ
          </label>
          {errors.address && (
            <span className="text-danger text-sm text-red-500">
              {errors.address.message}
            </span>
          )}
        </fieldset>

        <fieldset className="tf-field mt-4">
          <textarea
            className="tf-input style-1 w-full rounded border p-3 pr-10"
            rows={5}
            placeholder="Hãy giới thiệu về bạn"
            tabIndex={2}
            {...register('about_me')}
          />
          <label className="tf-field-label type-textarea fs-15" htmlFor="">
            Giới thiệu
          </label>
          {errors.about_me && (
            <span className="text-danger text-sm text-red-500">
              {errors.about_me.message}
            </span>
          )}
        </fieldset>

        <button
          type="submit"
          className="tf-btn mt-6 flex items-center justify-center rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 animate-spin" />}
          Cập nhật hồ sơ <i className="icon-arrow-top-right ml-2" />
        </button>
      </form>

      {showCropModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/50">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Điều chỉnh ảnh đại diện</h3>
              <button
                onClick={cancelCrop}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Hãy điều chỉnh vùng cắt để có ảnh đại diện phù hợp. Vùng cắt sẽ
                được thu phóng để hiển thị với kích thước 550x550 pixel.
              </p>
              {actualCropDimensions && (
                <div className="mt-2 flex items-center text-sm font-medium">
                  <span className="mr-2">Kích thước hiện tại:</span>
                  <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">
                    {actualCropDimensions.width} x {actualCropDimensions.height}{' '}
                    pixel
                  </span>
                  <span className="ml-2">
                    (Sẽ được thu phóng thành 550x550 pixel)
                  </span>
                </div>
              )}
            </div>

            <div className="mb-4 flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="max-h-[50vh] overflow-auto"
              >
                <img
                  ref={imgRef}
                  src={uploadedImage || ''}
                  alt="Ảnh tải lên"
                  onLoad={onImageLoad}
                  className="max-w-full"
                />
              </ReactCrop>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <span>
                  Kéo để điều chỉnh vùng cắt. Tỷ lệ 1:1 sẽ được áp dụng tự động.
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={cancelCrop}
                  className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={cropImage}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMeView
