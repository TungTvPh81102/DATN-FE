'use client'

import ModalLoading from '@/components/common/ModalLoading'
import Container from '@/components/shared/container'
import { useGetProfile } from '@/hooks/profile/useProfile'
import CareersSection from '@/sections/instructor/components/settings/career-section'
import { CertificateSection } from '@/sections/instructor/components/settings/certificate-section'
import { ProfileSection } from '../components/settings/profile-section'
import { SocialSection } from '../components/settings/social-section'
import LiveAccessSession from '@/sections/instructor/components/settings/live-access-session'

const SettingsView = ({ tab }: { tab: string }) => {
  const { data: getProfile, isLoading } = useGetProfile()

  if (isLoading) return <ModalLoading />

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0 h-72 bg-gradient-to-br from-orange-500 to-yellow-400">
        <div className="absolute inset-0 bg-white/10">
          <svg className="size-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 40L40 0M0 0L40 40"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-white/20"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
      </div>

      <Container className="absolute top-12">
        {(() => {
          switch (tab) {
            case 'profile':
              return <ProfileSection userData={getProfile?.data} />
            case 'social':
              return <SocialSection socialData={getProfile?.data} />
            case 'careers':
              return (
                <CareersSection careersData={getProfile?.data?.user?.profile} />
              )
            case 'certificates':
              return (
                <CertificateSection
                  certificateData={getProfile?.data?.user?.profile}
                />
              )
            case 'live-access':
              return <LiveAccessSession />
            default:
              return null
          }
        })()}
      </Container>
    </div>
  )
}
export default SettingsView
