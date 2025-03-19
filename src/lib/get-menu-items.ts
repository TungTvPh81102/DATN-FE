import {
  BadgeCheck,
  BadgeEuro,
  Book,
  Building2,
  ChartPie,
  Database,
  Link2,
  LucideProps,
  MessageSquareQuote,
  MessageSquareText,
  TicketPercent,
  User,
  UsersRound,
  Video,
} from 'lucide-react'

import React from 'react'

type type = 'settings' | 'instructor'
type MenuItem = {
  title: string
  url: string
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  items?: {
    title: string
    url: string
  }[]
}

export const getMenuItem = (type: type = 'instructor'): MenuItem[] => {
  switch (type) {
    case 'instructor':
      return [
        {
          title: 'Thống kê',
          url: '/instructor',
          icon: ChartPie,
        },
        {
          title: 'Quản lý khoá học',
          url: '#',
          icon: Book,
          items: [
            {
              title: 'Khoá học của bạn',
              url: '/instructor/courses',
            },
            {
              title: 'Quản lý học viên',
              url: '/instructor/learner-manage',
            },
            {
              title: 'Theo dõi tiến độ',
              url: '#',
            },
          ],
        },
        {
          title: 'Trò chuyện',
          url: '/instructor/chat',
          icon: UsersRound,
        },
        {
          title: 'Bài viết',
          url: '/instructor/posts',
          icon: MessageSquareText,
        },
        {
          title: 'Đánh giá',
          url: '/instructor/evaluation',
          icon: MessageSquareQuote,
        },
        {
          title: 'Mã giảm giá',
          url: '/instructor/coupon',
          icon: TicketPercent,
        },
        {
          title: 'Gói thành viên',
          url: '/instructor/memberships',
          icon: UsersRound,
        },
        {
          title: 'Lịch sử mua',
          url: '/instructor/transaction',
          icon: BadgeEuro,
        },
        {
          title: 'Giao dịch của tôi',
          url: '/instructor/with-draw-request',
          icon: Database,
        },
        {
          title: 'Luồng trực tuyến',
          url: '/instructor/with-draw-request',
          icon: Video,
        },
      ]
    case 'settings':
      return [
        {
          title: 'Hồ sơ',
          url: '/instructor/settings/profile',
          icon: User,
        },
        {
          title: 'Mạng xã hội',
          url: '/instructor/settings/social',
          icon: Link2,
        },
        {
          title: 'Nghề nghiệp',
          url: '/instructor/settings/careers',
          icon: Building2,
        },
        {
          title: 'Chứng chỉ',
          url: '/instructor/settings/certificates',
          icon: BadgeCheck,
        },
      ]
    default:
      return []
  }
}
