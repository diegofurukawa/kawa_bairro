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
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalizar dependências nativas do metascraper apenas no servidor
      config.externals = config.externals || []
      config.externals.push({
        're2': 'commonjs re2',
        'metascraper': 'commonjs metascraper',
        'metascraper-description': 'commonjs metascraper-description',
        'metascraper-image': 'commonjs metascraper-image',
        'metascraper-title': 'commonjs metascraper-title',
        'metascraper-url': 'commonjs metascraper-url',
        'metascraper-logo-favicon': 'commonjs metascraper-logo-favicon',
      })
    }
    return config
  },
}

module.exports = nextConfig
