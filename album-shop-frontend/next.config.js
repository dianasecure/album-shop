/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  output: 'standalone',
  
  // Aggressive memory optimizations
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: false, // Disable strict mode to reduce memory usage
  
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: true,
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
  
  // Reduce memory usage during build
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'recharts'],
    // Disable features that consume more memory
    serverActions: false,
    serverComponentsExternalPackages: [],
  },
  
  // Aggressive webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
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