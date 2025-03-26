'use client'

import React, { useEffect, useState } from 'react'

import MeOrder from './order/order'
import MeProfile from '@/sections/me/_components/profile/me-profile'
import MePassWord from '@/sections/me/_components/password/me-password'
import MeBio from '@/sections/me/_components/bio/me-bio'
import { BadgeCheck, CircleUser, FileLock2, Gem } from 'lucide-react'
import MeMembership from '@/sections/me/_components/membership/membership'

const menuItems = [
  {
    icon: <CircleUser size={21} />,
    label: 'Hồ sơ',
    component: <MeProfile />,
  },
  {
    icon: <FileLock2 size="21" />,
    label: 'Mật khẩu',
    component: <MePassWord />,
  },
  {
    icon: <i className="flaticon-bag"></i>,
    label: 'Khóa học đã mua',
    component: <MeOrder />,
  },
  {
    icon: <Gem size="18" />,
    label: 'Gói thành viên',
    component: <MeMembership />,
  },
  {
    icon: <BadgeCheck size="21" />,
    label: 'Mạng xã hội',
    component: <MeBio />,
  },
]
const MeSideBar = ({
  onSelect,
}: {
  onSelect: (component: React.ReactNode) => void
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => {
    onSelect(menuItems[activeIndex].component)
  }, [activeIndex, onSelect])
  return (
    <div className="dashboard_navigationbar">
      <div className="dropbtn">
        <i className="icon-home"></i> Dashboard Navigation
      </div>
      <div className="instructors-dashboard">
        <div className="dashboard-title">STUDENT DASHBOARD</div>
        {menuItems.map((item, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={item.label}
              onClick={() => {
                setActiveIndex(index)
                onSelect(item.component)
              }}
              className={`dashboard-item cursor-pointer ${
                isActive ? 'active' : 'hover:bg-blue-900/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MeSideBar
