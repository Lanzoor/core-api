import type { NextConfig } from 'next';

const routes = [
    // this is the only solution for now
    'status',
    'status/discord',
    'discord-status',
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
