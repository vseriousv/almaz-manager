/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Добавляю вывод отладочной информации при сборке и запуске
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Отключаю сервер-рендеринг для тестирования
  // Это заставит компонент выполняться только на клиенте
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
    // Фикс для модулей Node.js, которые не могут быть использованы на клиенте
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false
    };
    
    return config;
  },
  // Отключаем защиту для тестирования
  output: 'standalone',
  outputFileTracing: true,
};

module.exports = nextConfig; 