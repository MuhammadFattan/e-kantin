/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  allowedDevOrigins: ['**.manuspre.computer', '**.manus.computer'],
};

export default nextConfig;
