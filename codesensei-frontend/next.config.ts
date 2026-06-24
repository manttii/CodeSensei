import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Next.js server-side output (not static export)
  // which is required for middleware / proxy and API routes on Vercel
  output: undefined,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  },
};

export default nextConfig;
