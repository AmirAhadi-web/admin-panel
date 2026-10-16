import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images may come from user-provided URLs, so any https host is allowed.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
