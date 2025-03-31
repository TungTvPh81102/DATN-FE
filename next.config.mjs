/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/instructor/settings',
        destination: '/instructor/settings/profile',
        permanent: true,
      },
    ]
  },
  reactStrictMode: false,
}

export default nextConfig
