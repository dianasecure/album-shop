/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization during build to reduce memory usage
  images: {
    unoptimized: true,
  },
  env: {
    // Environment variables for API URLs
    BACKEND_URL: process.env.BACKEND_URL || 'https://album-shop.up.railway.app',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://album-shop.up.railway.app',
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Optimize build output
  output: 'standalone',
};

module.exports = nextConfig; 