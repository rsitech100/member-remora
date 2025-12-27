import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3000mb',
    },
    proxyClientMaxBodySize: 3000 * 1024 * 1024, // 3GB in bytes
  },
};

export default nextConfig;
