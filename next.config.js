/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 0, // Ensure dynamic routes are not cached
      static: 180, // Cache static content for 3 minutes
    },
  },
};

module.exports = nextConfig;
