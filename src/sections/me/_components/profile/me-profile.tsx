import { useGetProfile } from '@/hooks/profile/useProfile'
import ProfileMeView from '@/sections/me/_components/profile/_components/profile'
import { useEffect } from 'react'
import { setLocalStorage } from '@/lib/common'

const MeProfile = () => {
  const { data: profileData, isLoading: isLoadingProfileData } = useGetProfile()

  useEffect(() => {
    const profile = profileData?.data?.user?.profile

    if (profile?.phone && profile?.address) {
      setLocalStorage('checkProfile', true)
    } else {
      setLocalStorage('checkProfile', false)
    }
  }, [profileData])

  // if (isLoadingProfileData) {
  //   return (
  //     <div className="mt-20">
  //       <Loader2 className="mx-auto size-8 animate-spin" />
  //     </div>
  //   )
  // }
  return (
    <div>
      <div className="section-setting-right">
        <div className="box">
          <div className="widget-tabs style-small">
            <ul className="widget-menu-tab overflow-x-auto">
              <li className="mb-4 text-2xl font-semibold">Hồ sơ</li>
            </ul>
            <div className="widget-content-tab">
              <ProfileMeView
                profileData={profileData}
                isLoadingProfileData={isLoadingProfileData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeProfile
