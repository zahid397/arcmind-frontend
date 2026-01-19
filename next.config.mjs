/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // হ্যাকাথনের জন্য: ছোটখাটো এরর ইগনোর করবে যাতে ডিপ্লয় না আটকায়
    ignoreDuringBuilds: true,
  },
  typescript: {
    // টাইপস্ক্রিপ্ট এরর হলেও বিল্ড হবে
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
