import Cookies from 'js-cookie'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

import StorageKey from '@/constants/storage-key'
;(window as any).Pusher = Pusher

const token = Cookies.get(StorageKey.ACCESS_TOKEN)
// if (!token) {
//   console.error('❌ Access token is missing. Please authenticate first.')
// } else {
//   console.log('🔑 Access token:', token)
// }

const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  forceTLS: true,
  encrypted: true,
  authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
})

// echo.connector.pusher.connection.bind('connected', () => {
//   console.log('✅ Kết nối với Pusher thành công!')
// })

// echo.connector.pusher.connection.bind('error', (err: any) => {
//   console.error('❌ Lỗi kết nối với Pusher:', err)
// })

// echo.connector.pusher.connection.bind('subscription_error', (err: any) => {
//   console.error('❌ Pusher subscription error:', err)
// })

export default echo
