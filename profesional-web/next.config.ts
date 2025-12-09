import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

// Bundle Analyzer (FJG-57: Performance Optimization)
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
