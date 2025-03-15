import { BookCopy, Clock, Mail, MapPin, Phone, Users } from 'lucide-react'
import { timeAgo } from '@/lib/common'
import Link from 'next/link'

type Props = {
  totalFollowers: number
  totalCourses: number
  timeJoined: Date
  email?: string
  address?: string
  phone?: string
}

export const UserAbout = ({
  totalFollowers,
  totalCourses,
  timeJoined,
  email,
  address,
  phone,
}: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Users size={20} />{' '}
          <p className="ml-1">
            <strong>{totalFollowers}</strong> theo dõi
          </p>
        </div>

        <strong>·</strong>

        <div className="flex items-center">
          <BookCopy size={20} />{' '}
          <p className="ml-2">
            <strong>{totalCourses}</strong> khoá học
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <Clock size={20} />
        <p>
          Tham gia{' '}
          <Link href="/">
            <strong>CourseMely</strong>
          </Link>{' '}
          từ {timeAgo(`${timeJoined}`)}
        </p>
      </div>

      {email && (
        <div className="flex items-center space-x-1">
          <Mail size={20} />
          <p>{email}</p>
        </div>
      )}

      {phone && (
        <div className="flex items-center space-x-1">
          <Phone size={20} />
          <p>{phone}</p>
        </div>
      )}

      {address && (
        <div className="flex items-center space-x-1">
          <MapPin size={20} />
          <p>{address}</p>
        </div>
      )}
    </div>
  )
}
