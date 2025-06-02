import { NextConfig } from 'next';

// const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // basePath: isProd ? '/next-js-snap-test' : '',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
    trailingSlash: true,
  // Optional: set dynamicParams to false to prevent missing param errors
};

export default nextConfig;


