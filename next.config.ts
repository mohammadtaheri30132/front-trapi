import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // نادیده گرفتن خطاهای TypeScript در زمان بیلد
},
eslint: {
    ignoreDuringBuilds: true, // نادیده گرفتن خطاهای ESLint در زمان بیلد
},
};

export default nextConfig;
