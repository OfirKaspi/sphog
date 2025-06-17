import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com https://www.googletagmanager.com https://va.vercel-scripts.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: https://res.cloudinary.com;
              frame-src https://www.youtube.com https://www.youtube-nocookie.com;
              connect-src 'self' https://va.vercel-scripts.com https://www.google-analytics.com;
            `.replace(/\n/g, "").trim()
          },          
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "Cache-Control", // Add Cache-Control header
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
