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
      bodySizeLimit: '30000mb',
    },
    proxyClientMaxBodySize: 30000 * 1024 * 1024, // 30GB in bytes
  },
};

export default nextConfig;
