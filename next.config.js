/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",   images: { unoptimized: true }, // Required for static export
    trailingSlash: true,
  // Optional: set dynamicParams to false to prevent missing param errors
  dynamicParams: false
};

module.exports = nextConfig;