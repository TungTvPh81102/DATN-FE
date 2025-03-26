// XÓA FILE

import Image from 'next/image'
import Link from 'next/link'

import InputSeach from '@/components/common/InputSearch'

const Logo = () => (
  <Link href="/" className="flex items-center space-x-3">
    <Image
      src="/images/Logo.png"
      alt="logo"
      width={54}
      height={54}
      className="shrink-0 rounded-md"
    />
    <h2 className="text-3xl font-extrabold">CourseMeLy</h2>
  </Link>
)

const NavLinks = () => {
  const links = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Khoá học', href: '/courses' },
    { label: 'Bài viết', href: '/posts' },
  ]

  return (
    <ul className="flex items-center space-x-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="font-medium hover:underline">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

// const AuthButtons = () => {
//   const router = useRouter()

//   return (
//     <div className="flex items-center space-x-2">
//       <Button
//         variant="secondary"
//         className="text-base font-semibold"
//         onClick={() => router.push('/sign-up')}
//       >
//         Đăng ký
//       </Button>
//       <Button
//         className="text-base font-semibold"
//         onClick={() => router.push('/sign-in')}
//       >
//         Đăng nhập
//       </Button>
//     </div>
//   )
// }

const Header = () => {
  // const user: IUser | null = {
  //   id: 1,
  //   code: 'USR001',
  //   name: 'John Doe',
  //   email: 'johndoe@example.com',
  //   emailVerifiedAt: new Date('2024-12-25T12:00:00Z'),
  //   password: 'securepassword123',
  //   avatar: 'https://example.com/avatar.jpg',
  //   verificationToken: 'abc123xyz',
  //   rememberToken: 'token56789',
  //   status: UserStatus.Active,
  //   deletedAt: null,
  //   createdAt: new Date('2024-01-01T09:00:00Z'),
  //   updatedAt: new Date('2024-12-27T15:30:00Z'),
  // }

  return (
    <header className="sticky inset-x-0 top-0 z-10 flex items-center justify-between bg-white px-32 py-6 shadow-sm">
      <Logo />
      <InputSeach className="w-[340px]" />
      <NavLinks />
      {/* {user ? <UserMenu userData={user} /> : <AuthButtons />} */}
    </header>
  )
}

export default Header
