import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.ultramaille.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/wzetrnif/**",
      },
    ],
  },
};

export default nextConfig;
