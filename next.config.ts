import { stat } from "fs";
import type { NextConfig } from "next";
import dynamic from "next/dynamic";


const nextConfig: NextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 60,
            static: 180,
        }
    }
};

export default nextConfig;
