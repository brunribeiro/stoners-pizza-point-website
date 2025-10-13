/** @type {import('next').NextConfig} */
import nextTranslate from 'next-translate';
import bundleAnalyzer from '@next/bundle-analyzer';
import './lib/env.js';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,

  // Image optimization for Vercel
  images: {
    domains: [
      's3.amazonaws.com',
      'incentivio.s3.amazonaws.com',
      'incentivio.knovator.in',
      'stonerspizzadirectus.techtris.app',
      'techtris.stonerspizza.app',
      'www.google.com',
      'd1l12lvgx8sdvb.cloudfront.net',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.posthog.com https://app.atlas.so https://www.google.com https://maps.googleapis.com https://www.gstatic.com https://www.googletagmanager.com https://core.spreedly.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com data:;
              img-src 'self' data: https: blob:;
              connect-src 'self' https://app.posthog.com https://incentivio.knovator.in https://techtris.stonerspizza.app https://maps.googleapis.com https://o4504451379290112.ingest.us.sentry.io https://core.spreedly.com;
              frame-src 'self' https://www.google.com https://core.spreedly.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self' https://core.spreedly.com;
              frame-ancestors 'self';
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
      },
    ];
  },

  publicRuntimeConfig: {
    NEXT_PUBLIC_FETCH_URL: process.env.NEXT_PUBLIC_FETCH_URL,
    NEXT_PUBLIC_DOMAIN_URL: process.env.NEXT_PUBLIC_DOMAIN_URL,
    NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY: process.env.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },

  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Shared components used across pages
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 10,
          },
          // Separate chunk for React and React-DOM
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 30,
          },
          // Separate chunk for Google Maps
          maps: {
            test: /[\\/]node_modules[\\/](@react-google-maps|use-places-autocomplete)[\\/]/,
            name: 'maps',
            priority: 25,
          },
          // Separate chunk for UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](@mui|@emotion|@headlessui)[\\/]/,
            name: 'ui',
            priority: 20,
          },
          // All other node_modules
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = match ? match[1] : 'vendor';
              return `npm.${packageName.replace('@', '')}`;
            },
            priority: 5,
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextTranslate(nextConfig));
