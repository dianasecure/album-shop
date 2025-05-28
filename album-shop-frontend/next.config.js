/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization during build to reduce memory usage
  images: {
    unoptimized: true,
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Optimize build output
  output: 'standalone',
  // Reduce memory usage during build
  experimental: {
    optimizePackageImports: ['@testing-library/react', 'recharts'],
  },
};

module.exports = nextConfig; 