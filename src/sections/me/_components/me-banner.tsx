import React, { useCallback } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getLocalStorage } from '@/lib/common'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

const MeBanner = () => {
  const { user, role } = useAuthStore()
  const router = useRouter()

  const handleBecomeInstructor = useCallback(() => {
    const checkProfile = getLocalStorage('checkProfile') === 'true'

    if (!checkProfile) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Vui lòng hoàn thiện hồ sơ trước khi đăng ký trở thành giảng viên',
        icon: 'warning',
        confirmButtonText: 'Đồng ý',
      })
      return
    }

    if (role === 'instructor') {
      router.push('/instructor')
      return
    }

    router.push('/become-an-instructor')
  }, [role, router])

  return (
    <div className="page-title style-7 bg-5">
      <div className="tf-container">
        <div className="row items-center">
          <div className="col-lg-8">
            <div className="flex items-center gap-2">
              <div className="author-item">
                <div className="author-item-img">
                  <Avatar>
                    <AvatarImage src={user?.avatar ?? ''} />
                    <AvatarFallback>{user?.name}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="fw-7 text-3xl text-white">
                Xin chào, {user?.name ?? ''}
              </span>
            </div>
            <div>
              <ul className="entry-meta my-4">
                <li>
                  <i className="flaticon-book"></i>5 Courses Enroled
                </li>
                <li>
                  <i className="flaticon-medal"></i>4 Certificate
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="right-content">
              <button className="tf-btn" onClick={handleBecomeInstructor}>
                {role === 'instructor'
                  ? 'Giảng dạy trên CourseMeLy'
                  : 'Đăng ký trở thành giảng viên'}
                <i className="icon-arrow-top-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeBanner
