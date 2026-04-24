import type { NextConfig } from 'next';

const routes = ['status', 'discord-status', 'vscode-tweaks/ping', 'vscode-tweaks/weather'];

const nextConfig: NextConfig = {
    async rewrites() {
        return routes.map((route) => ({
            source: `/${route}`,
            destination: `/api/${route}`,
        }));
    },
};

export default nextConfig;
