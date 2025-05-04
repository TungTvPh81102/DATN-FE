'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Clock, Users, Calendar, Download, Timer } from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LiveSessionStatsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: {
    id: string
    title: string
    description: string
    status: string
    starts_at: string
    actual_start_time: string
    actual_end_time: string
    recording_playback_id: string
    recording_url: string
    duration: number
    viewers_count: number
  }
}

const LiveSessionStats = ({
  open,
  onOpenChange,
  session,
}: LiveSessionStatsProps) => {
  const viewersPeak = session.viewers_count || 0
  const durationInSeconds = session.duration || 0

  const formattedDuration = formatDuration(durationInSeconds)

  const handleDownloadRecording = () => {
    if (session.recording_url) {
      window.open(session.recording_url, '_blank')
    }
  }

  const primaryColor = '#E27447' // Màu chủ đạo mới

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl border-2"
        style={{ borderColor: primaryColor }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ color: primaryColor }}>
            Thống kê buổi phát trực tiếp
          </DialogTitle>
          <DialogDescription>
            Chi tiết về buổi livestream &#34;{session.title}&#34;
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="overflow-hidden shadow-md"
              style={{ borderColor: primaryColor, borderWidth: '1px' }}
            >
              <div
                className="h-2 w-full"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <CardHeader className="pb-2">
                <CardTitle
                  className="flex items-center text-lg"
                  style={{ color: primaryColor }}
                >
                  <Users className="mr-2 size-5" />
                  Người xem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-3xl font-bold"
                  style={{ color: primaryColor }}
                >
                  {viewersPeak}
                </div>
                <p className="text-sm text-gray-600">Lượt xem cao nhất</p>
              </CardContent>
            </Card>

            <Card
              className="overflow-hidden shadow-md"
              style={{ borderColor: primaryColor, borderWidth: '1px' }}
            >
              <div
                className="h-2 w-full"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <CardHeader className="pb-2">
                <CardTitle
                  className="flex items-center text-lg"
                  style={{ color: primaryColor }}
                >
                  <Timer className="mr-2 size-5" />
                  Thời lượng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-3xl font-bold"
                  style={{ color: primaryColor }}
                >
                  {formattedDuration}
                </div>
                <p className="text-sm text-gray-600">Tổng thời gian phát</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 space-y-4">
            <Card
              className="overflow-hidden shadow-lg"
              style={{ borderColor: primaryColor, borderWidth: '1px' }}
            >
              <div
                className="h-2 w-full"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <CardHeader>
                <CardTitle style={{ color: primaryColor }}>
                  Chi tiết thời gian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar
                      className="size-5"
                      style={{ color: primaryColor }}
                    />
                    <span className="font-medium">Dự kiến bắt đầu:</span>
                  </div>
                  <span>
                    {formatDate(session?.starts_at, {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="size-5" style={{ color: primaryColor }} />
                    <span className="font-medium">Thực tế bắt đầu:</span>
                  </div>
                  <span>
                    {formatDate(session?.actual_start_time, {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="size-5" style={{ color: primaryColor }} />
                    <span className="font-medium">Kết thúc lúc:</span>
                  </div>
                  <span>
                    {formatDate(session?.actual_end_time, {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {session.recording_url && (
            <Button
              onClick={handleDownloadRecording}
              style={{
                backgroundColor: primaryColor,
                borderColor: primaryColor,
              }}
              className="flex items-center gap-2 hover:opacity-90"
            >
              <Download className="size-4" />
              Tải xuống bản ghi
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            style={{ borderColor: primaryColor, color: primaryColor }}
            className="hover:bg-orange-50"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LiveSessionStats
