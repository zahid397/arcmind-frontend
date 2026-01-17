/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ REQUIRED for Vercel stability
  output: 'standalone',

  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
