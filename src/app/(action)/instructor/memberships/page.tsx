import Container from '@/components/shared/container'
import { Metadata } from 'next'
import { MembershipsTable } from './_components/memberships-table'

export const metadata: Metadata = {
  title: 'Quản lý gói thành viên',
}

const page = () => {
  return (
    <Container>
      <h1 className="text-2xl font-medium">Quản lý gói thành viên</h1>

      <MembershipsTable />
    </Container>
  )
}

export default page
