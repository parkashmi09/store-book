/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['img.icons8.com', /* add your other image domains here */],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig