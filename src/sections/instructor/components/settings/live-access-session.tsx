import React, { useEffect, useState } from 'react'
import {
  Copy,
  CheckCircle,
  Play,
  Sparkles,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  ShieldAlert,
  X,
  Loader2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useGenerateStreamKey, useGetStreamKey } from '@/hooks/live/useLive'
import { useCheckPassword } from '@/hooks/user/useUser'

const LiveAccessSession = () => {
  const [streamKey, setStreamKey] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [hasKey, setHasKey] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const { data, isLoading } = useGetStreamKey()
  const { mutate, isPending } = useGenerateStreamKey()
  const { mutate: checkPassword, isPending: isCheckingPassword } =
    useCheckPassword()

  useEffect(() => {
    if (data?.stream_key) {
      setStreamKey(data.stream_key)
      setHasKey(true)
    }
  }, [data])

  const generateStreamKey = async () => {
    mutate(undefined, {
      onSuccess: async (res: any) => {
        console.log('Generated stream key:', res)
        setStreamKey(res?.data.stream_key)
        setHasKey(true)
        toast.success('Đã tạo mã stream thành công!')
      },
      onError: (error) => {
        console.error('Error generating stream key:', error)
        toast.error('Không thể tạo mã stream. Vui lòng thử lại sau.')
      },
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(streamKey)
    setIsCopied(true)
    toast.success('Đã sao chép!')

    setTimeout(() => {
      setIsCopied(false)
    }, 3000)
  }

  const handleToggleShowKey = () => {
    if (showKey) {
      setShowKey(false)
    } else {
      setShowPasswordDialog(true)
    }
  }

  const handlePasswordSubmit = (e: any) => {
    e.preventDefault()

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu')
      return
    }

    checkPassword(password, {
      onSuccess: () => {
        setShowKey(true)
        setShowPasswordDialog(false)
        setPassword('')
        setPasswordError('')
      },
      onError: (error) => {
        setPasswordError(error.message)
      },
    })
  }

  const closePasswordDialog = () => {
    setShowPasswordDialog(false)
    setPassword('')
    setPasswordError('')
  }

  const maskedKey = streamKey ? '•'.repeat(Math.min(20, streamKey.length)) : ''

  return (
    <div className="w-full rounded-xl bg-white p-8 shadow-lg">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 shadow-md">
          <Play className="size-6 text-white" fill="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Truy cập sự kiện</h1>
          <p className="text-gray-500">
            Quản lý mã stream để bắt đầu buổi dạy trực tuyến của bạn
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-orange-500" />
            <h2 className="font-semibold text-gray-700">Mã sự kiện của bạn</h2>
          </div>
        </div>

        {!hasKey ? (
          <div className="flex flex-col items-center rounded-lg border border-dashed border-orange-200 bg-white/80 p-8">
            <div className="mb-4 rounded-full bg-orange-100 p-4">
              <Plus className="size-6 text-orange-500" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-700">
              Chưa có mã stream
            </h3>
            <p className="mb-5 text-center text-gray-500">
              Bạn chưa có mã stream. Tạo mã ngay để bắt đầu buổi dạy trực tuyến.
            </p>
            <button
              onClick={generateStreamKey}
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2 font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <RefreshCw className="size-5 animate-spin" />
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Plus className="size-5" />
                  <span>Tạo mã stream</span>
                </>
              )}
            </button>
          </div>
        ) : isLoading ? (
          <div className="h-16 animate-pulse rounded-lg bg-gray-100" />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="relative flex flex-1 items-center rounded-lg border border-gray-200 bg-white px-4 py-3 font-mono text-gray-700">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={showKey ? streamKey : maskedKey}
                  readOnly
                  className="w-full border-none bg-transparent focus:outline-none"
                />
                <button
                  onClick={handleToggleShowKey}
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                  aria-label={showKey ? 'Ẩn mã stream' : 'Hiện mã stream'}
                >
                  {showKey ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              <button
                onClick={copyToClipboard}
                className="ml-3 rounded-lg bg-orange-500 p-3 text-white transition-colors hover:bg-orange-600"
                aria-label="Sao chép mã stream"
              >
                {isCopied ? (
                  <CheckCircle className="size-5" />
                ) : (
                  <Copy className="size-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {showPasswordDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Xác nhận bảo mật
                </h3>
              </div>
              <button
                onClick={closePasswordDialog}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-600">
              Nhập mật khẩu của bạn để xem mã stream
            </p>

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-orange-500 focus:outline-none"
                  autoFocus
                  disabled={isCheckingPassword}
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closePasswordDialog}
                  disabled={isCheckingPassword}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCheckingPassword}
                  className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isCheckingPassword ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Đang xác thực...</span>
                    </>
                  ) : (
                    'Xác nhận'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {hasKey && (
        <>
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 text-orange-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              Hướng dẫn livestream
            </h3>

            <div className="grid grid-cols-1 gap-4 *:cursor-pointer md:grid-cols-3">
              <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 font-semibold text-white shadow-md transition-all group-hover:shadow-orange-200">
                    1
                  </div>
                  <h4 className="font-medium">Mở phần mềm OBS Studio</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Cài đặt và mở phần mềm OBS Studio trên máy tính của bạn
                </p>
              </div>

              <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 font-semibold text-white shadow-md transition-all group-hover:shadow-orange-200">
                    2
                  </div>
                  <h4 className="font-medium">Thiết lập stream</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Vào Cài đặt &gt; Stream &gt; Chọn &#34;Custom&#34; và dán mã
                  stream của bạn
                </p>
              </div>

              <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 font-semibold text-white shadow-md transition-all group-hover:shadow-orange-200">
                    3
                  </div>
                  <h4 className="font-medium">Bắt đầu phát sóng</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Nhấn &#34;Bắt đầu phát sóng&#34; trong OBS và buổi học trực
                  tuyến sẽ bắt đầu
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="mt-1 text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="mb-1 font-medium text-blue-800">
                Lưu ý quan trọng
              </h4>
              <p className="text-sm text-blue-600">
                Mã sự kiện này là duy nhất cho tài khoản của bạn. Không chia sẻ
                mã này với người khác để đảm bảo an toàn cho buổi học trực tuyến
                của bạn.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LiveAccessSession
