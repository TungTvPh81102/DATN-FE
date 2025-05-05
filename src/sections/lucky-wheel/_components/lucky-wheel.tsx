'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ClipboardList,
  Copy,
  Check,
  X,
  Loader2,
  ArrowUp,
  HelpCircle,
} from 'lucide-react'
import {
  useGetRewards,
  useGetSpinHistory,
  useGetSpinTurn,
  useGetStatus,
  useSpinRun,
} from '@/hooks/lucky-wheel/useLuckyWheel'
import '../../../styles/lucky-wheel.css'
import Link from 'next/link'

interface StatusData {
  status: 'active' | 'inactive'
  message: string
}

const getPrizeStyle = (type: string) => {
  switch (type) {
    case 'gift':
      return {
        color: '#E64A19', // Deep orange dark
        textColor: 'white',
        icon: '📱',
      }
    case 'coupon':
      return {
        color: '#FF7043', // Medium orange
        textColor: 'white',
        icon: '🎫',
      }
    case 'spin':
      return {
        color: '#FFAB91', // Lighter orange
        textColor: 'black',
        icon: '🔄',
      }
    case 'no_reward':
    default:
      return {
        color: '#FF8A65', // Light orange
        textColor: 'white',
        icon: '🍀',
      }
  }
}

export default function LuckyWheel() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<any | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const historyRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<SVGSVGElement | null>(null)
  const { data: statusData } = useGetStatus() as {
    data: StatusData | undefined
  }
  const { data: rewardsData } = useGetRewards()
  const { data: spinTurn } = useGetSpinTurn()
  const { mutate: spinRun, isPending: loadingSpinRun } = useSpinRun()
  const { data: spinHistoryData } = useGetSpinHistory()

  const spinsLeft = (spinTurn as Record<string, any>)
    ? parseInt((spinTurn as Record<string, any>)['Số lượt quay còn lại'])
    : 0

  useEffect(() => {
    setCopied(false)
  }, [result])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const spinWheel = () => {
    if (isSpinning || spinsLeft <= 0 || loadingSpinRun) return

    setIsSpinning(true)

    spinRun(undefined, {
      onSuccess: (data) => {
        const prizeList = Array.isArray(rewardsData)
          ? rewardsData
          : (rewardsData?.data ?? [])

        const rewardData = data?.data ?? data // Nếu data là response, lấy data.data
        const selectedPrize = prizeList.find(
          (reward: any) => reward.name === rewardData.reward
        )

        if (!selectedPrize) {
          console.error('Không tìm thấy phần thưởng từ API')
          setIsSpinning(false)
          return
        }

        // Xác định vị trí phần thưởng trên vòng quay
        const prizeIndex = prizeList.findIndex(
          (reward: any) => reward.name === rewardData?.reward
        )

        const segmentAngle = 360 / prizeList?.length
        const offset = Math.random() * (segmentAngle * 0.5)
        const prizeAngle = 360 - prizeIndex * segmentAngle - offset

        // Quay nhiều vòng trước khi dừng
        const fullRotations = 8 + Math.floor(Math.random() * 3)
        const totalRotation = fullRotations * 360 + prizeAngle

        setRotation(totalRotation)

        setTimeout(() => {
          setRotation(0)
          setResult({ ...selectedPrize, coupon_code: rewardData?.coupon_code })
          setShowResult(true)
          setIsSpinning(false)

          if (selectedPrize.type === 'gift') {
            triggerJackpotConfetti()
          } else {
            triggerConfetti()
          }
        }, 6000)
      },
      onError: (error) => {
        console.error('Lỗi khi quay vòng:', error)
        setIsSpinning(false)
      },
    })
  }
  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF9800', '#FF5722', '#FFEB3B'],
    })
  }

  const triggerJackpotConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FF9800', '#FF5722', '#FFEB3B'],
    })

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#FF9800', '#FF5722', '#FFEB3B'],
      })
    }, 200)

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#FF9800', '#FF5722', '#FFEB3B'],
      })
    }, 400)
  }

  const closeResult = () => {
    setShowResult(false)
    setResult(null)
  }

  const createWheelSegments = () => {
    if (!rewardsData) return []

    const segments = []
    const centerX = 225
    const centerY = 225
    const radius = 225
    const segmentAngle = 360 / 8
    const prizeList = Array.isArray(rewardsData) ? rewardsData : []

    for (let i = 0; i < 8; i++) {
      // const prize = rewardsData[i]
      const prize = prizeList[i] // Tránh lỗi khi `prizeList` rỗng
      if (!prize) continue // Bỏ qua nếu không có prize
      const style = getPrizeStyle(prize?.type)
      const startAngle = i * segmentAngle
      const endAngle = (i + 1) * segmentAngle

      const startRad = (startAngle - 90) * (Math.PI / 180)
      const endRad = (endAngle - 90) * (Math.PI / 180)

      const x1 = centerX + radius * Math.cos(startRad)
      const y1 = centerY + radius * Math.sin(startRad)
      const x2 = centerX + radius * Math.cos(endRad)
      const y2 = centerY + radius * Math.sin(endRad)

      const pathData = `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`

      const textAngle = startAngle + segmentAngle / 2
      const textRad = (textAngle - 90) * (Math.PI / 180)
      const textDistance = radius * 0.65
      const textX = centerX + textDistance * Math.cos(textRad)
      const textY = centerY + textDistance * Math.sin(textRad)

      segments.push(
        <g key={i}>
          <path
            d={pathData}
            fill={style.color}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
          />

          <g transform={`translate(${textX}, ${textY}) rotate(${textAngle})`}>
            <text
              x="0"
              y="-15"
              textAnchor="middle"
              fontSize="24"
              fill={style.textColor}
            >
              {style.icon}
            </text>

            <text
              x="0"
              y="10"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill={style.textColor}
            >
              {prize?.name?.length > 10 ? (
                <>
                  <tspan x="0" dy="0">
                    {prize?.name.split(' ').slice(0, 2).join(' ')}
                  </tspan>
                  <tspan x="0" dy="14">
                    {prize?.name.split(' ').slice(2).join(' ')}
                  </tspan>
                </>
              ) : (
                prize?.name
              )}
            </text>
          </g>
        </g>
      )
    }

    return segments
  }

  //histories
  const handleScroll = () => {
    if (historyRef.current) {
      setShowScrollTop(historyRef.current.scrollTop > 100)
    }
  }
  const scrollToTop = () => {
    if (historyRef.current) {
      historyRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }
  useEffect(() => {
    const historySpinElement = historyRef.current
    if (historySpinElement) {
      historySpinElement.addEventListener('scroll', handleScroll)
      return () =>
        historySpinElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!rewardsData || !spinTurn) {
    return (
      <div>
        <Loader2 className="animate-spin text-orange-600" />
      </div>
    )
  }
  if (!rewardsData || !spinTurn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-orange-600" size={32} />
      </div>
    )
  }

  if (statusData?.status === 'inactive') {
    return (
      <div className="flex items-center justify-center">
        <div className="rounded-lg bg-orange-50 p-8 text-center shadow-lg">
          <div className="mb-4 text-5xl">🔧</div>
          <h2 className="mb-2 text-2xl font-bold text-orange-600">
            Thông báo bảo trì
          </h2>
          <p className="text-orange-700">{statusData?.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="absolute right-6 top-6 flex flex-col space-y-2">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="rounded-full bg-orange-100 p-2 text-orange-500 transition-colors hover:bg-orange-200"
          aria-label="View spin history"
        >
          <ClipboardList size={20} />
        </button>

        <button
          onClick={() => setShowRules(true)}
          className="animate-pulse-subtle rounded-full bg-orange-100 p-2 text-orange-500 transition-colors hover:bg-orange-200"
          aria-label="View game rules"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      <div className="relative mb-12">
        <div className="animate-spin-slow absolute -inset-4 rounded-full border-8 border-dashed border-orange-300"></div>

        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 translate-y-[-40%]">
          <div className="drop-shadow-glow size-0 border-x-[25px] border-t-[40px] border-x-transparent border-t-orange-600"></div>
        </div>

        <div className="relative rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 p-1 shadow-[0_0_30px_rgba(249,115,22,0.7)]">
          <motion.div
            key={`wheel-${rotation}`}
            className="relative size-72 overflow-hidden rounded-full border-8 border-orange-400 bg-white shadow-xl md:size-[450px]"
            style={{
              transformOrigin: 'center',
            }}
            animate={{
              rotate: rotation,
            }}
            transition={{
              duration: 6,
              ease: [0.2, 0.9, 0.1, 1.0],
            }}
          >
            <svg
              ref={wheelRef}
              width="100%"
              height="100%"
              viewBox="0 0 450 450"
              className="size-full"
            >
              {createWheelSegments()}

              <circle
                cx="225"
                cy="225"
                r="30"
                fill="url(#centerGradient)"
                stroke="#F97316"
                strokeWidth="4"
              />

              <circle cx="225" cy="225" r="20" fill="white" />

              <text
                x="225"
                y="225"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#F97316"
              >
                SPIN
              </text>

              <defs>
                <radialGradient id="centerGradient">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#FB923C" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={spinWheel}
          disabled={isSpinning || spinsLeft <= 0}
          className={`bg-gradient-to-r ${spinsLeft <= 0 ? 'from-orange-400 to-orange-300' : 'from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500'} rounded-full px-8 py-6 text-xl font-bold text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all ${isSpinning || spinsLeft <= 0 ? 'opacity-70' : ''}`}
          style={{
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          {isSpinning
            ? 'Đang quay ^^'
            : spinsLeft <= 0
              ? 'Bạn không có lượt quay nào!'
              : `Quay (${spinsLeft} lượt quay)`}
        </Button>
      </div>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="border-orange-200 bg-white text-orange-950 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl text-orange-500">
              {result?.type === 'gift'
                ? '🎉 Chúc mừng! 🎉'
                : 'Giải thưởng của bạn'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center p-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              className={`mb-6 flex size-40 flex-col items-center justify-center rounded-full p-4 text-center ${result?.type === 'gift' ? 'animate-pulse-glow' : ''}`}
              style={{
                backgroundColor: result
                  ? getPrizeStyle(result.type).color
                  : '#FF8A65',
                color: result ? getPrizeStyle(result.type).textColor : 'white',
                boxShadow:
                  result?.type === 'gift'
                    ? '0 0 30px rgba(249,115,22,0.7)'
                    : '0 0 20px rgba(0,0,0,0.1)',
              }}
            >
              <span className="mb-2 text-4xl">
                {result ? getPrizeStyle(result.type).icon : '🎉'}
              </span>
              <span className="text-xl font-bold">{result?.name}</span>
            </motion.div>

            {result?.type === 'coupon' && result?.coupon_code && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 w-full"
              >
                <p className="mb-2 text-center font-medium text-orange-700">
                  Mã giảm giá của bạn:
                </p>
                <div className="flex items-center justify-center rounded-lg border border-orange-200 bg-orange-50 p-2">
                  <div className="mr-2 rounded-md bg-orange-100 px-4 py-2 font-mono text-lg font-bold text-orange-700">
                    {`${result.coupon_code}`}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-200 bg-orange-100 text-orange-700 hover:bg-orange-200"
                    onClick={() => copyToClipboard(`${result.coupon_code}`)}
                  >
                    {copied ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <p className="mt-2 text-center text-sm text-green-600">
                    Đã sao chép!
                  </p>
                )}
              </motion.div>
            )}

            <p className="mb-6 text-orange-700">
              {result?.type === 'gift'
                ? 'Bạn đã giành được một trong những giải thưởng hàng đầu của chúng tôi! Nhóm của chúng tôi sẽ sớm liên hệ với bạn.'
                : result?.type === 'no_reward'
                  ? 'Chúc bạn may mắn lần sau nhé!'
                  : result?.type === 'coupon'
                    ? 'Sử dụng mã giảm giá này khi thanh toán!'
                    : 'Bạn đã được thêm một lượt quay!'}
            </p>

            <Button
              onClick={closeResult}
              className="mt-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500"
            >
              Tiếp tục
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="border-orange-200 bg-white text-orange-950 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl text-orange-500">
              Thể lệ & Quy tắc
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] max-w-5xl overflow-y-auto p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="mb-2 text-xl font-bold text-orange-600">
                  Cách thức tham gia
                </h3>
                <ul className="ml-6 list-disc space-y-2 text-orange-800">
                  <li>Nhận 1 lượt quay khi đăng ký mua khóa học trên 900K</li>
                  <li>Nhận 1 lượt quay khi đăng ký mua gói thành viên</li>
                  <li>Nhấn nút Quay để bắt đầu quay vòng quay may mắn</li>
                  <li>
                    Vòng quay sẽ quay trong vài giây và dừng lại ở phần thưởng
                    ngẫu nhiên
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-bold text-orange-600">
                  Các loại phần thưởng
                </h3>
                <ul className="ml-6 list-disc space-y-2 text-orange-800">
                  <li>
                    <span className="font-semibold">
                      Giải thưởng vật phẩm (📱):
                    </span>{' '}
                    Điện thoại, máy tính bảng,...
                  </li>
                  <li>
                    <span className="font-semibold">Mã giảm giá (🎫):</span> Các
                    mã giảm giá có giá trị khác nhau cho khóa học tiếp theo
                  </li>
                  <li>
                    <span className="font-semibold">Thêm lượt quay (🔄):</span>{' '}
                    Nhận thêm lượt quay để tiếp tục thử vận may
                  </li>
                  <li>
                    <span className="font-semibold">May mắn lần sau (🍀):</span>{' '}
                    Không nhận được phần thưởng lần này
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-bold text-orange-600">
                  Quy định chung
                </h3>
                <ul className="ml-6 list-disc space-y-2 text-orange-800">
                  <li>Mỗi lượt quay đảm bảo cơ hội trúng thưởng công bằng</li>
                  <li>Phần thưởng được xác định ngẫu nhiên từ hệ thống</li>
                  <li>
                    Các mã giảm giá có thời hạn sử dụng, vui lòng sử dụng trước
                    khi hết hạn
                  </li>
                  <li>
                    Đối với giải thưởng vật phẩm, đội ngũ chăm sóc khách hàng sẽ
                    liên hệ để xác nhận thông tin giao hàng
                  </li>
                  <li>
                    Người dùng có thể xem lịch sử quay của mình trong phần Lịch
                    sử quay
                  </li>
                  <li>
                    Ban tổ chức có quyền thay đổi cơ cấu giải thưởng mà không
                    cần thông báo trước
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-bold text-orange-600">
                  Điều khoản sử dụng
                </h3>
                <ul className="ml-6 list-disc space-y-2 text-orange-800">
                  <li>
                    Không sử dụng công cụ, phần mềm gian lận để tăng lượt quay
                    hoặc tỷ lệ trúng thưởng
                  </li>
                  <li>
                    Ban tổ chức có quyền từ chối trao thưởng nếu phát hiện gian
                    lận
                  </li>
                  <li>Phần thưởng không được quy đổi thành tiền mặt</li>
                </ul>
              </div>

              <div className="animate-pulse-slow rounded-lg bg-orange-50 p-4 text-center">
                <p className="text-orange-700">
                  Chúc bạn may mắn và nhận được những phần quà hấp dẫn! 🎁
                </p>
              </div>
            </motion.div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => setShowRules(false)}
              className="mt-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500"
            >
              Đã hiểu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 z-40 flex h-full w-80 flex-col overflow-hidden bg-white shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-orange-200 p-4">
              <h3 className="text-xl font-bold text-orange-600">
                Lịch sử quay
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-orange-500 hover:text-orange-700"
              >
                <X size={20} />
              </button>
            </div>

            <div
              ref={historyRef}
              className="relative flex-1 overflow-y-auto p-4"
              onScroll={handleScroll}
            >
              {!spinHistoryData ? (
                <p className="py-8 text-center text-gray-500">
                  Chưa có lượt quay nào. Hãy thử vận may của bạn!
                </p>
              ) : (
                <ul className="space-y-3">
                  {Array.isArray(spinHistoryData) &&
                    spinHistoryData?.map((item: any) => (
                      <li
                        key={item.id}
                        className="rounded-lg border border-orange-100 bg-orange-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex size-10 items-center justify-center rounded-full text-xl"
                            style={{
                              backgroundColor: getPrizeStyle(item.reward_type)
                                .color,
                              color: getPrizeStyle(item.reward_type).textColor,
                            }}
                          >
                            {getPrizeStyle(item.reward_type).icon}
                          </div>
                          <div>
                            <p className="font-medium text-orange-800">
                              {item.reward_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.spun_at}
                            </p>
                            {item.reward_type === 'coupon' && (
                              <Link href={`/my-courses?tab=coupon`}>
                                <p className="mt-1 font-mono text-sm text-orange-600">
                                  Xem mã giảm giá của bạn
                                </p>
                              </Link>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={scrollToTop}
                  className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-md transition-colors hover:bg-orange-600"
                >
                  <ArrowUp size={20} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
