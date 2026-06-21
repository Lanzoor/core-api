import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import ipaddr from 'ipaddr.js';

const redis = Redis.fromEnv();

type RateLimitWindow = {
    preset: string;
    key: string;
    limiter: Ratelimit;
};

export namespace rateLimits {
    export const lenient: RateLimitWindow[] = [
        {
            preset: 'lenient',
            key: 'per-sec',
            limiter: new Ratelimit({
                redis,
                limiter: Ratelimit.slidingWindow(5, '1 s'),
                analytics: true,
            }),
        },

        {
            preset: 'lenient',
            key: 'per-min',
            limiter: new Ratelimit({
                redis,
                limiter: Ratelimit.slidingWindow(60, '60 s'),
                analytics: true,
            }),
        },
    ];

    export const normal: RateLimitWindow[] = [
        {
            preset: 'normal',
            key: 'per-sec',
            limiter: new Ratelimit({
                redis,
                limiter: Ratelimit.slidingWindow(5, '1 s'),
                analytics: true,
            }),
        },

        {
            preset: 'normal',
            key: 'per-min',
            limiter: new Ratelimit({
                redis,
                limiter: Ratelimit.slidingWindow(20, '60 s'),
                analytics: true,
            }),
        },
    ];

    export const strict: RateLimitWindow[] = [
        {
            preset: 'strict',
            key: 'per-sec',
            limiter: new Ratelimit({
                redis,
                limiter: Ratelimit.slidingWindow(2, '1 s'),
                analytics: true,
            }),
        },

        {
            preset: 'strict',
            key: 'per-min',
            limiter: new Ratelimit({
                redis,
                limiter: Ratelimit.slidingWindow(10, '60 s'),
                analytics: true,
            }),
        },
    ];

    export const paranoid: RateLimitWindow[] = [
        {
            preset: 'paranoid',
            key: 'per-min',
            limiter: new Ratelimit({
                redis,
                limiter: Ratelimit.slidingWindow(1, '1 m'),
                analytics: true,
            }),
        },
    ];
}

function isValidIp(ip: string): boolean {
    return ipaddr.isValid(ip);
}

function getClientIp(req: NextRequest): string {
    const vercelIp = req.headers.get('x-vercel-ip');

    if (vercelIp && isValidIp(vercelIp)) {
        return vercelIp;
    }

    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        const ip = forwardedFor.split(',')[0].trim();
        if (isValidIp(ip)) return ip;
    }

    const realIp = req.headers.get('x-real-ip');
    if (realIp && isValidIp(realIp)) {
        return realIp;
    }

    return `anonymous:${crypto.randomUUID()}`;
}

export async function rateLimit(req: NextRequest, limitWindows: RateLimitWindow[]): Promise<NextResponse | null> {
    try {
        const ip = getClientIp(req);

        for (const limitWindow of limitWindows) {
            const { success, limit, remaining, reset } = await limitWindow.limiter.limit(`${ip}:${limitWindow.key}`);

            if (!success) {
                return NextResponse.json(
                    {
                        error: 'Too many requests in a certain window',
                        message: "You're being rate limited!\nPlease refer to https://api.lanzoor.dev/docs/rate-limit for more information.",
                    },
                    {
                        status: 429,
                        headers: {
                            'X-RateLimit-Preset': limitWindow.key,
                            'X-RateLimit-Limit': limit.toString(),
                            'X-RateLimit-Reset': reset.toString(),
                            'Retry-After': Math.max(0, Math.ceil((reset - Date.now()) / 1000)).toString(),
                        },
                    }
                );
            }
        }

        return null;
    } catch (err) {
        console.error('Rate limit error:', err);
        return null;
    }
}
