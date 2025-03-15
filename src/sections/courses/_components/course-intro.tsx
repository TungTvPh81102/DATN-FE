import Link from 'next/link'

export const CourseIntro = () => (
  <div className="content w-3/4 py-6">
    <ul className="breadcrumbs mb-6 flex items-center justify-start gap-2">
      <li>
        <Link href="/">
          <i className="icon-home" />
        </Link>
      </li>
      <li>
        <i className="icon-arrow-right" />
      </li>
      <li>Trang chủ</li>
      <li>
        <i className="icon-arrow-right" />
      </li>
      <li>Danh sách khoá học</li>
    </ul>
    <div className="relative mb-8">
      <div className="absolute top-0 h-full w-1 rounded-full bg-gradient-to-b from-orange-500 to-orange-500"></div>
      <h1 className="pl-4 text-3xl font-bold text-gray-800 md:text-4xl">
        Khám Phá Tất Cả Khoá Học Của Chúng Tôi
      </h1>
    </div>
    <div className="space-y-4 pl-4 leading-relaxed text-gray-700">
      <p className="text-lg">
        Chào mừng bạn đến với danh sách khóa học trực tuyến! Tại đây, bạn có thể
        tìm thấy hàng trăm khóa học thuộc nhiều lĩnh vực khác nhau, từ
        <span className="font-medium text-orange-600"> lập trình</span>,
        <span className="font-medium text-orange-600"> thiết kế</span>,
        <span className="font-medium text-orange-600"> kinh doanh </span>
        đến{' '}
        <span className="font-medium text-orange-600">phát triển cá nhân</span>.
      </p>
      <p className="text-lg">
        Dù bạn là người mới bắt đầu hay đã có kinh nghiệm, chúng tôi luôn có
        những khóa học phù hợp để giúp bạn nâng cao kỹ năng, mở rộng cơ hội và
        phát triển sự nghiệp. Hãy chọn lĩnh vực bạn quan tâm và bắt đầu hành
        trình học tập ngay hôm nay!
      </p>
    </div>
  </div>
)
