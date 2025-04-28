import { ProfileView } from '@/sections/profile/view/profile-view'
import { Metadata } from 'next'

type Props = {
  params: {
    code: string
  }
}

export const metadata: Metadata = {
  title: 'Thông tin chi tiết giảng viên',
  description:
    'Khám phá thông tin chi tiết về giảng viên, bao gồm hồ sơ, kinh nghiệm giảng dạy, các khóa học đã giảng dạy và đánh giá từ học viên. Cập nhật thông tin về giảng viên để hiểu rõ hơn về chất lượng giảng dạy và phong cách học tập.',
}

const Profile = ({ params }: Props) => {
  const { code } = params

  return <ProfileView code={code} />
}

export default Profile
