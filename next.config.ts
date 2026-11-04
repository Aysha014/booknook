import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: "export",
  // Repo is served at /booknook-client/ on GitHub Pages
  basePath: "/booknook-client",
  assetPrefix: "/booknook-client/",
  // Required for static export — Next.js image optimisation is server-side only
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },
};

export default nextConfig;

