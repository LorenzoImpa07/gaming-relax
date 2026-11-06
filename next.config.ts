import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      {
        protocol: "https",
        hostname: "gaming-relax-programmazione.firebasestorage.app",
      },
      {
        protocol: "https",
        hostname: "gaming-relax-programmazione.appspot.com",
      },
    ],
  },
};

export default nextConfig;
