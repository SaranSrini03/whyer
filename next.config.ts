import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/@:username',
        destination: '/:username',
      },
    ];
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  /* config options here */
};

export default nextConfig;
