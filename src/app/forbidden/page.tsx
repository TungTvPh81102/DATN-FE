import Link from 'next/link'
import { MoveLeft } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Truy cập bị từ chối',
  description:
    'Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập bằng tài khoản phù hợp hoặc quay lại trang chủ để tiếp tục khám phá CourseMely.',
}

const ForbiddenPage = () => {
  return (
    <div
      className={`flex h-screen flex-col items-center justify-center bg-[#F8FAFC] font-manrope leading-8`}
    >
      <h1 className="text-7xl font-bold text-primary">403</h1>
      <h2 className="mt-4 text-5xl font-bold">Truy cập bị từ chối</h2>
      <p className="mt-4">
        Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại quyền
        truy cập của bạn hoặc liên hệ với quản trị viên.
      </p>
      <p className="mt-4">
        Nếu bạn nghĩ rằng đây là một lỗi, hãy thử truy cập lại từ trang chủ hoặc
        liên hệ với chúng tôi để được hỗ trợ.
      </p>
      <Link
        className="mt-4 flex items-center gap-2 hover:text-primary"
        href="/"
      >
        <MoveLeft />
        Trang chủ
      </Link>
    </div>
  )
}

export default ForbiddenPage
