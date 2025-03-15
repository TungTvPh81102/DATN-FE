import { TableOfContents } from '@/sections/terms/_components/table-of-contents'
import { TermsItem } from '@/sections/terms/_components/terms-item'

export const terms = [
  {
    id: 'general',
    title: 'Điều Khoản Chung',
    terms: [
      'CourseMely cung cấp nền tảng học tập trực tuyến, nơi giảng viên có thể tạo và bán khóa học, học viên có thể đăng ký và tham gia học tập. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân theo các điều khoản và chính sách dưới đây.',
    ],
  },
  {
    id: 'instructor',
    title: 'Quyền và Trách Nhiệm Của Giảng Viên',
    terms: [
      '- Giảng viên phải cung cấp đầy đủ thông tin cá nhân và xác minh danh tính để được tạo khóa học.',
      '- Nội dung khóa học phải tuân thủ pháp luật, không chứa nội dung vi phạm bản quyền hoặc gây hại.',
      '- Giảng viên chịu trách nhiệm về nội dung, cập nhật và phản hồi học viên trong quá trình giảng dạy.',
    ],
  },
  {
    id: 'revenue',
    title: 'Chính Sách Chia Sẻ Doanh Thu',
    terms: [
      '- Doanh thu từ khóa học được chia theo tỷ lệ 60:40 (60% cho giảng viên, 40% cho nền tảng).',
      '- Thanh toán doanh thu sẽ được thực hiện hàng tháng qua các phương thức thanh toán hợp lệ.',
      '- Tỷ lệ doanh thu có thể thay đổi dựa trên chương trình khuyến mãi hoặc chính sách đặc biệt.',
    ],
  },
  {
    id: 'student',
    title: 'Quyền và Trách Nhiệm Của Học Viên',
    terms: [
      '- Học viên có quyền truy cập và học tập các khóa học đã đăng ký theo điều kiện của giảng viên.',
      '- Học viên không được chia sẻ khóa học dưới bất kỳ hình thức nào, vi phạm sẽ bị khóa tài khoản.',
    ],
  },
  {
    id: 'refund',
    title: 'Chính Sách Hoàn Tiền',
    terms: [
      '- Học viên có thể yêu cầu hoàn tiền trong vòng 7 ngày nếu khóa học không đúng mô tả.',
      '- Hoàn tiền chỉ áp dụng với những khóa học chưa được học quá 20% nội dung.',
      '- CourseMely có quyền từ chối hoàn tiền nếu học viên có hành vi gian lận.',
    ],
  },
  {
    id: 'prohibited',
    title: 'Hành Vi Bị Cấm',
    terms: [
      '- Chia sẻ, sao chép hoặc phát tán nội dung khóa học mà không có sự cho phép.',
      '- Sử dụng nền tảng để truyền bá nội dung phản cảm, vi phạm pháp luật.',
      '- Nghiêm cấm mọi hành vi gian lận trong các bài kiểm tra, bài quiz hoặc chứng chỉ khóa học.',
    ],
  },

  {
    id: 'support',
    title: 'Chính Sách Hỗ Trợ & Khiếu Nại',
    terms: [
      '- Học viên & giảng viên có thể liên hệ bộ phận hỗ trợ nếu gặp sự cố trong quá trình sử dụng nền tảng.',
      '- Khiếu nại về khóa học hoặc thanh toán sẽ được xử lý trong vòng 7 ngày làm việc.',
    ],
  },
  {
    id: 'privacy',
    title: 'Chính Sách Bảo Mật & Quyền Riêng Tư',
    terms: [
      '- CourseMely cam kết bảo vệ dữ liệu cá nhân của người dùng.',
      '- Dữ liệu cá nhân sẽ không được chia sẻ với bên thứ ba nếu không có sự đồng ý của người dùng.',
    ],
  },
  {
    id: 'course-content',
    title: 'Chính Sách Về Nội Dung Khóa Học',
    terms: [
      '- Khóa học không được chứa nội dung vi phạm đạo đức, tôn giáo, hoặc phân biệt chủng tộc.',
      '- Giảng viên chịu trách nhiệm về bản quyền nội dung trong khóa học của mình.',
    ],
  },
  {
    id: 'rights',
    title: 'Quyền Của CourseMely',
    terms: [
      '- CourseMely có quyền sửa đổi, bổ sung các điều khoản theo thời gian để phù hợp với chính sách phát triển.',
      '- Chúng tôi có quyền gỡ bỏ khóa học hoặc tài khoản nếu phát hiện vi phạm điều khoản.',
    ],
  },
]

export const TermsView = () => {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6 sm:px-6">
      {/* Nội dung chính */}
      <div className="flex-1">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Điều Khoản Sử Dụng
        </h1>

        {terms.map((term, index) => (
          <TermsItem
            id={term.id}
            terms={term.terms}
            title={term.title}
            index={index + 1}
            key={index}
          />
        ))}
      </div>

      {/* Mục Lục */}
      <TableOfContents />
    </div>
  )
}
