// next.config.js - FULL VERSION
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: ['ui-avatars.com'],
  },
  
  experimental: {
    serverComponentsExternalPackages: ['jszip'],
  },
  
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
  
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  
  // Kompresi untuk performa
  compress: true,
  
  // Optimasi gambar
  swcMinify: true,
  
  // Konfigurasi ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Konfigurasi TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
