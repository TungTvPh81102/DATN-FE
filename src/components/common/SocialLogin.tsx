'use client'
import Link from 'next/link'
import { toast } from 'react-toastify'

const SocialLogin = () => {
  const handleGoogleRedirect = async () => {
    const width = 500
    const height = 600
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    const googleAuthUrl = `http://127.0.0.1:8000/api/auth/google`
    const authWindow = window.open(
      googleAuthUrl,
      '_blank',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    )

    if (
      !authWindow ||
      authWindow.closed ||
      typeof authWindow.closed === 'undefined'
    ) {
      toast.error('Popup bị chặn. Vui lòng cho phép popup cho trang web này.')
      return
    }

    window.addEventListener(
      'message',
      (event) => {
        if (
          event.origin === window.location.origin &&
          event.data.type === 'AUTH_SUCCESS'
        ) {
          authWindow.close()
          window.location.reload()
        }
      },
      false
    )
  }

  return (
    <ul className="login-social">
      <li className="login-social-icon">
        <Link href="#" className="tf-btn wow fadeInUp" data-wow-delay="0s">
          <i className="flaticon-facebook-1" /> Facebook
        </Link>
      </li>
      <li className="login-social-icon">
        <button
          onClick={handleGoogleRedirect}
          className="tf-btn wow fadeInUp"
          data-wow-delay="0.1s"
        >
          <i className="icon-google" /> Google
        </button>
      </li>
      <li className="login-social-icon">
        <Link href="#" className="tf-btn wow fadeInUp" data-wow-delay="0.2s">
          <i className="icon-apple" /> Apple
        </Link>
      </li>
    </ul>
  )
}

export default SocialLogin
