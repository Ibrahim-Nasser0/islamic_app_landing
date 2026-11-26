import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
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
