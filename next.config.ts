import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fuadhdurzjoasmoqener.supabase.co',
        pathname: '/storage/v1/object/public/elegance/**',
      },
    ],
  },
  experimental: {
    useCache: true,
  },
  async headers() {
    return [
      {
        source: '/:all*.(png|jpg|jpeg|gif|svg|webp|ico|woff2|woff|ttf|eot|css|js)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ]
  },
};

export default nextConfig;
