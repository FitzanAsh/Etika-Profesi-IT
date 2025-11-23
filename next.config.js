/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.node$/,
            use: 'ignore-loader',
        });

        return config;
    },
    experimental: {
        serverComponentsExternalPackages: ["@xenova/transformers"]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

module.exports = nextConfig;
