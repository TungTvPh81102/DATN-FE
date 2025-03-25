import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Clock, Zap } from 'lucide-react'

interface CouponTimelineProps {
  isActive: boolean
  duration: number
  onComplete?: () => void
  couponCode: string
}

const CouponTimeline: React.FC<CouponTimelineProps> = ({
  isActive,
  duration = 60000,
  onComplete,
  couponCode,
}) => {
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(duration)

  const startTimeRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const progressColor = useMemo(() => {
    if (progress < 50) return 'bg-gradient-to-r from-green-400 to-green-500'
    if (progress < 80) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
    return 'bg-gradient-to-r from-red-400 to-red-500'
  }, [progress])

  useEffect(() => {
    if (!isActive || !couponCode) {
      if (timerRef.current) clearInterval(timerRef.current)
      setProgress(0)
      setTimeRemaining(duration)
      startTimeRef.current = null
      return
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }

    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return

      const elapsedTime = Date.now() - startTimeRef.current
      const currentProgress = Math.min((elapsedTime / duration) * 100, 100)
      const remaining = Math.max(duration - elapsedTime, 0)

      if (currentProgress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current)
        setProgress(100)
        setTimeRemaining(0)
        onComplete?.()
        return
      }

      setProgress(currentProgress)
      setTimeRemaining(remaining)
    }, 50)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive, duration, couponCode, onComplete])

  if (!isActive) return null

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    return `${seconds}s`
  }

  return (
    <div className="mt-2">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Clock className="size-3 text-gray-500" />
          <span className="font-medium">
            Hết hạn sau:{' '}
            <span
              className={`font-bold ${progress > 80 ? 'text-red-500' : 'text-gray-700'}`}
            >
              {formatTime(timeRemaining)}
            </span>
          </span>
        </div>
        {progress > 80 && (
          <Zap className="size-4 animate-pulse text-red-500" strokeWidth={2} />
        )}
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
        <div
          className={`absolute left-0 top-0 h-full ${progressColor} duration-50 shadow-sm transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        >
          <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]" />
        </div>
      </div>
    </div>
  )
}

export default CouponTimeline
