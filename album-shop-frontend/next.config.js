/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  output: 'standalone',
  
  // Basic optimizations
  poweredByHeader: false,
  reactStrictMode: false,
  
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: true,
    minimumCacheTTL: 60,
  },
  
  // Production optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig 