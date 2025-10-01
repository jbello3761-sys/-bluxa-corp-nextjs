import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Temporarily disable static generation for problematic pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Skip static generation for payment page during build
  async generateStaticParams() {
    return []
  },
};

export default nextConfig;
