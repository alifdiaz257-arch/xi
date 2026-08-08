// next.config.js - FULL FIXED
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: ['ui-avatars.com'],
  },
  
  experimental: {
    serverComponentsExternalPackages: ['jszip'],
  },
  
  // OPTIMASI FONT - MATIKAN PRELOAD FONT UNTUK MENGATASI ERROR
  optimizeFonts: false,
  
  webpack: (config, { isServer }) => {
    // Fallback untuk module Node.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
    };
    
    // Aturan untuk file font
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]',
      },
    });
    
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
  
  compress: true,
  swcMinify: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
