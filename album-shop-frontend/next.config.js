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
  // Removed experimental optimizations
};

module.exports = nextConfig; 