import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This will allow all domains - adjust based on your security needs
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
