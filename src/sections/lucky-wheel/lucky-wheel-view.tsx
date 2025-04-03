'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import LuckyWheel from '@/sections/lucky-wheel/_components/lucky-wheel'
import '../../styles/lucky-wheel.css'
import { useAuthStore } from '@/stores/useAuthStore'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

const BackgroundMusic = dynamic(
  () => import('@/sections/lucky-wheel/_components/background-music'),
  {
    ssr: false,
  }
)

export default function LuckyWheelView() {
  const router = useRouter()
  const { user } = useAuthStore()

  if (!user) {
    Swal.fire({
      icon: 'warning',
      title: 'Truy cập bị hạn chế',
      text: 'Bạn cần đăng nhập để tiếp tục!',
      confirmButtonText: 'Đăng nhập ngay',
    }).then(() => {
      router.push('/sign-in')
    })

    return null
  }
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <div className="particles-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
                backgroundColor: `rgba(255, ${150 + Math.random() * 50}, ${50 + Math.random() * 50}, ${0.1 + Math.random() * 0.1})`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="animate-fade-in mb-8 text-center">
          <h1 className="mb-3 text-5xl font-bold text-orange-500">
            Vòng quay may mắn
          </h1>
          <p className="mx-auto max-w-md text-xl text-orange-700/80">
            Quay càng nhiều vận may càng lớn!
          </p>
        </div>

        <div>
          <LuckyWheel />
        </div>

        <Suspense fallback={null}>
          <BackgroundMusic />
        </Suspense>
      </div>
    </main>
  )
}
