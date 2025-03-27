import ProtectedRoute from '@/components/shared/protected-route'

interface LayoutProps {
  children?: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default Layout
