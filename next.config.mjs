/** @type {import('next').NextConfig} */
const config = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'msw/node': false,
      }
    }
    return config
  },
  // Configuration pour les attributs HTML personnalisés
  eslint: {
    ignoreDuringBuilds: true,
  }
}

export default config 