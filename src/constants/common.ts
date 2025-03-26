import { IQuestionTeacher } from '@/types'

export const questions: IQuestionTeacher[] = [
  {
    id: 1,
    title: 'Kinh nghiệm Giảng dạy',
    description:
      'Hãy chia sẻ về kinh nghiệm giảng dạy trước đây của bạn, bao gồm cả việc giảng dạy trên các hệ thống học trực tuyến nếu bạn đã từng tham gia.',
    question: 'Bạn đã từng giảng dạy trên hệ thống học trực tuyến nào chưa?',
    options: ['Đã từng', 'Chưa từng'],
  },
  {
    id: 2,
    title: 'Kinh nghiệm chuyên môn',
    description: 'Hãy chia sẻ về kinh nghiệm chuyên môn của bạn.',
    question: 'Bạn đã từng làm việc trong lĩnh vực giáo dục chưa?',
    options: ['Đã từng', 'Chưa từng'],
  },
  {
    id: 3,
    title: 'Vai trò trong Học tập Trực tuyến',
    description:
      'Chúng tôi muốn biết bạn nhìn nhận thế nào về vai trò của mình trong việc tạo ra trải nghiệm học tập tốt hơn cho học viên trực tuyến.',
    question:
      'Bạn nghĩ gì về vai trò của mình trong việc tạo ra trải nghiệm học tập tốt hơn cho học viên trực tuyến?',
    options: [
      'Giúp học viên dễ dàng tiếp cận và hiểu bài hơn',
      'Tạo không gian học tập linh hoạt và tiện lợi',
      'Đảm bảo cung cấp tài liệu và nguồn học tập chất lượng',
      'Khác',
    ],
  },
  {
    id: 4,
    title: 'Hỗ trợ Học viên',
    description:
      'Chúng tôi đánh giá cao việc hỗ trợ học viên. Hãy cho biết bạn có sẵn sàng giúp đỡ học viên khi họ gặp khó khăn trong quá trình học tập không.',
    question: 'Bạn có sẵn sàng hỗ trợ học viên khi gặp vướng mắc không?',
    options: [
      'Luôn sẵn sàng',
      'Sẵn sàng trong khung giờ quy định',
      'Chỉ hỗ trợ trong giờ học',
    ],
  },
]

export const PLACEHOLDER_AVATAR =
  'https://res.cloudinary.com/dvrexlsgx/image/upload/v1732148083/Avatar-trang-den_apceuv_pgbce6.png'

export const PLACEHOLDER_IMAGE =
  'https://res.cloudinary.com/dvrexlsgx/image/upload/v1741966561/placeholder-16-9-26571_1080x675_zeynku.jpg'
