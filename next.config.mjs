/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // AVIF first (best quality per KB), WebP as fallback for older browsers
        formats: ['image/avif', 'image/webp'],
        // 75 = thumbnails/diary, 90 = images inside posts (high quality showcase)
        qualities: [75, 90],
        // Keep optimized images cached for 31 days (fewer re-encodes on Vercel)
        minimumCacheTTL: 2678400,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
        ],
    },
};

export default nextConfig;
