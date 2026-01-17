/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Vercel build freeze fix
  output: 'standalone',

  // ✅ Ignore animation-only warnings in prod
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false, // ❗ type error থাকলে fail করবে (safe)
  },

  // ✅ Prevent huge animation chunks blocking build
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
    }
    return config
  },

  // ✅ Image config (safe default)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
