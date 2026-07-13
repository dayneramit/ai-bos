import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: false,
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
