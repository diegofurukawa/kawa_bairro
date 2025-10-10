/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    domains: [],
  },
  output: 'standalone',
  devIndicators: {
    buildActivity: false,
  },
}

module.exports = nextConfig
