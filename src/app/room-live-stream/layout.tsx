import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen bg-background">{children}</div>
}

export default Layout
