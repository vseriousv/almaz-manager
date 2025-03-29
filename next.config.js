/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add debug information output during build and runtime
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Disable server-side rendering for testing
  // This will force components to run only on the client
  experimental: {
    serverMinification: false,
    serverSourceMaps: true,
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
      ],
    },
  },
  webpack: (config) => {
    // Fix for Node.js modules that cannot be used on the client
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false
    };
    
    return config;
  },
  // Disable protection for testing
  output: 'standalone',
  outputFileTracing: true,
};

module.exports = nextConfig; 