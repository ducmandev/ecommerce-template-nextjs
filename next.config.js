/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "www.pngplay.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
      { protocol: "https", hostname: "be.pozzel.xyz", pathname: "/**" },
    ],
  },
  // Empty turbopack config để tương thích với Next.js 16
  turbopack: {},
  output: "standalone",
};

module.exports = nextConfig;
