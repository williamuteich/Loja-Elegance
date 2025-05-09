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
};

export default nextConfig;
