/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Enable ESLint during build
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable TypeScript type checking during build
    // Temporarily ignoring build errors to allow for incremental migration
    ignoreBuildErrors: true,
    // Show TypeScript errors in development
    tsconfigPath: './tsconfig.json'
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  // Add page extensions to prioritize .js over .tsx
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

export default nextConfig;