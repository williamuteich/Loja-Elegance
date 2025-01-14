import type { NextConfig } from "next";

export const experimental_ppr = true;

const nextConfig: NextConfig = {
  experimental: {
    ppr:"incremental"
  }
};

export default nextConfig;
