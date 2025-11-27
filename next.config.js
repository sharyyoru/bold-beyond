/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // Enable static export for Capacitor
  output: process.env.CAPACITOR_BUILD ? 'export' : undefined,
};

module.exports = nextConfig;
