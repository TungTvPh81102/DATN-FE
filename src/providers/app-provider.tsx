'use client'

import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { ToastContainer } from 'react-toastify'

import QueryProvider from './query-provider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleAnalytics } from '@next/third-parties/google'

type Props = {
  children: React.ReactNode
}

const AppProvider = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div id="wrapper">
      <QueryProvider>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {children}
        </GoogleOAuthProvider>
      </QueryProvider>

      <ToastContainer newestOnTop closeOnClick />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            zIndex: 9999, // Đảm bảo toast hiển thị trên modal
          },
        }}
      />

      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
    </div>
  )
}

export default AppProvider
