// @ts-check

const { withContentlayer } = require("next-contentlayer2");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["next-contentlayer2"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.infrastructureLogging = {
      level: "error",
    };

    // Exclude problematic native modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        fsevents: false,
      };
    }

    // Mark native dependencies as external
    config.externals = config.externals || [];
    if (!Array.isArray(config.externals)) {
      config.externals = [config.externals];
    }
    config.externals.push({
      fsevents: "commonjs fsevents",
      imagescript: "commonjs imagescript",
    });

    return config;
  },
  rewrites: async () => [
    {
      source: "/posts/test",
      destination: "/posts/get-started",
    },
  ],
};

module.exports = withContentlayer(nextConfig);
