import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent static generation of dynamic routes
  output: "standalone",

  /* config options here */
  cacheComponents: true,
  // Optional: Ignore TypeScript errors during build (if needed)
  typescript: {
    ignoreBuildErrors: false, // Keep false for production, true only if you have unfixable errors
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        port: "",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Optional: environment variable handling
  env: {
    // Make sure critical env vars are available at build time if needed
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
};

export default nextConfig;
