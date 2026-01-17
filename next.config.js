/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 🔥 THIS FIXES VERCEL BUILD STUCK
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
