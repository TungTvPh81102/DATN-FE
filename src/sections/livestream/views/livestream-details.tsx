'use client'

import { useLiveSessionInfo } from '@/hooks/live/useLive'
import { LivestreamPlayer } from '@/app/room-live-stream/_components/livestream-player'
import { LivestreamInfo } from '@/app/room-live-stream/_components/livestream-info'
import { LivestreamChat } from '@/app/room-live-stream/_components/livestream-chat'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, ArrowLeft, Lock } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import ModalLoading from '@/components/common/ModalLoading'

type Props = {
  code: string
}

export const LivestreamDetails = ({ code }: Props) => {
  const router = useRouter()
  const { data, isLoading, error } = useLiveSessionInfo(code)
  const [showPrivateAlert, setShowPrivateAlert] = useState(false)
  const [showAccessAlert, setShowAccessAlert] = useState(false)

  useEffect(() => {
    if (data?.status == 'ended') {
      router.push('/404')
    }
  }, [data?.status, router])

  useEffect(() => {
    const isPrivate = data?.visibility === 'private'
    const isUserRegistered = data?.participants?.some(
      (participant: any) => participant.user_id === 1
    )
    if (isPrivate && !isUserRegistered) {
      setShowPrivateAlert(true)
    }
    if (data && data.can_access === false) {
      setShowAccessAlert(true)
    }
  }, [data])

  if (error) {
    return (
      <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center p-4">
        <Alert
          variant="destructive"
          className="mb-4 border-l-4 border-[#E27447] bg-orange-50 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-[#E27447]" />
            <div>
              <AlertTitle className="mb-1 text-lg font-bold text-[#E27447]">
                Đã xảy ra lỗi
              </AlertTitle>
              <AlertDescription className="text-[#E27447]/90">
                Không thể tải thông tin phiên học trực tuyến. Vui lòng thử lại
                sau.
              </AlertDescription>
            </div>
          </div>
        </Alert>
        <button
          onClick={() => router.push('/')}
          className="mt-4 flex items-center gap-2 rounded-md bg-[#E27447] px-5 py-2.5 text-white shadow-md transition-all hover:bg-[#E27447]/90 hover:shadow-lg"
        >
          <ArrowLeft className="size-4" />
          Trở về trang chủ
        </button>
      </div>
    )
  }

  if (isLoading) return <ModalLoading />

  return (
    <>
      <div className="relative flex size-full flex-1">
        <div
          className={`mr-[380px] flex w-full flex-1 flex-col overflow-y-auto`}
        >
          <main className="flex flex-1 flex-col gap-4 md:gap-6 md:p-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {data?.title || 'Phiên học trực tuyến'}
            </h1>
            <div className="space-y-6">
              <LivestreamPlayer liveSession={data} />
              <LivestreamInfo liveSession={data} />
            </div>
          </main>
        </div>

        <div className="fixed right-0 top-0 z-10 h-full w-[380px] border-l border-slate-200 bg-white shadow-lg">
          <LivestreamChat liveSession={data} />
        </div>
      </div>

      <AlertDialog open={showPrivateAlert} onOpenChange={setShowPrivateAlert}>
        <AlertDialogContent className="border-l-4 border-[#E27447] shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-lg text-[#E27447]">
              <div className="flex size-9 items-center justify-center rounded-full bg-orange-100">
                <Lock className="size-5 text-[#E27447]" />
              </div>
              Phiên học riêng tư
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-slate-600">
              Phiên học này chỉ dành cho học viên đã đăng ký. Vui lòng đăng ký
              khóa học để tham gia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-md bg-[#E27447] px-4 py-2 text-white shadow-md hover:bg-[#E27447]/90"
            >
              <ArrowLeft className="size-4" />
              Quay lại
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showAccessAlert} onOpenChange={setShowAccessAlert}>
        <AlertDialogContent className="border-l-4 border-[#E27447] shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-lg text-[#E27447]">
              <div className="flex size-9 items-center justify-center rounded-full bg-orange-100">
                <Lock className="size-5 text-[#E27447]" />
              </div>
              Không thể truy cập sự kiện
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-slate-600">
              Bạn không có quyền truy cập vào sự kiện này. Sự kiện này có thể là
              riêng tư hoặc yêu cầu đăng ký trước.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-md bg-[#E27447] px-4 py-2 text-white shadow-md hover:bg-[#E27447]/90"
            >
              <ArrowLeft className="size-4" />
              Quay lại
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
