/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/seed/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      }
    ],
  },
  // Disable linting during build - we should run it separately
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable type checking during build - we should run it separately
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig; 