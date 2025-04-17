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
}

export default config 