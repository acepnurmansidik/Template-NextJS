import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost"],
    formats: ["image/avif", "image/webp"],
  },

  reactCompiler: true,
};

export default nextConfig;
