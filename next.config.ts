import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Project images entered in /admin may be hosted elsewhere (GitHub, a CDN…).
    // Only the admin can set these URLs.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: {
      // Image uploads from /admin (3.5 MB max) + form fields; Vercel caps bodies at 4.5 MB.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
