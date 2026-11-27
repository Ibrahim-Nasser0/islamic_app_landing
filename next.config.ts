import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Accept-CH",
            value: "Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Platform",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
