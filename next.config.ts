
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    "http://localhost:3000", // Default Next.js dev port
    // Add the specific Cloud Workstations origin seen in the warning
    "https://3000-firebase-studio-1749735464743.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev",
    // You might want a more generic one if the subdomain/cluster ID changes often,
    // but be careful with overly broad wildcards.
    // e.g., "*.cloudworkstations.dev" (but this might be too permissive)
  ],
  experimental: {
    // Any other experimental flags can go here
  }
};

export default nextConfig;
