/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    domains: [],
  },
  // Removido output: 'standalone' que estava causando problemas
  // devIndicators: {
  //   buildActivity: false,
  // },
}

module.exports = nextConfig
