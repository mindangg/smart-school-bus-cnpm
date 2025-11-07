import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
        ],
    },

    // ==========================================================
    // THÊM PHẦN NÀY ĐỂ CHUYỂN TIẾP (PROXY) API SANG BACKEND
    // ==========================================================
    async rewrites() {
        return [
            {
                source: '/api/:path*', // Bắt tất cả các URL bắt đầu bằng /api
                destination: 'http://localhost:4000/api/:path*', // Chuyển tiếp đến backend
            },
        ]
    },
    // ==========================================================
};

export default nextConfig;
