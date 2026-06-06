import type { NextConfig } from 'next';

const routes = [
    // TODO: Find a way to make this more automatic
    'status',
    'status/discord',
    'analytics',
    'teapot',
    'vscode-tweaks/ping',
    'vscode-tweaks/weather',
];

const nextConfig: NextConfig = {
    async rewrites() {
        return routes.map((route) => ({
            source: `/${route}`,
            destination: `/api/${route}`,
        }));
    },
};

export default nextConfig;
