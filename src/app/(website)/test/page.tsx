// 'use client'

// import { useGoogleLogin } from '@react-oauth/google'
// import { useEffect } from 'react'
// import { useGoogleCallBack, useGoogleRedirect } from '@/hooks/auth/useAuth'

// const GoogleLoginButton = () => {
//   const { data: redirectUrl }: { data: any } = useGoogleRedirect()

//   const googleLogin = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       const query = new URLSearchParams({
//         code: tokenResponse.access_token,
//       }).toString()

//       await googleCallback.mutate(query)
//     },
//     onError: () => {
//       console.error('Google login failed')
//     },
//   })

//   const googleCallback = useGoogleCallBack()

//   useEffect(() => {
//     if (window.location.search.includes('code')) {
//       googleCallback.mutate(window.location.search.substring(1))
//     }
//   }, [])

//   return (
//     <button
//       onClick={() => {
//         if (redirectUrl) {
//           window.location.href = redirectUrl
//         } else {
//           googleLogin()
//         }
//       }}
//     >
//       Đăng nhập với Google
//     </button>
//   )
// }

// export default GoogleLoginButton

export default function page() {
  return <div>page</div>
}
